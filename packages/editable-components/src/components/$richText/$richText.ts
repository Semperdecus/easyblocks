import {
  configFindAllPaths,
  EditableComponentToComponentConfig,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import {
  EditingField,
  getFallbackLocaleForLocale,
  LocalisedConfigs,
  RefValue,
  ResponsiveValue,
} from "@easyblocks/core";
import { dotNotationGet, nonNullable, range } from "@easyblocks/utils";
import richTextStyles from "./$richText.styles";
import { RichTextEditingFunction } from "./$richText.types";
import {
  RichTextBlockElementComponentConfig,
  richTextBlockElementEditableComponent,
} from "./$richTextBlockElement/$richTextBlockElement";
import type { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";

type RichTextAccessibilityRole =
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

const editing: RichTextEditingFunction = ({
  values,
  editingInfo,
  __SECRET_INTERNALS__,
}) => {
  if (!__SECRET_INTERNALS__) {
    throw new Error("Missing __SECRET_INTERNALS__");
  }

  const { pathPrefix, editorContext } = __SECRET_INTERNALS__;

  const richTextConfig = dotNotationGet(editorContext.form.values, pathPrefix);

  const richTextBlockPaths = configFindAllPaths(
    richTextConfig,
    editorContext,
    (config): config is RichTextBlockElementComponentConfig => {
      return config._template === "$richTextBlockElement";
    }
  );

  const richTextBlockPath = `${pathPrefix}.${richTextBlockPaths[0]}`;
  const richTextBlockType = dotNotationGet(
    editorContext.form.values,
    `${richTextBlockPath}.type`
  );

  const accessibilityRoleFieldIndex = editingInfo.fields.findIndex(
    (field) => field.path === "accessibilityRole"
  );

  const fieldsBeforeAccessibilityRole = editingInfo.fields.slice(
    0,
    accessibilityRoleFieldIndex
  );

  const listStyleField: EditingField = {
    type: "field",
    path: `${richTextBlockPath}.type`,
    label: "List style",
    group: "Text",
    visible: richTextBlockPaths.length > 0,
  };

  const fieldsAfterAccessibilityRole = editingInfo.fields
    .slice(accessibilityRoleFieldIndex)
    .map((field) => {
      if (richTextBlockType !== "paragraph") {
        if (field.path === "accessibilityRole") {
          return {
            ...field,
            visible: false,
          };
        }

        if (field.path === "isListStyleAuto" && richTextBlockPaths.length > 0) {
          return {
            ...field,
            visible: true,
          };
        }

        if (
          !values.isListStyleAuto &&
          (field.path === "mainFont" || field.path === "mainColor")
        ) {
          return {
            ...field,
            hidden: false,
          };
        }
      }
      return field;
    });

  const richTextPartPaths = configFindAllPaths(
    richTextConfig,
    editorContext,
    (config): config is RichTextPartComponentConfig => {
      return config._template === "$richTextPart";
    }
  );

  let currentLocaleRichTextPartPaths = richTextPartPaths.filter(
    isRichTextPartPathForLocale(editorContext.contextParams.locale)
  );

  if (currentLocaleRichTextPartPaths.length === 0) {
    const fallbackLocale = getFallbackLocaleForLocale(
      editorContext.contextParams.locale,
      editorContext.locales
    );

    if (fallbackLocale) {
      currentLocaleRichTextPartPaths = richTextPartPaths.filter(
        isRichTextPartPathForLocale(fallbackLocale)
      );
    }
  }

  const richTextPartSources = currentLocaleRichTextPartPaths.map(
    (path) => `${pathPrefix}.${path}`
  );

  return {
    fields: [
      ...fieldsBeforeAccessibilityRole,
      {
        type: "field",
        path: richTextPartSources.map((source) => `${source}.font`),
        visible: richTextPartSources.length > 0,
      },
      {
        type: "field",
        path: richTextPartSources.map((source) => `${source}.color`),
        visible: richTextPartSources.length > 0,
      },
      listStyleField,
      ...fieldsAfterAccessibilityRole,
    ].filter(nonNullable()),
  };
};

const richTextEditableComponent: InternalRenderableComponentDefinition<"$richText"> =
  {
    id: "$richText",
    label: "Text",
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_text.png",
    schema: [
      {
        prop: "elements",
        type: "component-collection-localised",
        componentTypes: [richTextBlockElementEditableComponent.id],
        visible: false,
      },
      {
        prop: "accessibilityRole",
        type: "select",
        label: "Role",
        options: [
          { value: "div", label: "Paragraph" },
          ...range(1, 6).map((index) => ({
            value: `h${index}`,
            label: `Heading ${index}`,
          })),
        ],
        group: "Accessibility and SEO",
      },
      {
        prop: "isListStyleAuto",
        type: "boolean",
        label: "Auto list styles",
        defaultValue: true,
        visible: false,
        group: "Text",
      },
      {
        prop: "mainFont",
        type: "font",
        label: "Main font",
        visible: false,
        group: "Text",
      },
      {
        prop: "mainColor",
        type: "color",
        label: "Main color",
        visible: false,
        group: "Text",
      },
    ],
    type: "item",
    styles: richTextStyles,
    editing,
  };

function isRichTextPartPathForLocale(locale: string) {
  return function innerIsLocalizedRichTextPart(richTextPartConfigPath: string) {
    return richTextPartConfigPath.startsWith(`elements.${locale}`);
  };
}

type RichTextComponentConfig = EditableComponentToComponentConfig<
  typeof richTextEditableComponent
> & {
  accessibilityRole: RichTextAccessibilityRole;
  isListStyleAuto: boolean;
  elements: LocalisedConfigs<Array<RichTextBlockElementComponentConfig>>;
  mainFont: ResponsiveValue<Record<string, any>>;
  mainColor: ResponsiveValue<RefValue<ResponsiveValue<string>>>;
};

export { richTextEditableComponent };
export type { RichTextComponentConfig, RichTextAccessibilityRole };
