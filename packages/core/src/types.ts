import { ComponentType, ReactElement } from "react";
import { PartialDeep } from "type-fest";
import { Locale } from "./locales";

export type ScalarOrCollection<T> = T | Array<T>;

export type RefMap = { [key: string]: ComponentConfig };

export type PlaceholderAppearance = {
  width?: number;
  height?: number;
  aspectRatio?: number;
  label?: string;
};

export interface ComponentConfigBase<Identifier extends string> {
  _template: Identifier;
  _id: string;
}

export type ComponentConfig = {
  _template: string; // instance of the component (unique id)
  _ref?: string; // ref of the component,
  _id: string;
  $$$refs?: RefMap;
  [key: string]: any; // props
};

export type LocalisedConfigs<
  T extends ComponentConfig | Array<ComponentConfig> = ComponentConfig
> = {
  [locale: string]: T;
};

export type Document = {
  documentId: string;
  projectId: string;
  rootContainer: string;
  /**
   * This field serves as a cache of document's content when used by `ShopstoryClient`.
   * It allows to avoid fetching the content of the document from the server when it's already available.
   * It shouldn't be used by editor. It's missing when the config was too big to be stored in the CMS.
   */
  config?: ComponentConfig;
};

export type LocalisedDocument = Record<string, Document>;

export type RefValue<T> = {
  value: T;
  ref?: string;
};

export type RefType = "dev" | "ds" | "map";

export type ThemeRefValue<T> = RefValue<T> & {
  type: RefType;
  label?: string;
  mapTo?: string | string[];
};

export type Spacing = string; // 10px, 0px, 10vw, etc

export type Font = object;

export type Color = string;

export type NumberOfItemsInRow = "1" | "2" | "3" | "4" | "5" | "6";

export type TrulyResponsiveValue<T> = {
  [key: string]: T | true | undefined;
  $res: true;
};

export type ResponsiveValue<T> = T | TrulyResponsiveValue<T>;

export type ThemeSpaceScalar = number | string;

export type ThemeSpace = ResponsiveValue<ThemeSpaceScalar>;

export type ThemeColor = ResponsiveValue<Color>;

export type ThemeFont = ResponsiveValue<{ [key: string]: any }>;

export type ButtonCustomComponent = CustomComponentShared & {
  builtinProps?: {
    label?: "on" | "off";
    symbol?: "on" | "off" | "optional";
  };
};

export type StringSchemaProp = ValueSchemaProp<"string", string, "optional"> &
  SchemaPropParams<{
    normalize?: (x: string) => string | null;
  }>;

export type NumberSchemaProp = ValueSchemaProp<"number", number, "optional"> &
  SchemaPropParams<{
    min?: number;
    max?: number;
  }>;

export type BooleanSchemaProp = ValueSchemaProp<"boolean", boolean, "optional">;

export type Option =
  | {
      value: string;
      label?: string;
      icon?: string | ComponentType<{ size?: number; isStroke?: boolean }>;
      hideLabel?: boolean;
    }
  | string;

export type SelectSchemaProp = ValueSchemaProp<"select", string, "optional"> &
  SchemaPropParams<
    {
      options: Option[];
    },
    true
  >;

export type RadioGroupSchemaProp = ValueSchemaProp<
  "radio-group",
  string,
  "optional"
> &
  SchemaPropParams<
    {
      options: Option[];
    },
    true
  >;

/**
 * Why do Space, Color and Font have ValueType ResponsiveValue<RefValue<ResponsiveValue<Color>>> type? It's complex! (T is Color / Space / Font).
 *
 * 1. For now values can be only RefValues (we don't have custom values, every space, color and font must be reference to a theme). Therefore RefValue.
 * 2. In a theme, fonts, spaces and colors (defined by developer) can be responsive. Therefore RefValue<ResponsiveValue<T>>
 * 3. User in editor can pick RESPONSIVELY different RefValues (that are responsive too). It's complex but makes sense.
 *
 * CompileType is obviously very simple because after compilation we just have "CSS output" which is basically responsive non-ref value (there's no concept of refs after compilation)
 */

export type ColorSchemaProp = ValueSchemaProp<
  "color",
  ResponsiveValue<RefValue<Color>>,
  "forced"
>;

export type StringTokenSchemaProp = ValueSchemaProp<
  "stringToken",
  ResponsiveValue<RefValue<string>>,
  "forced"
> &
  SchemaPropParams<
    {
      tokenId:
        | "numberOfItemsInRow"
        | "aspectRatios"
        | "containerWidths"
        | "boxShadows";
      extraValues?: Array<string | { value: string; label: string }>; // extra values are usually non-token values that are displayed in the select as if they were tokens, the component must understand them
    },
    true
  >;

export type SpaceSchemaProp = ValueSchemaProp<
  "space",
  ResponsiveValue<RefValue<Spacing>>,
  "forced"
> &
  SchemaPropParams<{
    prefix?: string;
    autoConstant?: number;
  }>;

export type FontSchemaProp = ValueSchemaProp<
  "font",
  ResponsiveValue<RefValue<Font>>,
  "forced"
>;

export type IconSchemaProp = ValueSchemaProp<"icon", RefValue<string>, "never">;

export type ComponentPickerType = "large" | "large-3" | "compact";

export type PassedField =
  | { name: string; label: string; showWhen?: any; group?: string }
  | string;

export type ComponentSchemaProp = SchemaPropShared<"component"> & {
  accepts: string[];
  picker?: ComponentPickerType;
  required?: boolean;
  noInline?: boolean;
  placeholderAppearance?: PlaceholderAppearance;
};

export type ComponentCollectionSchemaProp =
  SchemaPropShared<"component-collection"> & {
    accepts: string[];
    picker?: ComponentPickerType;
    hideFields?: string[];
    itemFields?: SchemaProp[];
    passFields?: PassedField[];
    noInline?: boolean;
    placeholderAppearance?: PlaceholderAppearance;
  };

export type ComponentCollectionLocalisedSchemaProp = Omit<
  ComponentCollectionSchemaProp,
  "type"
> & {
  type: "component-collection-localised";
  noInline?: boolean;
  placeholderAppearance?: PlaceholderAppearance;
};

export type TextSchemaProp = ValueSchemaProp<
  "text",
  LocalTextReference | ExternalReference | string,
  "never"
> & {
  normalize?: (x: string) => string | null;
  [key: string]: any;
};

export type PositionVertical = "top" | "center" | "bottom";

export type PositionHorizontal = "left" | "center" | "right";

export type Position = `${PositionVertical}-${PositionHorizontal}`;

export type PositionSchemaProp = ValueSchemaProp<
  "position",
  ResponsiveValue<Position>,
  "forced"
>;

export type ExternalSchemaProp = ValueSchemaProp<
  string & Record<never, never>,
  ExternalReference,
  "optional"
> & {
  /**
   * Parameters passed to the widget.
   */
  params?: ExternalParams;
  /**
   * Parameters passed to the fetch function.
   */
  fetchParams?: ExternalParams;
  /**
   * If `true`, the resource becomes optional and the component using it can render without it.
   */
  optional?: boolean;
};

export type LocalSchemaProp = ValueSchemaProp<
  string & Record<never, never>,
  any,
  "optional"
>;

export type TokenSchemaProp = ValueSchemaProp<
  string & Record<never, never>,
  any,
  "forced"
> &
  SchemaPropParams<{
    extraValues: Array<any | { value: any; label: string }>;
  }>;

export type SchemaProp =
  | StringSchemaProp
  | NumberSchemaProp
  | BooleanSchemaProp
  | SelectSchemaProp
  | RadioGroupSchemaProp
  | ColorSchemaProp
  | SpaceSchemaProp
  | FontSchemaProp
  | StringTokenSchemaProp
  | IconSchemaProp
  | TextSchemaProp
  | ComponentSchemaProp
  | ComponentCollectionSchemaProp
  | ComponentCollectionLocalisedSchemaProp
  | PositionSchemaProp
  | ExternalSchemaProp
  | LocalSchemaProp
  | TokenSchemaProp;

export type AnyValueSchemaProp =
  | StringSchemaProp
  | NumberSchemaProp
  | BooleanSchemaProp
  | SelectSchemaProp
  | RadioGroupSchemaProp
  | ColorSchemaProp
  | SpaceSchemaProp
  | FontSchemaProp
  | StringTokenSchemaProp
  | IconSchemaProp
  | TextSchemaProp
  | PositionSchemaProp
  | ExternalSchemaProp;

type CustomComponentShared = {
  id: string;
  hidden?: boolean;
  schema: SchemaProp[];
  label?: string;
  previewImage?: string;
};

export type SectionCustomComponent = CustomComponentShared & {
  type: "section";
};

export type CardCustomComponent = CustomComponentShared & { type: "card" };

export type ItemCustomComponent = CustomComponentShared & {
  type?: "item" | undefined;
};

export type CustomComponent =
  | SectionCustomComponent
  | CardCustomComponent
  | ItemCustomComponent;

export type CustomAction = CustomComponentShared;

export type CustomLink = CustomComponentShared;

type TextModifierType = "text" | "link" | "action";

export type CustomTextModifier = ComponentDefinitionShared & {
  type: TextModifierType;
  apply: (props: Record<string, any>) => Record<string, any>;
  childApply?: (props: Record<string, any>) => Record<string, any>;
};

export type ConfigDeviceRange = {
  startsFrom?: number;
  w?: number;
  h?: number;
  hidden?: boolean;
};

export type ConfigDevices = {
  xs?: ConfigDeviceRange;
  sm?: ConfigDeviceRange;
  md?: ConfigDeviceRange;
  lg?: ConfigDeviceRange;
  xl?: ConfigDeviceRange;
  "2xl"?: ConfigDeviceRange;
};

export type UserDefinedTemplate = {
  id: string;
  label: string;
  thumbnail?: string;
  thumbnailLabel?: string;
  entry: ComponentConfig;
  isUserDefined: true;
};

export type InternalTemplate = {
  id: string;
  label?: string;
  thumbnail?: string;
  thumbnailLabel?: string;
  entry: ComponentConfig;
  isUserDefined?: false;
};

export type Template = InternalTemplate | UserDefinedTemplate;

type RuntimeConfigThemeValue<T> = {
  id: string;
  label?: string;
  value: T;
  mapTo?: string | string[];
};

export type ExternalParams = Record<string, unknown>;

export type ContextParams = {
  locale: string;
  [key: string]: any;
};

export type PickerItem = {
  id: string;
  title: string;
  thumbnail?: string;
};

export type WidgetComponentProps<Identifier extends NonNullish = NonNullish> = {
  id: ExternalReference<Identifier>["id"];
  onChange: (newId: ExternalReference<Identifier>["id"]) => void;
};

export type InlineTypeWidgetComponentProps<
  Type extends NonNullish = NonNullish
> = {
  value: Type;
  onChange: (newValue: Type) => void;
};

export type TokenTypeWidgetComponentProps<
  Type extends NonNullish = NonNullish
> = InlineTypeWidgetComponentProps<Type>;

export type Widget = {
  id: string;
  label: string;
};

export type ExternalDefinition = {
  widgets: Array<Widget>;
};

export type LocalizedText = {
  [locale: string]: string;
};

export type DocumentType = {
  label?: string;
  entry: Omit<ComponentConfig, "_id">;
  widths?: Array<number>;
  resource?: {
    type: string;
  };
  schema?: Array<ExternalSchemaProp>;
};

export type NoCodeComponentStylesFunctionInput<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = {
  values: Values;
  params: { $width: number; $widthAuto: boolean } & Params;
  device: DeviceRange;
  isEditing: boolean;
};

export type InferNoCodeComponentStylesFunctionInput<T> =
  T extends NoCodeComponentDefinition<infer Values, infer Params>
    ? NoCodeComponentStylesFunctionInput<Values, Params>
    : never;

export type NoCodeComponentStylesFunctionResult = {
  props?: Record<string, unknown>;
  components?: Record<
    string,
    {
      /**
       * `itemProps` can only be set if component prop is a collection.
       */
      itemProps?: Array<Record<string, unknown>>;
      [key: string]: unknown;
    }
  >;
  styled?: Record<string, ScalarOrCollection<Record<string, unknown>>>;
};

export type NoCodeComponentStylesFunction<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = (
  input: NoCodeComponentStylesFunctionInput<Values, Params>
) => NoCodeComponentStylesFunctionResult;

export type NoCodeComponentEditingFunctionInput<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = {
  values: Values;
  params: Params;
  editingInfo: EditingInfo;
  device: DeviceRange;
};

export type NoCodeComponentEditingFunction<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = (
  input: NoCodeComponentEditingFunctionInput<Values, Params>
) => NoCodeComponentEditingFunctionResult;

export type NoCodeComponentAutoFunctionInput<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = {
  values: { [key in keyof Values]: ResponsiveValue<Values[key]> };
  params: { [key in keyof Params]: ResponsiveValue<Params[key]> };
  devices: Devices;
};

export type NoCodeComponentAutoFunction<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = (
  input: NoCodeComponentAutoFunctionInput<Values, Params> & {
    params: { $width: TrulyResponsiveValue<number> };
  }
) => any;

export type NoCodeComponentDefinition<
  Values extends Record<string, any> = Record<string, any>,
  Params extends Record<string, any> = Record<string, any>
> = {
  id: string;
  schema: Array<SchemaProp>;
  type?: string | string[];
  label?: string;
  styles?: NoCodeComponentStylesFunction<Values, Params>;
  editing?: NoCodeComponentEditingFunction<Values, Params>;
  auto?: NoCodeComponentAutoFunction<Values, Params>;
  change?: NoCodeComponentChangeFunction;
  pasteSlots?: Array<string>;
  thumbnail?: string;
  preview?: (input: {
    values: Values;
    externalData: ExternalData;
  }) => SidebarPreviewVariant | undefined;
};

/**
 * @internal
 */
type ConfigTokens = {
  aspectRatios: string;
  boxShadows: string;
  containerWidths: number;
  colors: ThemeColor;
  fonts: ThemeFont;
  icons: string;
  space: ThemeSpace;
};

export type InlineTypeDefinition<Value extends NonNullish = any> = {
  widget: Widget;
  responsiveness?: "always" | "optional" | "never";
  type: "inline";
  defaultValue: Value;
  validate?: (value: any) => boolean;
};

export type ExternalTypeDefinition = {
  widgets: Array<Widget>;
  responsiveness?: "always" | "optional" | "never";
  type: "external";
};

export type TokenTypeDefinition<Value extends NonNullish = any> = {
  widget: Widget;
  responsiveness?: "always" | "optional" | "never";
  type: "token";
  token: keyof ConfigTokens | (string & Record<never, never>);
  defaultValue: { value: Value } | { tokenId: string };
  extraValues?: Array<Value | { value: Value; label: string }>;
  allowCustom?: boolean;
  validate?: (value: any) => boolean;
};

export type CustomTypeDefinition =
  | InlineTypeDefinition
  | ExternalTypeDefinition
  | TokenTypeDefinition;

export type Config = {
  accessToken: string;
  projectId?: string;
  types?: Record<string, CustomTypeDefinition>;
  text?: ExternalDefinition;
  buttons?: ButtonCustomComponent[];
  components?: Array<NoCodeComponentDefinition<any, any>>;
  devices?: ConfigDevices;
  textModifiers?: Array<CustomTextModifier>;
  __masterEnvironment?: boolean;
  strict?: boolean;
  locales?: Array<Locale>;
  documentTypes?: Record<string, DocumentType>;
  disableCustomTemplates?: boolean;
  hideCloseButton?: boolean;
  templates?: Template[];
  tokens?: {
    [key in keyof ConfigTokens]?: Array<
      RuntimeConfigThemeValue<ConfigTokens[key]>
    >;
  } & {
    [key: string & Record<never, never>]: Array<RuntimeConfigThemeValue<any>>;
  };
};

type EditorProps = {
  configs?: LocalisedConfigs | LocalisedDocument;
  uniqueSourceIdentifier?: string;
  save: (
    documents: LocalisedDocument,
    externals: ExternalReference[]
  ) => Promise<void>;
  locales: Locale[];
  config: Config;
  contextParams: ContextParams;
  onClose: () => void;
  documentType: string;
  container?: HTMLElement;
  heightMode?: "viewport" | "parent";
  canvasUrl?: string;
};

export type EditorLauncherProps = Omit<EditorProps, "config">;

export type SchemaPropShared<Type extends string> = {
  type: Type;
  prop: string;
  label?: string;
  isLabelHidden?: boolean;
  visible?:
    | boolean
    | ((
        allValues: any,
        options: {
          editorContext: any;
        }
      ) => boolean);
  description?: string;
  group?: string;
};

type ValueSchemaProp<
  Type extends string,
  ValueType,
  Responsiveness extends "optional" | "forced" | "never"
> = SchemaPropShared<Type> & {
  defaultValue?: Responsiveness extends "optional" | "forced"
    ? ResponsiveValue<ValueType>
    : ValueType;
  buildOnly?: boolean;
  responsive?: Responsiveness extends "optional"
    ? boolean
    : Responsiveness extends "never"
    ? false
    : never;
};

export type SchemaPropParams<
  T extends Record<string, unknown>,
  Required extends boolean = false
> = Required extends true
  ? {
      params: T;
    }
  : { params?: T };

export type UnresolvedResource =
  | UnresolvedResourceNonEmpty
  | UnresolvedResourceEmpty;

export type UnresolvedResourceNonEmpty = {
  id: string;
  widgetId: string;
  /**
   * This property is an exception and it's only available within local text resource.
   * TODO: Move local text resources to other place
   */
  value?: LocalizedText;
  key?: string;
};

export type UnresolvedResourceEmpty = {
  id: null;
  widgetId: string;
};

export type ResourceIdentity = {
  id: string;
  type: string;
};

export type ResolvedResource<Value = unknown> = ResourceIdentity & {
  status: "success";
  value: Value;
  error: null;
  key?: string;
};

export type RejectedResource = ResourceIdentity & {
  status: "error";
  value: undefined;
  error: Error;
};

export type Resource<Value = unknown> =
  | ResolvedResource<Value>
  | RejectedResource;

export type DeviceRange = {
  id: string;
  w: number;
  h: number;
  breakpoint: number | null;
  hidden?: boolean;
  label?: string;
  isMain?: boolean;
};

export type DeviceId = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type Devices = DeviceRange[];

export type NoCodeComponentChangeFunction = (arg: {
  newValue: any;
  prop: string;
  values: Record<string, any>;
  valuesAfterAuto: Record<string, any>;
}) => Record<string, any> | undefined;

export type SidebarPreviewVariant = {
  description?: string;
  thumbnail?:
    | {
        type: "image";
        src: string;
      }
    | { type: "color"; color: string };
};

export type ComponentDefinitionShared<Identifier extends string = string> = {
  id: Identifier;
  label?: string;
  type?: string | string[];
  schema: SchemaProp[];
  thumbnail?: string;

  change?: NoCodeComponentChangeFunction;
  icon?: "link" | "grid_3x3";
  preview?: (input: {
    values: Record<string, any>;
    externalData: ExternalData;
  }) => SidebarPreviewVariant | undefined;
  previewImage?: string;

  hideTemplates?: boolean;
  allowSave?: boolean;
};

export type NoCodeComponentProps = {
  __easyblocks: {
    id: string;
    isEditing: boolean;
  };
};

export type SerializedRenderableComponentDefinition =
  ComponentDefinitionShared & {
    componentCode?: string; // optional because it might be also an action or built-in component
    pasteSlots?: Array<string>;
  };

export type SerializedActionComponentDefinition = ComponentDefinitionShared;

export type SerializedLinkComponentDefinition = ComponentDefinitionShared;

export type SerializedTextModifierDefinition = ComponentDefinitionShared;

export type SerializedComponentDefinitions = {
  components: SerializedRenderableComponentDefinition[];
  actions: SerializedActionComponentDefinition[];
  links: SerializedLinkComponentDefinition[];
  textModifiers: SerializedTextModifierDefinition[];
};

export type SerializedComponentDefinition =
  | SerializedRenderableComponentDefinition
  | SerializedActionComponentDefinition
  | SerializedLinkComponentDefinition;

export type NonEmptyRenderableContent = {
  renderableContent: CompiledShopstoryComponentConfig;
  configAfterAuto?: any;
};

export type EmptyRenderableContent = {
  renderableContent: null;
};

export type RenderableContent =
  | EmptyRenderableContent
  | NonEmptyRenderableContent;

export type RenderableDocument = {
  renderableContent: CompiledShopstoryComponentConfig | null;
  meta: CompilationMetadata;
  configAfterAuto?: ComponentConfig;
};

export type AnyField = Field & { [key: string]: any };

export type AnyTinaField = AnyField;

export interface Field<
  F extends Field = AnyField,
  SchemaPropValue extends SchemaProp = SchemaProp
> {
  name: Array<string> | string;
  label?: string;
  description?: string;
  component: React.FC<any> | string | null;
  parse?: (value: any, name: string, field: F) => any;
  format?: (value: any, name: string, field: F) => any;
  defaultValue?: any;
  fields?: F[];
  group?: string;
  schemaProp: SchemaPropValue;
  hidden?: boolean;
}

export type FieldPortal =
  | {
      portal: "component";
      source: string;
      includeHeader?: boolean;
      groups?: string[];
    }
  | {
      portal: "field";
      source: string;
      fieldName: string;
      overrides?: any; //Omit<Partial<TinaField>, "name">;
      hidden?: boolean;
    }
  | {
      portal: "multi-field";
      sources: Array<string>;
      fieldName: string;
      overrides?: any; //Omit<Partial<TinaField>, "name">;
      hidden?: boolean;
    };

export type CompiledComponentConfigBase<
  Identifier extends string = string,
  Props extends Record<string, any> = Record<string, any>
> = {
  _template: Identifier; // instance of the component (unique id)
  _id: string;
  props: Props;
};

export type CompiledActionComponentConfig = CompiledComponentConfigBase & {
  __editing?: {
    fields: Array<AnyField | FieldPortal>;
  };
};

export interface CompiledTextModifier {
  _template: string;
  _id: string;
  elements: Array<Record<string, any>>;
  [key: string]: any;
}

export type EditingInfoBase = {
  direction?: "horizontal" | "vertical";
  noInline?: boolean;
};

export type WidthInfo = {
  auto: TrulyResponsiveValue<boolean>;
  width: TrulyResponsiveValue<number>;
};

export type CompiledCustomComponentConfig = CompiledComponentConfigBase & {
  actions: {
    [key: string]: CompiledActionComponentConfig[];
  };
  components: {
    [key: string]: (
      | CompiledShopstoryComponentConfig
      | CompiledCustomComponentConfig
      | ReactElement
    )[];
  };
  textModifiers: Record<string, [CompiledTextModifier]>;
  __editing?: EditingInfoBase & {
    widthInfo?: WidthInfo;
    fields: Array<AnyField | FieldPortal>;
    components: {
      [name: string]: {
        noInline?: boolean; // This is the only property that needs to stay here for the sake of Placeholder. The rest can be passed (like direction).
      };
    };
  };
};

export type CompiledStyled = {
  [key: string]: any;
};

export type CompiledShopstoryComponentConfig = CompiledCustomComponentConfig & {
  styled: {
    [key: string]: CompiledStyled;
  };
};

export type CompiledComponentConfig =
  | CompiledActionComponentConfig
  | CompiledShopstoryComponentConfig
  | CompiledCustomComponentConfig;

export type ComponentPlaceholder = {
  width: number;
  height: number;
  label?: string;
};

/**
 * @public
 */
export type ShopstoryClientInput = ComponentConfig | null | undefined;

/**
 * @public
 */
export type ShopstoryClientAddOptions = {
  rootContainer: string;
  [key: string]: unknown;
};

export interface IShopstoryClient {
  add(
    config: ShopstoryClientInput,
    options: ShopstoryClientAddOptions
  ): RenderableContent;
  build(): Promise<Metadata>;
}

export type EditorSidebarPreviewOptions = {
  breakpointIndex: string;
  devices: Devices;
  contextParams: ContextParams;
};

export interface ConfigModel {
  id: string;
  parent_id: string | null;
  config: ComponentConfig;
  project_id: string;
  created_at: string;
}

export type ExternalWithSchemaProp = {
  id: string;
  externalReference: ExternalReference;
  schemaProp: ExternalSchemaProp;
};

export type CompilationMetadata = {
  vars: {
    devices: Devices;
    locale: string;
    definitions: SerializedComponentDefinitions;
    [key: string]: any;
  };
};

export type Metadata = CompilationMetadata & {
  resources: Array<Resource>;
};

export type CompilerModule = {
  compile: (
    content: unknown,
    config: Config,
    contextParams: ContextParams
  ) => {
    compiled: CompiledShopstoryComponentConfig;
    configAfterAuto?: any;
    meta: CompilationMetadata;
  };
  /**
   * We need findResources function that also comes from the cloud.
   * Without it we would have to analyse the config in ShopstoryClient in order to find resources to be fetched.
   * This is very internal logic and should stay in the cloud to be able to be updated live.
   */
  findExternals: (
    rawContent: any,
    config: Config,
    contextParams: ContextParams
  ) => ExternalWithSchemaProp[];
  validate: (input: unknown) =>
    | {
        isValid: true;
        input: Document | ComponentConfig | null | undefined;
      }
    | { isValid: false };
};

export type EditingField = {
  type: "field";
  path: string;
  label?: string;
  group?: string;
  visible?: boolean;
};

export type EditingComponentFields = {
  type: "fields";
  path: string;
  filters?: {
    group?: ScalarOrCollection<string>;
  };
};

export type AnyEditingField = EditingField | EditingComponentFields;

export type ChildComponentEditingInfo = {
  selectable?: boolean;
  direction?: "horizontal" | "vertical";
  fields: Array<EditingField>;
};

export type EditingInfo = {
  fields: Array<EditingField>;
  components: Record<string, ScalarOrCollection<ChildComponentEditingInfo>>;
};

export type NoCodeComponentEditingFunctionResult = {
  fields?: Array<AnyEditingField>;
  components?: {
    [field: string]: ScalarOrCollection<PartialDeep<ChildComponentEditingInfo>>;
  };
};

type FetchResourceResolvedResult<T> = {
  type: string & Record<never, never>;
  value: T;
};

type FetchResourceRejectedResult = { error: Error };

// {} in TS means any non nullish value and it's used on purpose here
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullish = {};

export type FetchResourceResult<T extends NonNullish = NonNullish> =
  | FetchResourceResolvedResult<T>
  | FetchResourceRejectedResult;

export type FetchOutputBasicResources = Record<string, FetchResourceResult>;

export type FetchCompoundResourceResultValue<
  Type extends string = string,
  Value extends NonNullish = NonNullish
> = {
  type: Type;
  value: Value;
  label?: string;
};

export type FetchCompoundTextResourceResultValue =
  FetchCompoundResourceResultValue<"text", string>;

export type FetchCompoundResourceResultValues = Record<
  string,
  | FetchCompoundTextResourceResultValue
  | FetchCompoundResourceResultValue<string & Record<never, never>, NonNullish>
>;

export type ExternalDataCompoundResourceResolvedResult = {
  type: "object";
  value: FetchCompoundResourceResultValues;
};

export type ExternalDataCompoundResourceRejectedResult = {
  error: Error;
};

export type FetchOutputCompoundResources = Record<
  string,
  | ExternalDataCompoundResourceResolvedResult
  | ExternalDataCompoundResourceRejectedResult
>;

export type FetchOutputResources = Record<
  string,
  (FetchOutputBasicResources | FetchOutputCompoundResources)[string]
>;

export type ChangedExternalDataValue = {
  id: ExternalReference["id"];
  type: string;
  widgetId: string;
  fetchParams?: ExternalParams;
};

export type ChangedExternalData = Record<string, ChangedExternalDataValue>;

export type ExternalData = Record<
  string,
  (FetchOutputBasicResources | FetchOutputCompoundResources)[string]
>;

export type ExternalDataChangeHandler = (
  resources: ChangedExternalData,
  contextParams: ContextParams
) => void;

export type LocalReference<Value = unknown> = {
  id: string;
  value: Value;
  widgetId: string;
};

export type LocalTextReference = Omit<
  LocalReference<LocalizedText>,
  "id" | "widgetId"
> & { id: `local.${string}`; widgetId: "@easyblocks/local-text" };

export type CompiledLocalTextReference = Omit<
  LocalReference<string>,
  "id" | "widgetId"
> & { id: `local.${string}`; widgetId: "@easyblocks/local-text" };

export type ExternalReferenceEmpty = {
  id: null;
  widgetId: string;
};

export type ExternalReferenceNonEmpty<
  Identifier extends NonNullish = NonNullish
> = {
  id: Identifier;
  widgetId: string;
  key?: string;
};

export type ExternalReference<Identifier extends NonNullish = NonNullish> =
  | ExternalReferenceEmpty
  | ExternalReferenceNonEmpty<Identifier>;

export type LocalValue<T = any> = {
  value: T;
  widgetId: string;
};

export type TokenValue<T = any> = LocalValue<T> & {
  tokenId?: string;
};
