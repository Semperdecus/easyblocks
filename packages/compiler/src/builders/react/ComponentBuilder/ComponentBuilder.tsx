/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

import {
  ComponentPickerClosedEvent,
  componentPickerOpened,
  ContextProps,
  findComponentDefinitionById,
  getComponentMainType,
  InternalComponentDefinition,
  isEmptyRenderableContent,
  isNonEmptyRenderableContent,
  isRenderableContent,
  isResourceSchemaProp,
  isSchemaPropAction,
  isSchemaPropActionTextModifier,
  isSchemaPropCollection,
  isSchemaPropComponent,
  isSchemaPropComponentOrComponentCollection,
  isSchemaPropTextModifier,
  isTrulyResponsiveValue,
  itemInserted,
  ResolvedResourceProp,
  responsiveValueMap,
  splitTemplateName,
} from "@easyblocks/app-utils";
import {
  CompiledComponentConfig,
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
  CustomResourceSchemaProp,
  FetchOutputCompoundResources,
  getResourceType,
  getResourceValue,
  isLocalTextResource,
  Metadata,
  ResolvedResource,
  Resource,
  ResourceSchemaProp,
  ResponsiveValue,
  UnresolvedResource,
} from "@easyblocks/core";
import React, { Fragment, ReactElement } from "react";
import { SetRequired } from "type-fest";
import { isTracingSchemaProp } from "../../../tracing";
import { trace } from "./trace";
import { withImpressionTracking } from "./withImpressionTracking";

function buildBoxes(
  compiled: any,
  name: string,
  actionWrappers: { [key: string]: any },
  meta: any
): any {
  const { Box } = meta.code;

  if (Array.isArray(compiled)) {
    return compiled.map((x: any, index: number) =>
      buildBoxes(x, `${name}.${index}`, actionWrappers, meta)
    );
  } else if (typeof compiled === "object" && compiled !== null) {
    if (compiled.__isBox) {
      const boxProps = {
        __compiled: compiled,
        __name: name,
        devices: meta.vars.devices,
        stitches: meta.shopstoryProviderContext.stitches,
      };

      if (compiled.__action) {
        const actionWrapper = actionWrappers[compiled.__action];

        if (!actionWrapper) {
          throw new Error("Can't find action wrapper: " + compiled.__action);
        }

        return actionWrapper(Box, boxProps);
      }

      return <Box {...boxProps} />;
    }

    const ret: Record<string, any> = {};

    for (const key in compiled) {
      ret[key] = buildBoxes(compiled[key], key, actionWrappers, meta);
    }
    return ret;
  }
  return compiled;
}

/**
 * the purpose of LinkWrapper is just to move passedProps into componentProps.
 *
 * It's much better DX for developers. All dev must do is pass componentProps to Component and all props are there:
 * - props like "as", "href", etc returned from actionWrapper
 * - "passedProps" from component code <Link data-custom-attr="test" />
 */
function LinkWrapper(props: any) {
  const {
    LinkProvider,
    Component,
    componentProps,
    values,
    passedProps,
    children,
  } = props;

  return React.createElement(LinkProvider, {
    Component,
    componentProps: {
      children,
      ...componentProps, // componentProps.children must be AFTER children, it's more important.
      ...passedProps,
    },
    values,
  });
}

const missingActionInstance = (name: string) => () => {
  console.error(`Missing action instance in ShopstoryProvider for: ${name}`);
};

const missingLinkInstance =
  (name: string) =>
  ({ Component, componentProps, values }: any) => {
    console.error(`Missing link instance in ShopstoryProvider for: ${name}`);
    return <Component {...componentProps} />;
  };

function getComponentDefinition(
  compiled: CompiledComponentConfig,
  runtimeContext: any
) {
  return findComponentDefinitionById(
    splitTemplateName(compiled._template).name,
    // @ts-ignore
    runtimeContext
  );
}

/**
 * Checks whether:
 * 1. component is renderable (if all non-optional externals are defined)
 * 2. is data loading...
 * 3. gets fields that are not defined
 *
 * @param compiled
 * @param runtimeContext
 * @param rendererContext
 */

type RenderabilityStatus = {
  renderable: boolean;
  isLoading: boolean;
  fieldsRequiredToRender: string[];
};

function getRenderabilityStatus(
  compiled: CompiledComponentConfig,
  meta: any
): RenderabilityStatus {
  const status: RenderabilityStatus = {
    renderable: true,
    isLoading: false,
    fieldsRequiredToRender: [],
  };

  const componentDefinition = getComponentDefinition(compiled, {
    definitions: meta.vars.definitions,
  });

  if (!componentDefinition) {
    return { renderable: false, isLoading: false, fieldsRequiredToRender: [] };
  }

  const mappedSchema = componentDefinition.schema.map((schema) => {
    if (isResourceSchemaProp(schema)) {
      if (
        schema.type === "resource" &&
        (schema.resourceType === "image" || schema.resourceType === "video")
      ) {
        const resourceSchemaProp: CustomResourceSchemaProp = {
          ...schema,
          optional: true,
        };

        return resourceSchemaProp;
      }
    }

    return schema;
  });

  const requiredResourceFields = mappedSchema.filter(
    (resource): resource is CustomResourceSchemaProp => {
      return (
        isResourceSchemaProp(resource) &&
        !resource.optional &&
        resource.type !== "text"
      );
    }
  );

  if (requiredResourceFields.length === 0) {
    return status;
  }

  for (let i = 0; i < requiredResourceFields.length; i++) {
    const resourceSchemaProp = requiredResourceFields[i];
    const resource = meta.resources.find(
      (resource: Resource) =>
        resource.id === `${compiled._id}.${resourceSchemaProp.prop}`
    );
    const resourceValue = resource ? getResourceValue(resource) : undefined;

    const isLoading =
      status.isLoading ||
      (resource !== undefined &&
        (resource.status === "loading" ||
          (resource.status === "success" &&
            isEmptyRenderableContent(resourceValue))));

    status.isLoading = isLoading;

    const isDefined =
      resource !== undefined &&
      resource.status === "success" &&
      (isRenderableContent(resourceValue)
        ? isNonEmptyRenderableContent(resourceValue)
        : true);

    status.renderable = status.renderable && isDefined;

    if (!isDefined) {
      status.fieldsRequiredToRender.push(
        resourceSchemaProp.label || resourceSchemaProp.prop
      );
    }
  }

  return status;
}

function getCompiledSubcomponents(
  compiledArray: (
    | CompiledShopstoryComponentConfig
    | CompiledCustomComponentConfig
  )[],
  contextProps: ContextProps,
  schemaProp:
    | ComponentSchemaProp
    | ComponentFixedSchemaProp
    | ComponentCollectionSchemaProp
    | ComponentCollectionLocalisedSchemaProp,
  path: string,
  meta: any,
  isEditing: boolean
) {
  const originalPath = path;
  const {
    Placeholder,
    EditableComponentBuilderClient,
    EditableComponentBuilderEditor,
  } = meta.code;

  if (schemaProp.type === "component-collection-localised") {
    path = path + "." + meta.vars.locale;
  }

  const EditableComponentBuilder = isEditing
    ? EditableComponentBuilderEditor
    : EditableComponentBuilderClient;

  let elements = compiledArray.map((compiledChild, index) => (
    <EditableComponentBuilder
      compiled={compiledChild}
      schemaProp={schemaProp}
      index={index}
      contextProps={contextProps}
      path={`${path}.${index}`}
      meta={meta}
    />
  ));

  // TODO: this code should be editor-only
  if (
    isEditing &&
    elements.length === 0 &&
    !contextProps.noInline &&
    // We don't want to show add button for this type
    schemaProp.type !== "component-collection-localised"
  ) {
    const componentTypes =
      schemaProp.type === "component-fixed"
        ? [schemaProp.componentType]
        : schemaProp.componentTypes;
    const type = getComponentMainType(componentTypes);
    elements = [
      <Placeholder
        type={type}
        onClick={() => {
          function handleComponentPickerCloseMessage(
            event: ComponentPickerClosedEvent
          ) {
            if (
              event.data.type === "@shopstory-editor/component-picker-closed"
            ) {
              window.removeEventListener(
                "message",
                handleComponentPickerCloseMessage
              );

              if (event.data.payload.config) {
                window.parent.postMessage(
                  itemInserted({
                    name: path,
                    index: 0,
                    block: event.data.payload.config,
                  })
                );
              }
            }
          }

          window.addEventListener("message", handleComponentPickerCloseMessage);

          window.parent.postMessage(componentPickerOpened(originalPath));
        }}
        meta={meta}
      />,
    ];
  }

  if (isSchemaPropComponent(schemaProp)) {
    return elements[0] ?? <Fragment></Fragment>;
  } else {
    return elements;
  }
}

export type ComponentBuilderProps = {
  path: string;
  passedProps?: {
    [key: string]: any; // any extra props passed in components
  };
  compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
  meta: any;
};

type ComponentBuilderComponent = React.FC<ComponentBuilderProps>;

function ComponentBuilder(props: ComponentBuilderProps): ReactElement | null {
  const { compiled, passedProps, path, meta } = props;

  /**
   * Component is build in editing mode only if compiled.__editing is set.
   * This is the result of compilation.
   * The only case when compiled.__editing is set is when we're in Editor and for non-nested components.
   */
  const isEditing = compiled.__editing !== undefined;
  const MissingComponent = meta.code.MissingComponent;
  const pathSeparator = path === "" ? "" : ".";

  if (compiled._template === "REPLACE_ME") {
    // @ts-expect-error this is total exception for purpose of grid editing, will be replaced soon
    return compiled.element;
  }

  // Here we know we must render just component, without any wrappers
  const componentDefinition = getComponentDefinition(compiled, {
    definitions: meta.vars.definitions,
  })!;

  const isComponentCustom = !componentDefinition.id.startsWith("$");
  const isButton = componentDefinition.tags.includes("button");

  let component: any;
  if (isComponentCustom) {
    if (isButton) {
      component = meta.shopstoryProviderContext.buttons[componentDefinition.id];
    } else {
      component =
        meta.shopstoryProviderContext.components[componentDefinition.id];
    }
  } else {
    // We first try to find editor version of that component
    if (compiled.__editing) {
      component =
        meta.code[componentDefinition.id + ".editor"] ??
        meta.shopstoryProviderContext.components[
          componentDefinition.id + ".editor"
        ];
    }

    // If it still missing, we try to find client version of that component
    if (!component) {
      component =
        meta.code[componentDefinition.id + ".client"] ??
        meta.shopstoryProviderContext.components[
          componentDefinition.id + ".client"
        ];
    }

    if (!component) {
      // In most cases we're going to pick component by its id
      component =
        meta.code[componentDefinition.id] ??
        meta.shopstoryProviderContext.components[componentDefinition.id];
    }
  }

  const isMissingComponent = compiled._template === "$MissingComponent";
  const isMissingInstance = component === undefined;
  const isMissing = isMissingComponent || isMissingInstance;

  if (isMissing) {
    console.warn(`Missing "${compiled._template}"`);

    if (!isEditing) {
      return null;
    }

    if (isMissingComponent) {
      return (
        <MissingComponent tags={[]} error={true}>
          Missing
        </MissingComponent>
      );
    } else {
      return (
        <MissingComponent tags={componentDefinition.tags} error={true}>
          Missing
        </MissingComponent>
      );
    }
  }

  const traceEvent = isEditing
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_: unknown) => {}
    : trace(compiled, meta.shopstoryProviderContext.eventSink ?? (() => {}));

  const Component =
    isEditing || !compiled.tracing?.traceImpressions
      ? component
      : withImpressionTracking(
          {
            callback: traceEvent,
          },
          component
        );

  // Actions and links
  const actions: { [key: string]: any } = {};
  const actionWrappers: { [key: string]: any } = {};

  componentDefinition.schema.forEach((schemaProp) => {
    // if action
    if (isSchemaPropAction(schemaProp)) {
      const actionConfig = compiled.actions[schemaProp.prop][0];

      // If no action
      if (!actionConfig) {
        actionWrappers[schemaProp.prop] = (
          Component: any,
          props: { [key: string]: any }
        ) => {
          return <Component {...props} />;
        };
        actions[schemaProp.prop] = () => {};
      } else {
        const actionDefinition = getComponentDefinition(actionConfig, {
          definitions: meta.vars.definitions,
        });

        if (!actionDefinition) {
          throw new Error(
            "Missing definition for action " + actionConfig._template
          );
        }

        const actionParams: Record<string, any> = {};

        actionDefinition.schema.forEach((schemaProp) => {
          if (isResourceSchemaProp(schemaProp)) {
            const unresolvedResourceValue = actionConfig.props[schemaProp.prop];

            if (isLocalTextResource(unresolvedResourceValue, schemaProp.type)) {
              actionParams[schemaProp.prop] = unresolvedResourceValue.value;
            } else {
              if (isTrulyResponsiveValue(unresolvedResourceValue)) {
                throw new Error(
                  "Unexpected responsive value for resource within custom component"
                );
              }

              const resolvedResourceProp = resolveResource(
                unresolvedResourceValue,
                actionConfig.props._id,
                schemaProp,
                meta.resources
              );

              actionParams[schemaProp.prop] = resolvedResourceProp?.value;
            }
          } else {
            actionParams[schemaProp.prop] = actionConfig.props[schemaProp.prop];
          }
        });

        // save action (for links too)
        actions[schemaProp.prop] = () => {
          const action =
            meta.shopstoryProviderContext.actions[actionDefinition.id] ??
            missingActionInstance(actionDefinition.id);
          action(actionParams, null);
        };

        // if link action, we must save link provider
        if (actionDefinition.tags.includes("actionLink")) {
          const linkActionDefinition = actionDefinition;

          actionWrappers[schemaProp.prop] = (
            Component: any,
            props: { [key: string]: any }
          ) => {
            return React.createElement(LinkWrapper, {
              LinkProvider:
                meta.shopstoryProviderContext.links[linkActionDefinition.id] ??
                missingLinkInstance(actionDefinition.id),
              Component,
              componentProps: {
                ...props,
                as: "a",
                onClick: (e: any) => {
                  traceEvent("click");
                  if (isEditing) {
                    e.preventDefault();
                    alert(`link action`);
                  }
                },
              },
              values: actionParams,
            });
          };
        } else {
          actionWrappers[schemaProp.prop] = (
            Component: any,
            props: { [key: string]: any }
          ) => {
            return React.createElement(Component, {
              ...props,
              as: "button",
              onClick: (...args: any[]) => {
                traceEvent("click");
                actions[schemaProp.prop]();
                if (props.onClick) {
                  props.onClick(...args);
                }
              },
            });
          };
        }
      }
    }
  });

  const renderabilityStatus = getRenderabilityStatus(compiled, meta);

  if (!renderabilityStatus.renderable) {
    return (
      <MissingComponent tags={componentDefinition.tags}>
        {`Fill following fields to render the component: ${renderabilityStatus.fieldsRequiredToRender.join(
          ", "
        )}`}

        {renderabilityStatus.isLoading && (
          <Fragment>
            <br />
            <br />
            Loading data...
          </Fragment>
        )}
      </MissingComponent>
    );
  }

  // If custom component
  if (isComponentCustom) {
    const componentProps = {
      ...passedProps,
    };

    componentDefinition.schema.forEach((schemaProp) => {
      if (isSchemaPropCollection(schemaProp)) {
        throw new Error(
          "component collection in custom components not yet supported"
        );
      }

      if (isTracingSchemaProp(schemaProp.prop)) {
        return;
      } else if (isSchemaPropComponent(schemaProp)) {
        const item = compiled.components[schemaProp.prop]?.[0];

        if (!item) {
          componentProps[schemaProp.prop] = undefined;
        } else {
          const contextProps =
            compiled.__editing?.components[schemaProp.prop] || {};
          const compiledArray = compiled.components[schemaProp.prop];

          componentProps[schemaProp.prop] = getCompiledSubcomponents(
            compiledArray,
            contextProps,
            schemaProp,
            `${path}${pathSeparator}${schemaProp.prop}`,
            meta,
            isEditing
          );
        }
      } else if (isResourceSchemaProp(schemaProp)) {
        if (
          isLocalTextResource(compiled.props[schemaProp.prop], schemaProp.type)
        ) {
          componentProps[schemaProp.prop] =
            compiled.props[schemaProp.prop].value;
        } else {
          const resolvedResourceProp = resolveResource(
            compiled.props[schemaProp.prop],
            compiled.props._id,
            schemaProp,
            meta.resources
          );

          if (isTrulyResponsiveValue(resolvedResourceProp)) {
            throw new Error(
              "Unexpected responsive value for resource within custom component"
            );
          }

          componentProps[schemaProp.prop] = resolvedResourceProp?.value;
        }
      } else {
        componentProps[schemaProp.prop] = compiled.props[schemaProp.prop];
      }
      // TODO: set componentProps.__fromEditor to all the props that are NOT from schema (all passed)
    });

    // for button we wrap with action wrapper
    if (isButton) {
      delete componentProps.action;
      return actionWrappers["action"](Component, componentProps);
    }

    return <Component {...componentProps} />;
  }

  const shopstoryCompiledConfig = compiled as CompiledShopstoryComponentConfig;

  // Shopstory component
  const styled: { [key: string]: any } = buildBoxes(
    shopstoryCompiledConfig.styled,
    "",
    actionWrappers,
    meta
  );

  // Styled
  componentDefinition.schema.forEach((schemaProp) => {
    if (
      isSchemaPropComponentOrComponentCollection(schemaProp) &&
      !isSchemaPropAction(schemaProp) &&
      !isSchemaPropActionTextModifier(schemaProp) &&
      !isSchemaPropTextModifier(schemaProp)
    ) {
      const contextProps =
        shopstoryCompiledConfig.__editing?.components?.[schemaProp.prop] || {};

      const compiledChildren =
        shopstoryCompiledConfig.components[schemaProp.prop];

      styled[schemaProp.prop] = getCompiledSubcomponents(
        compiledChildren,
        contextProps,
        schemaProp,
        `${path}${pathSeparator}${schemaProp.prop}`,
        meta,
        isEditing
      );
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref, ...restPassedProps } = passedProps || {};

  const runtime = {
    resources: meta.resources,
    eventSink: meta.shopstoryProviderContext.eventSink,
    Image: meta.shopstoryProviderContext.Image,
    stitches: meta.shopstoryProviderContext.stitches,
    resop: meta.shopstoryProviderContext.resop,
    Box: meta.code.Box,
    devices: meta.vars.devices,
    isEditing,
    locale: meta.vars.locale,
  };

  const componentProps = {
    ...restPassedProps,
    __fromEditor: {
      _id: shopstoryCompiledConfig._id,
      props: mapResourceProps(
        shopstoryCompiledConfig.props,
        shopstoryCompiledConfig._id,
        componentDefinition,
        meta
      ),
      components: styled,
      actions,
      React,
      __editing: shopstoryCompiledConfig.__editing,
      isEditing,
      path,
      runtime,
    },
  };

  if (isButton) {
    return actionWrappers["action"](Component, componentProps);
  }

  return <Component {...componentProps} />;
}

function mapResourceProps(
  props: Record<string, unknown>,
  configId: string,
  componentDefinition: InternalComponentDefinition,
  meta: Metadata
) {
  const resultsProps: Record<string, unknown> = {};

  for (const propName in props) {
    const schemaProp = componentDefinition.schema.find(
      (currentSchema) => currentSchema.prop === propName
    );

    if (schemaProp && isResourceSchemaProp(schemaProp)) {
      const propValue = props[propName] as ResponsiveValue<UnresolvedResource>;

      if (
        schemaProp.type === "text" &&
        (propValue as UnresolvedResource).id?.startsWith("local.")
      ) {
        resultsProps[propName] = propValue;
      } else {
        resultsProps[propName] = resolveResource(
          propValue,
          configId,
          schemaProp,
          meta.resources
        );
      }
    } else {
      resultsProps[propName] = props[propName];
    }
  }

  return resultsProps;
}

function resolveResource(
  responsiveResource: ResponsiveValue<UnresolvedResource>,
  configId: string,
  schemaProp: ResourceSchemaProp,
  resources: Array<Resource>
): ResponsiveValue<ResolvedResourceProp | null> {
  return responsiveValueMap(responsiveResource, (r) => {
    const type = getResourceType(schemaProp);

    if (r.id) {
      if (isLocalTextResource(r, "text")) {
        return {
          id: r.id,
          type,
          status: "success",
          value: r.value,
          error: null,
        };
      } else {
        const resource = resources.find(
          (res) => res.id === `${configId}.${schemaProp.prop}`
        );

        let resourceValue = resource;

        if (resource) {
          resourceValue = getResourceValue(resource);
        }

        /**
         * If resource is not there it means that it hasn't started loading yet, so let's set loading
         */
        if (
          resource === undefined ||
          resource.status === "loading" ||
          isEmptyRenderableContent(resourceValue)
        ) {
          return {
            id: r.id,
            type,
            status: "loading",
            value: undefined,
            error: null,
          };
        }

        if (resource.status === "success") {
          if (isCompoundResource(resource)) {
            if (!r.key) {
              return null;
            }

            const resolvedResourceValue = resource.value[r.key].value;

            if (!resolvedResourceValue) {
              return null;
            }

            return {
              id: r.id,
              type,
              status: "success",
              value: resolvedResourceValue,
              error: null,
            };
          }

          return {
            id: r.id,
            type,
            status: "success",
            value: resourceValue,
            error: null,
          };
        }

        return {
          id: r.id,
          type,
          status: "error",
          value: undefined,
          error: resource.error,
        };
      }
    }

    return null;
  });
}

function isCompoundResource(
  resource: ResolvedResource
): resource is SetRequired<
  ResolvedResource<FetchOutputCompoundResources[string]["values"]>,
  "value"
> {
  return resource.type === "object";
}

export default ComponentBuilder;
export type { ComponentBuilderComponent };
