import {
  buttonActionSchemaProp,
  buttonLabelSchemaProp,
  buttonOptionalIconSchemaProp,
  buttonRequiredIconSchemaProp,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import {
  ChildComponentEditingInfo,
  EditingComponentFields,
  EditingField,
  EditingFunctionResult,
  SchemaProp,
} from "@easyblocks/core";
import { range } from "@easyblocks/utils";

import { bannerCardAuto } from "./components/BannerCard/BannerCard.auto";
import bannerCardStyles from "./components/BannerCard/BannerCard.styles";

import { bannerCard2Auto } from "./components/BannerCard2/BannerCard2.auto";
import bannerCard2Styles from "./components/BannerCard2/BannerCard2.styles";

import { twoCardsChange } from "./components/TwoCards/TwoCards.change";
import twoCardsStyles from "./components/TwoCards/TwoCards.styles";

import tokenStyles from "./components/Token/Token.styles";

import tokenColorStyles from "./components/TokenColor/TokenColor.styles";

import tokenFontStyles from "./components/TokenFont/TokenFont.styles";

import { gridAuto } from "./components/Grid/Grid.auto";
import grid2Styles from "./components/Grid/Grid.styles";

import iconButtonStyles from "./components/IconButton/v1/IconButton.styles";

import iconButton2Styles from "./components/IconButton/v2/IconButton.styles";

import placeholderStyles from "./components/Placeholder/Placeholder.styles";
import standardButtonStyles from "./components/StandardButton/StandardButton.styles";

import $separatorStyles from "./components/Separator/Separator.styles";

import { sectionWrapperEditing } from "./components/SectionWrapper/SectionWrapper.editing";
import { $sectionWrapperStyles } from "./components/SectionWrapper/SectionWrapper.styles";

import { backgroundColorComponentDefinition } from "./components/$backgroundColor/$backgroundColor";
import { buttonsComponentDefinition } from "./components/$buttons/$buttons";
import { iconComponentDefinition } from "./components/$icon/$icon";
import { imageComponentDefinition } from "./components/$image/image";
import { richTextEditableComponent } from "./components/$richText/$richText";
import { richTextBlockElementEditableComponent } from "./components/$richText/$richTextBlockElement/$richTextBlockElement";
import { richTextInlineWrapperElementEditableComponent } from "./components/$richText/$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import { richTextLineElementEditableComponent } from "./components/$richText/$richTextLineElement/$richTextLineElement";
import { richTextPartEditableComponent } from "./components/$richText/$richTextPart/$richTextPart";
import { rootGridComponentDefinition } from "./components/$RootGrid/$RootGrid";
import { rootSectionsComponentDefinition } from "./components/$RootSections/$RootSections";
import { stackComponentDefinition } from "./components/$stack/stack";
import { textEditableComponent } from "./components/$text/$text";
import { twoItemsComponentDefinition } from "./components/$twoItems/twoItems";
import { videoComponentDefinition } from "./components/$video/video";
import { bannerCard2SeparateStackModeController } from "./components/BannerCard2/BannerCard2.controller";
import {
  basicBackgroundCardDefinition,
  basicCardDefinition,
} from "./components/BasicCard/BasicCard";
import { arePaddingFieldsSeparate } from "./components/BasicCard/BasicCard.controller";
import { cardPlaceholderDefinition } from "./components/CardPlaceholder/CardPlaceholder";
import { playgroundComponentDefinition } from "./components/Playground/Playground";
import { twoCardsAuto } from "./components/TwoCards/TwoCards.auto";
import { TWO_CARDS_COL_NUM } from "./components/TwoCards/twoCardsConstants";
import { vimeoPlayerEditableComponent } from "./components/vimeoPlayer/vimeoPlayer";
import { zoneComponentDefinition } from "./components/Zone/Zone";
import { componentContainerDefinition } from "./components/ComponentContainer/ComponentContainer";
import { borderSchemaProps } from "./borderHelpers";

function pxValueNormalize(from: number, to: number) {
  return (x: string) => {
    const num = parseInt(x);
    if (isNaN(num)) {
      return null;
    }

    if (num < from || num > to) {
      return null;
    }

    return num.toString();
  };
}

export const sectionWrapperFieldsProvider = (options: {
  fixedEscapeMarginValue?: boolean;
}): SchemaProp[] => {
  const extraEscapeMarginProps: { defaultValue?: boolean; visible: boolean } = {
    visible: true,
  };

  if (options.fixedEscapeMarginValue === true) {
    extraEscapeMarginProps.visible = false;
    extraEscapeMarginProps.defaultValue = true;
  } else if (options.fixedEscapeMarginValue === false) {
    extraEscapeMarginProps.visible = false;
  }

  return [
    {
      prop: "containerMargin",
      label: "Container",
      type: "space",
      group: "Section margins",
      prefix: "containerMargin",
    },
    {
      prop: "containerMaxWidth", // main image size
      label: "Max width",
      type: "stringToken",
      tokenId: "containerWidths",
      defaultValue: {
        ref: "none",
        value: "none",
      },
      group: "Section margins",
    },

    {
      prop: "escapeMargin",
      label: "Escape",
      type: "boolean$",
      group: "Section margins",
      ...extraEscapeMarginProps,
    },
    {
      prop: "hide",
      label: "Hide",
      type: "boolean$",
      group: "General",
    },

    // HEADER
    {
      prop: "headerMode",
      label: "Variant",
      type: "select",
      options: [
        { value: "none", label: "No header" },
        { value: "1-stack", label: "1 stack" },
        { value: "2-stacks", label: "2 stacks" },
      ],
      group: "Section Header",
    },
    {
      prop: "layout1Stack",
      label: "Position",
      type: "select",
      group: "Section Header",
      options: [
        {
          value: "left",
          label: "Left",
          // icon: SSIcons.AlignLeft,
          // hideLabel: true,
        },
        {
          value: "center",
          label: "Center",
          // icon: SSIcons.AlignCenter,
          // hideLabel: true,
        },
        {
          value: "right",
          label: "Right",
          // icon: SSIcons.AlignRight,
          // hideLabel: true,
        },
      ],
      visible: (values) => {
        return values.headerMode === "1-stack";
      },
    },

    {
      prop: "layout2Stacks",
      label: "Position",
      type: "select$",
      group: "Section Header",
      options: [
        {
          value: "left-right",
          label: "left + right",
        },
        {
          value: "center-right",
          label: "center + right",
        },
        {
          value: "stacked-left",
          label: "stacked left",
        },
        {
          value: "stacked-center",
          label: "stacked center",
        },
        {
          value: "stacked-right",
          label: "stacked right",
        },
        {
          value: "below-left",
          label: "above+below left",
        },
        {
          value: "below-center",
          label: "above+below center",
        },
        {
          value: "below-right",
          label: "above+below right",
        },
      ],
      visible: (values) => {
        return values.headerMode === "2-stacks";
      },
    },
    {
      prop: "layout2StacksVerticalAlign",
      label: "Align",
      type: "select$",
      group: "Section Header",
      options: ["center", "top", "bottom"],
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          !values.layout2Stacks.startsWith("stacked") &&
          !values.layout2Stacks.startsWith("below")
        );
      },
    },

    {
      prop: "headerStacksGap",
      label: "Stacks gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          values.layout2Stacks &&
          values.layout2Stacks.startsWith("stacked")
        );
      },
      defaultValue: {
        value: "12px",
        ref: "12",
      },
    },

    {
      prop: "headerSectionGap",
      label: "Gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return values.headerMode !== "none";
      },
      defaultValue: {
        value: "12px",
        ref: "12",
      },
    },
    {
      prop: "footerSectionGap",
      label: "Bottom gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          values.layout2Stacks &&
          values.layout2Stacks.startsWith("below")
        );
      },
      defaultValue: {
        value: "12px",
        ref: "12",
      },
    },
    /**
     * The problem is that we can't show label based on values :(
     */
    {
      prop: "HeaderStack",
      label: "Stack",
      type: "component-fixed",
      componentType: "$stack",
    },
    {
      prop: "HeaderSecondaryStack",
      label: "Stack",
      type: "component-fixed",
      componentType: "$stack",
    },

    // section background
    {
      prop: "Background__",
      label: "Outer Background",
      type: "component",
      group: "Section background",
      componentTypes: ["image"],
      visible: true,
    },
    {
      prop: "padding",
      label: "Inner margin",
      type: "space",
      group: "Section background",
      visible: (values) => {
        return values.Background__ && values.Background__.length > 0;
      },
      defaultValue: {
        value: "24px",
        ref: "24",
      },
    },
  ];
};

const sectionWrapperFields = sectionWrapperFieldsProvider({});
const sectionWrapperFieldsWithoutEscapeMargin = sectionWrapperFieldsProvider({
  fixedEscapeMarginValue: true,
});

const widthScalePreview = [
  "100px",
  "200px",
  "300px",
  "400px",
  "500px",
  "600px",
  "700px",
  "800px",
  "900px",
  "1000px",
  "100%",
  "auto",
];

const tokenFields = (defaultWidth?: string): SchemaProp[] => [
  {
    prop: "name",
    type: "text",
  },
  {
    prop: "paddingTop",
    type: "space",
  },
  {
    prop: "paddingBottom",
    type: "space",
  },
  {
    prop: "paddingLeft",
    type: "space",
  },
  {
    prop: "paddingRight",
    type: "space",
  },
  {
    prop: "backgroundColor",
    type: "color",
    defaultValue: {
      ref: "transparent",
      value: "transparent",
    },
  },
  {
    prop: "width",
    type: "select$",
    options: widthScalePreview,
    defaultValue: defaultWidth,
  },
];

const bannerFields: SchemaProp[] = [
  {
    prop: "cornerRadius",
    label: "Corner radius",
    type: "select$",
    options: Array.from(Array(30).keys()).map((x) => x.toString()),
    group: "General",
  },
  {
    prop: "SideImage",
    label: "Cover",
    type: "component",
    componentTypes: ["image"],
    visible: true,
    group: "Cover",
  },
  {
    prop: "sideImagePosition", // main image size
    label: "Position",
    type: "select$",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
      { label: "Top", value: "top" },
      { label: "Bottom", value: "bottom" },
      { label: "Background", value: "background" },
    ], // there is no "fit-content", because it doesn't make sense on mobile and it's actually very rare. If you want image, you don't want it to have some super narrow height, so the height is kind of "minimal" heihgt only.
    group: "Cover",
    visible: (values) => {
      return values.SideImage.length > 0;
    },
  },
  {
    prop: "sideImageSize", // main image size
    label: "Aspect ratio",
    type: "stringToken",
    tokenId: "aspectRatios", // "natural"
    extraValues: ["grid-baseline", "natural", "100vh"],
    group: "Cover",
    defaultValue: {
      ref: "$landscape",
      value: "whatever", // will be normalized anyway
    },
    // defaultValue: "landscape",
    visible: (values) => {
      return values.SideImage.length > 0;
    },
  },

  {
    prop: "size", // main image size
    label: "Size",
    type: "stringToken",
    tokenId: "aspectRatios",
    extraValues: ["grid-baseline", "natural", "fit-content", "100vh"],
    group: "Stack",
    visible: (values) => {
      return values.SideImage.length === 0;
    },
  },
  {
    prop: "contentPositionInBackgroundMode",
    label: "Position",
    type: "select$",
    options: [
      "top-left",
      "top-center",
      "top-right",
      "center-left",
      "center-center",
      "center-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ],
    group: "Stack",
    visible: (values) => {
      return (
        values.SideImage.length > 0 && values.sideImagePosition === "background"
      );
    },
    defaultValue: "bottom-center",
  },

  {
    prop: "contentHorizontalMarginInBackgroundMode",
    label: "Horizontal margin",
    type: "space",
    group: "Stack",
    visible: (values) => {
      return (
        values.SideImage.length > 0 && values.sideImagePosition === "background"
      );
    },
    defaultValue: {
      value: "24px",
      ref: "24",
    },
  },

  {
    prop: "contentVerticalMarginInBackgroundMode",
    label: "Vertical margin",
    type: "space",
    group: "Stack",
    visible: (values) => {
      return (
        values.SideImage.length > 0 && values.sideImagePosition === "background"
      );
    },
    defaultValue: {
      value: "24px",
      ref: "24",
    },
  },
  {
    prop: "Background",
    label: "Background",
    type: "component",
    componentTypes: ["image"],
    visible: true,
    group: "Stack",
  },
  /**
   * Offset horizontal, vertical and corner radius make sense ONLY if background is set. Otherwise, they don't make sense. We should show as little fields as possible!!!
   */
  {
    prop: "offsetHorizontal",
    label: "Horizontal margin",
    type: "space",
    group: "Stack",
    visible: (allValues) => {
      return (
        allValues.Background.length > 0 ||
        (allValues.SideImage.length > 0 &&
          (allValues.sideImagePosition === "left" ||
            allValues.sideImagePosition === "right"))
      ); // if side image is enabled and there is no background, this properly is only left gap (for image left) or right gap (for image right)
    },
    defaultValue: {
      value: "24px",
      ref: "24",
    },
  },
  {
    prop: "offsetHorizontalForVerticalImagePosition",
    label: "Horizontal margin",
    type: "space",
    group: "Stack",
    visible: (allValues) => {
      return (
        allValues.Background.length === 0 &&
        allValues.SideImage.length > 0 &&
        (allValues.sideImagePosition === "top" ||
          allValues.sideImagePosition === "bottom")
      );
    },
    defaultValue: {
      value: "0px",
      ref: "0",
    },
  },
  {
    prop: "offsetVertical",
    label: "Vertical margin",
    type: "space",
    group: "Stack",
    visible: (allValues) => {
      return (
        allValues.Background.length > 0 ||
        (allValues.SideImage.length > 0 &&
          (allValues.sideImagePosition === "top" ||
            allValues.sideImagePosition === "bottom"))
      ); // if side image is enabled and there is no background, this properly is only left gap (for image left) or right gap (for image right)
    },
    defaultValue: {
      value: "24px",
      ref: "24",
    },
  },

  {
    prop: "Stack",
    label: "Stack",
    type: "component-fixed",
    componentType: "$stack",
  },

  {
    prop: "stackAlign",
    label: "Align",
    type: "radio-group$",
    options: [
      {
        value: "left",
        label: "Left",
        icon: "AlignLeft",
        hideLabel: true,
      },
      {
        value: "center",
        label: "Center",
        icon: "AlignCenter",
        hideLabel: true,
      },
      {
        value: "right",
        label: "Right",
        icon: "AlignRight",
        hideLabel: true,
      },
    ],
    defaultValue: "left",
    group: "Stack",
  },

  {
    prop: "positionHorizontal",
    label: "Horizontal position",
    type: "select$",
    options: [
      {
        value: "left",
        label: "Left",
      },
      {
        value: "center",
        label: "Center",
      },
      {
        value: "right",
        label: "Right",
      },
    ],
    group: "Stack",
  },

  {
    prop: "verticalAlign",
    label: "Vertical position",
    type: "select$",
    options: [
      {
        value: "top",
        label: "Top",
      },
      {
        value: "center",
        label: "Center",
      },
      {
        value: "bottom",
        label: "Bottom",
      },
    ],
    group: "Stack",
    visible: (values) => {
      return (
        values.SideImage.length === 0 ||
        (values.SideImage.length > 0 &&
          (values.sideImagePosition === "left" ||
            values.sideImagePosition === "right"))
      ); // if side image is enabled and there is no background, this properly is only left gap (for image left) or right gap (for image right)
    },
  },
  buttonActionSchemaProp,
];

export const builtinEditableComponentsDefinitions: InternalRenderableComponentDefinition[] =
  [
    // root sections
    zoneComponentDefinition,
    rootSectionsComponentDefinition,
    rootGridComponentDefinition,
    textEditableComponent,
    iconComponentDefinition,
    twoItemsComponentDefinition,

    {
      id: "$separator",
      tags: ["item", "notrace"],
      label: "Separator",
      styles: $separatorStyles,
      schema: [
        {
          prop: "color",
          type: "color",
          label: "Color",
          defaultValue: {
            ref: "black",
            value: "black",
          },
        },
        {
          prop: "height",
          label: "Stroke width",
          type: "select$",
          options: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
          ],
        },
      ],
    },

    backgroundColorComponentDefinition,

    imageComponentDefinition,

    videoComponentDefinition,

    buttonsComponentDefinition,

    stackComponentDefinition,

    {
      id: "$BannerSection",
      tags: ["section", "notrace"],
      label: "Banner",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      pasteSlots: ["Component"],
      schema: [
        ...sectionWrapperFields,
        {
          prop: "Component",
          type: "component-fixed",
          componentType: "$BannerCard",
        },
      ],
    },
    {
      id: "$BannerSection2",
      tags: ["section", "notrace"],
      label: "Banner",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      pasteSlots: ["Component"],
      schema: [
        ...sectionWrapperFields,
        {
          prop: "Component",
          type: "component-fixed",
          componentType: "$BannerCard2",
        },
      ],
    },
    {
      id: "$Grid",
      tags: ["section", "notrace"],
      label: "Grid / Slider",
      icon: "grid_3x3",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      schema: [
        ...sectionWrapperFields.filter((x) => x.group === "General"),
        {
          prop: "Component",
          type: "component-fixed",
          componentType: "$GridCard",
        },
        ...sectionWrapperFields.filter((x) => x.group !== "General"),
      ],
      pasteSlots: ["Component"],
    },
    {
      id: "$TwoCards",
      tags: ["section", "notrace"],
      label: "Two Cards",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      schema: [
        ...sectionWrapperFieldsWithoutEscapeMargin,
        {
          prop: "Component",
          type: "component-fixed",
          componentType: "$TwoCardsCard",
        },
      ],
    },

    {
      id: "$GridCard",
      pasteSlots: ["Cards"],
      tags: ["card"],
      styles: grid2Styles,
      auto: gridAuto,
      editing: ({ values, editingInfo }) => {
        const fields = Object.fromEntries(
          editingInfo.fields.map((f) => [f.path, f])
        );

        const leftArrowFields = [fields.leftArrowPlacement];

        if (values.leftArrowPlacement !== "center") {
          leftArrowFields.push(fields.leftArrowOffset);
        }

        const rightArrowFields = [fields.rightArrowPlacement];

        if (values.rightArrowPlacement !== "center") {
          rightArrowFields.push(fields.rightArrowOffset);
        }

        const cards = editingInfo.components
          .Cards as Array<ChildComponentEditingInfo>;

        return {
          fields: editingInfo.fields.filter(
            (field) =>
              !field.path.startsWith("rightArrow") &&
              !field.path.startsWith("leftArrow")
          ),
          components: {
            Cards: cards.map((cardItem) => ({
              ...cardItem,
              direction: "horizontal",
            })),
            LeftArrow: {
              fields: leftArrowFields,
            },
            RightArrow: {
              fields: rightArrowFields,
            },
          },
        };
      },
      schema: [
        {
          prop: "Cards",
          type: "component-collection",
          componentTypes: ["card"],
          itemFields: [
            {
              prop: "itemSize",
              label: "Item size",
              group: "General",
              type: "select$",
              options: ["1x1", "2x1", "2x2"],
            },
            {
              prop: "verticalAlign",
              label: "Vertical align",
              group: "General",
              type: "select$",
              options: ["auto", "top", "center", "bottom", "stretch"],
            },
          ],
        },
        {
          prop: "variant",
          label: "Variant",
          type: "radio-group$",
          group: "Grid / Slider",
          options: [
            {
              value: "grid",
              label: "Grid",
            },
            {
              value: "slider",
              label: "Slider",
            },
          ],
        },
        {
          prop: "numberOfItems",
          label: "Visible items",
          type: "stringToken",
          tokenId: "numberOfItemsInRow",
          group: "Grid / Slider",
          // visible: (values, { editorContext }) => {
          //   if (values.variant === "grid") {
          //     return true;
          //   }
          //   return editorContext.breakpointIndex !== "xs";
          // },
        },
        {
          prop: "fractionalItemWidth",
          label: "Fraction",
          type: "select$",
          options: [
            { value: "1", label: "none" },
            { value: "1.25", label: "25%" },
            { value: "1.5", label: "50%" },
            { value: "1.75", label: "75%" },

            // { value: "2", label: "50%" },
            // { value: "1.66", label: "60%" },
            // { value: "1.43", label: "70%" },
            // { value: "1.25", label: "80%" },
            // { value: "1.11", label: "90%" },
            // { value: "1", label: "100%" },
          ],
          defaultValue: "1.25",
          group: "Grid / Slider",
          visible: (values, { editorContext }) => {
            if (values.variant === "grid") {
              return false;
            }
            return editorContext.breakpointIndex === "xs";
          },
        },
        {
          prop: "columnGap",
          label: "Gap",
          type: "space",
          group: "Grid / Slider",
          defaultValue: {
            ref: "16",
            value: "16px",
          },
          autoConstant: 16,
        },
        {
          prop: "rowGap",
          label: "Gap vertical",
          type: "space",
          visible: (values) => values.variant === "grid",
          group: "Grid / Slider",
          defaultValue: {
            ref: "16",
            value: "16px",
          },
          autoConstant: 16,
        },
        {
          prop: "verticalAlign",
          label: "Vertical align",
          type: "select$",
          options: ["top", "center", "bottom", "stretch"],
          group: "Grid / Slider",
        },
        {
          prop: "showSliderControls",
          label: "Show slider controls?",
          type: "boolean$",
          visible: false,
          group: "Grid / Slider",
        },
        {
          prop: "shouldSliderItemsBeVisibleOnMargin",
          label: "Show items on margins?",
          type: "boolean$",
          visible: (values) => values.variant === "slider",
          group: "Grid / Slider",
          defaultValue: true,
        },

        {
          prop: "gridMainObjectAspectRatio",
          label: "Main object aspect ratio",
          type: "stringToken",
          tokenId: "aspectRatios",
          group: "Grid / Slider",
          defaultValue: {
            ref: "$gridMainObjectDefault",
            value: "whatever", // will be normalized anyway
          },
          visible: false,
        },
        {
          prop: "borderEnabled",
          label: "Enable",
          type: "boolean",
          group: "Border",
        },
        {
          prop: "borderColor",
          label: "Color",
          type: "color",
          defaultValue: {
            ref: "$dark",
            value: "black",
          },
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderTop",
          label: "Top width",
          type: "select$",
          options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderBottom",
          label: "Bottom width",
          type: "select$",
          options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderLeft",
          label: "Left width",
          type: "select$",
          options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderRight",
          label: "Right width",
          type: "select$",
          options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderInner",
          label: "Inner width",
          type: "select$",
          options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },

        {
          prop: "paddingTop",
          label: "Top",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) => !!x.borderEnabled && x.borderTop !== "0",
          group: "Padding",
        },
        {
          prop: "paddingBottom",
          label: "Bottom",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) => !!x.borderEnabled && x.borderBottom !== "0",
          group: "Padding",
        },
        {
          prop: "paddingLeft",
          label: "Left",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) =>
            !!x.borderEnabled &&
            (x.borderLeft !== "0" ||
              x.borderTop !== "0" ||
              x.borderBottom !== "0"),
          group: "Padding",
        },
        {
          prop: "paddingRight",
          label: "Right",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) =>
            !!x.borderEnabled &&
            (x.borderRight !== "0" ||
              x.borderTop !== "0" ||
              x.borderBottom !== "0"),
          group: "Padding",
        },

        // Left arrow properties
        {
          prop: "LeftArrow",
          type: "component",
          componentTypes: ["button"],
          required: true,
        },
        {
          prop: "leftArrowPlacement",
          label: "Left arrow placement",
          type: "select$",
          options: ["inside", "center", "outside", "screen-edge"],
          group: "Placement",
        },
        {
          prop: "leftArrowOffset",
          label: "Left arrow offset",
          type: "space",
          group: "Placement",
        },

        // Right arrow properties
        {
          prop: "RightArrow",
          type: "component",
          componentTypes: ["button"],
          required: true,
        },
        {
          prop: "rightArrowPlacement",
          label: "Right arrow placement",
          type: "select$",
          options: ["inside", "center", "outside", "screen-edge"],
          group: "Placement",
        },
        {
          prop: "rightArrowOffset",
          label: "Right arrow offset",
          type: "space",
          group: "Placement",
        },
      ],
    },
    {
      id: "$TokenSection",
      tags: ["token", "notrace"],
      styles: tokenStyles,
      schema: [
        ...tokenFields("100%"),
        {
          prop: "Component",
          type: "component",
          componentTypes: ["section"],
        },
      ],
    },
    {
      id: "$TokenCard",
      tags: ["token", "notrace"],
      styles: tokenStyles,
      schema: [
        ...tokenFields("600px"),
        {
          prop: "Component",
          type: "component",
          componentTypes: ["card"],
        },
      ],
    },
    {
      id: "$TokenButton",
      tags: ["token"],
      styles: tokenStyles,
      schema: [
        ...tokenFields("auto"),
        {
          prop: "Component",
          type: "component",
          componentTypes: ["button"],
        },
      ],
    },
    {
      id: "$TokenColor",
      tags: ["token", "notrace"],
      styles: tokenColorStyles,
      schema: [
        {
          prop: "name",
          type: "text",
        },
        {
          prop: "color",
          label: "Color hex (#xxxxxx)",
          type: "text",
          defaultValue: "#ffffff",
        },
      ],
    },

    {
      id: "$TokenFont",
      tags: ["token", "notrace"],
      styles: tokenFontStyles,
      schema: [
        {
          prop: "name",
          type: "text",
        },
        {
          prop: "exampleTextLength",
          type: "radio-group",
          options: ["short", "medium", "long"],
        },
        {
          prop: "family",
          type: "text",
          defaultValue: "sans-serif",
        },
        {
          prop: "weight",
          type: "text",
          defaultValue: "500",
        },
        {
          prop: "size",
          type: "space",
        },
        {
          prop: "letterSpacing",
          type: "text",
          defaultValue: "0",
        },
        {
          prop: "isUppercase",
          type: "boolean",
        },
      ],
    },

    {
      id: "$BannerCard",
      tags: ["card"],
      pasteSlots: ["SideImage", "Stack"],
      styles: bannerCardStyles,
      auto: bannerCardAuto,
      schema: bannerFields,
      editing: () => {
        return {
          components: {
            SideImage: {
              selectable: false,
            },
            Background: {
              selectable: false,
            },
            Stack: {
              selectable: false,
            },
          },
        };
      },
    },
    {
      id: "$TwoCardsCard",
      tags: ["card"],
      auto: twoCardsAuto,
      styles: twoCardsStyles,
      change: twoCardsChange,
      editing: ({ values, editingInfo }) => {
        const fields = Object.fromEntries(
          editingInfo.fields.map((f) => [f.path, f])
        );

        fields.card1Width.visible = false;
        fields.card1EscapeMargin.visible = false;
        fields.card2Width.visible = false;
        fields.card2EscapeMargin.visible = false;
        fields.verticalOffset.visible = values.verticalLayout === "irregular";
        fields.gap.visible =
          parseInt(values.card1Width) + parseInt(values.card2Width) ===
            TWO_CARDS_COL_NUM && !values.collapse;
        fields.verticalGap.visible = values.collapse;
        fields.invertCollapsed.visible = values.collapse;

        return {
          fields: editingInfo.fields,
          components: {
            Card1: {
              fields: [
                {
                  ...fields.card1Width,
                  hidden: false,
                  group: "Placement and size",
                  label: "Width",
                },
                {
                  ...fields.card1EscapeMargin,
                  hidden: false,
                  group: "Placement and size",
                  label: "Escape margin",
                },
                {
                  ...fields.gap,
                  group: "Placement and size",
                  label: "Gap",
                },
                {
                  ...fields.verticalLayout,
                  group: "Placement and size",
                },
                {
                  ...fields.verticalOffset,
                  group: "Placement and size",
                },
              ],
            },
            Card2: {
              fields: [
                {
                  ...fields.card2Width,
                  hidden: false,
                  group: "Placement and size",
                  label: "Width",
                },
                {
                  ...fields.card2EscapeMargin,
                  hidden: false,
                  group: "Placement and size",
                  label: "Escape margin",
                },
                {
                  ...fields.gap,
                  group: "Placement and size",
                  label: "Gap",
                },
                {
                  ...fields.verticalLayout,
                  group: "Placement and size",
                },
                {
                  ...fields.verticalOffset,
                  group: "Placement and size",
                },
              ],
            },
          },
        };
      },

      schema: [
        {
          prop: "Card1",
          type: "component",
          componentTypes: ["card"],
        },
        {
          prop: "Card2",
          type: "component",
          componentTypes: ["card"],
        },
        {
          prop: "card1Width",
          type: "select$",
          options: [
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
          ],
          defaultValue: "12",
        },
        {
          prop: "card1EscapeMargin",
          type: "boolean$",
          label: "Escape margin",
        },
        {
          prop: "card2Width",
          type: "select$",
          options: range(4, 20).map(String),
          defaultValue: "12",
          label: "Width",
        },
        {
          prop: "card2EscapeMargin",
          type: "boolean$",
          label: "Escape margin",
        },
        {
          prop: "verticalLayout",
          type: "select$",
          options: [
            { label: "Top", value: "align-top" },
            { label: "Bottom", value: "align-bottom" },
            { label: "Center", value: "center" },
            { label: "Fit", value: "fit" },
            { label: "Irregular", value: "irregular" },
          ],
          label: "Align",
          group: "Layout",
        },
        {
          prop: "verticalOffset",
          label: "Offset",
          type: "select$",
          options: Array.from(Array(25).keys()).map((x) => `${x - 12}`),
          defaultValue: "-4",
          group: "Layout",
        },
        {
          prop: "collapse",
          label: "Stack cards",
          type: "boolean$",
          group: "Layout",
        },
        {
          prop: "gap",
          label: "Gap",
          type: "space",
          defaultValue: {
            value: "32px",
            ref: "32",
          },
          group: "Layout",
        },
        {
          prop: "verticalGap",
          label: "Gap",
          type: "space",
          defaultValue: {
            value: "24px",
            ref: "24",
          },
          group: "Layout",
        },
        {
          prop: "invertCollapsed",
          label: "Invert",
          type: "boolean",
          group: "Layout",
        },
      ],
    },
    {
      id: "$IconButton",
      tags: ["button"],
      styles: iconButtonStyles,
      editing: () => {
        return {
          components: {
            symbol: {
              selectable: false,
            },
          },
        };
      },
      schema: [
        buttonActionSchemaProp,
        buttonLabelSchemaProp,
        buttonRequiredIconSchemaProp,
        {
          prop: "symbolSize",
          label: "Symbol size",
          type: "select$",
          options: ["8", "16", "20", "24", "32", "40", "48", "64"],
          defaultValue: "24",
          group: "Properties",
          // visible: false FIXME: when we can pass icon size to the icon we will hide this field from here
        },
        {
          prop: "buttonSize",
          label: "Button size",
          type: "space",
          defaultValue: {
            value: "32px",
            ref: "32",
          },
          group: "Properties",
        },
        {
          prop: "shape",
          type: "select",
          options: ["circle", "square"],
          group: "Properties",
        },
        {
          prop: "backgroundColor",
          label: "Background color",
          type: "color",
          group: "Properties",
          defaultValue: {
            ref: "transparent",
            value: "transparent",
          },
        },
        {
          prop: "border",
          label: "Border width",
          type: "select",
          options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
        },
        {
          prop: "borderColor",
          label: "Border color",
          type: "color",
          visible: (values: any) => {
            return values.border !== "0";
          },
        },
      ],
    },

    {
      id: "$IconButton2",
      label: "Basic Icon Button",
      tags: ["button"],
      styles: iconButton2Styles,
      editing: () => {
        return {
          components: {
            symbol: {
              selectable: false,
            },
          },
        };
      },
      schema: [
        buttonActionSchemaProp,
        {
          ...buttonRequiredIconSchemaProp,
          group: "Symbol",
        },
        {
          prop: "hasBackground",
          type: "boolean",
          group: "Background",
          label: "Enabled",
          defaultValue: true,
        },
        {
          prop: "backgroundColor",
          type: "color",
          defaultValue: {
            ref: "$neutral",
            value: "grey",
          },
          visible: (values) => {
            return !!values.hasBackground;
          },
          group: "Background",
          label: "Color",
        },

        {
          prop: "hasBorder",
          type: "boolean",
          group: "Border and shadow",
          label: "Border enabled",
        },
        {
          prop: "borderWidth",
          type: "string$",
          defaultValue: "1",
          group: "Border and shadow",
          label: "Border width",
          visible: (values) => {
            return !!values.hasBorder;
          },
          normalize: pxValueNormalize(1, 16),
        },
        {
          prop: "borderColor",
          type: "color",
          defaultValue: {
            ref: "$dark",
            value: "black",
          },
          group: "Border and shadow",
          label: "Border color",
          visible: (values) => {
            return !!values.hasBorder;
          },
        },
        {
          prop: "boxShadow", // main image size
          label: "Box shadow",
          type: "stringToken",
          tokenId: "boxShadows",
          defaultValue: {
            ref: "none",
            value: "none",
          },
          group: "Border and shadow",
        },

        {
          prop: "symbolSize",
          label: "Symbol size",
          type: "string$",
          defaultValue: "24",
          group: "Size",
          normalize: pxValueNormalize(8, 128),
        },
        {
          prop: "buttonSize",
          label: "Button size",
          type: "string$",
          defaultValue: "32",
          group: "Size",
          visible: (values) => {
            return (
              values.hasBorder ||
              values.hasBackground ||
              values.boxShadow !== "none"
            );
          },
        },
        {
          prop: "shape",
          type: "select",
          options: ["circle", "square"],
          group: "Shape",
          label: "Shape",
          visible: (values) => {
            return (
              values.hasBorder ||
              values.hasBackground ||
              values.boxShadow !== "none"
            );
          },
        },
        {
          ...buttonLabelSchemaProp,
          group: "Accessibility",
        },
      ],
    },

    {
      id: "$Placeholder",
      tags: ["card", "notrace"],
      styles: placeholderStyles,
      schema: [],
    },

    {
      id: "$StandardButton",
      label: "Basic Button",
      tags: ["button"],
      styles: standardButtonStyles,
      schema: [
        buttonActionSchemaProp,
        buttonLabelSchemaProp,
        {
          ...buttonOptionalIconSchemaProp,
          visible: false,
        },
        {
          prop: "font",
          type: "font",
          group: "Font",
          label: "Style",
          defaultValue: {
            ref: "$body2.bold",
            value: {},
          },
        },
        {
          prop: "color",
          type: "color",
          group: "Font",
          label: "Color",
          defaultValue: {
            ref: "$dark",
            value: "?",
          },
        },
        {
          prop: "underline",
          type: "select",
          group: "Font",
          label: "Underline",
          options: [
            {
              value: "off",
              label: "Off",
            },
            {
              value: "on",
              label: "On",
            },
            {
              value: "on-custom",
              label: "On (custom offset)",
            },
          ],
        },
        {
          prop: "underlineOffset",
          type: "string$",
          group: "Font",
          label: "Underline offset",
          visible: (values) => {
            return values.underline === "on-custom";
          },
          normalize: pxValueNormalize(1, 16),
          defaultValue: "1",
        },
        {
          prop: "hasBackground",
          type: "boolean",
          group: "Background",
          label: "Enabled",
          defaultValue: true,
        },
        {
          prop: "backgroundColor",
          type: "color",
          defaultValue: {
            ref: "$neutral",
            value: "grey",
          },
          visible: (values) => {
            return !!values.hasBackground;
          },
          group: "Background",
          label: "Color",
        },

        {
          prop: "hasBorder",
          type: "boolean",
          group: "Border and shadow",
          label: "Border enabled",
        },
        {
          prop: "borderWidth",
          type: "string$",
          defaultValue: "1",
          group: "Border and shadow",
          label: "Border width",
          visible: (values) => {
            return !!values.hasBorder;
          },
          normalize: pxValueNormalize(1, 16),
        },
        {
          prop: "borderColor",
          type: "color",
          defaultValue: {
            ref: "$dark",
            value: "black",
          },
          group: "Border and shadow",
          label: "Border color",
          visible: (values) => {
            return !!values.hasBorder;
          },
        },
        {
          prop: "boxShadow", // main image size
          label: "Box shadow",
          type: "stringToken",
          tokenId: "boxShadows",
          defaultValue: {
            ref: "none",
            value: "none",
          },
          group: "Border and shadow",
        },
        {
          prop: "minHeight",
          type: "string$",
          defaultValue: "42",
          group: "Size",
          label: "Min height",
          visible: (values) => {
            return values.hasBorder || values.hasBackground;
          },
          normalize: pxValueNormalize(0, 256),
        },
        {
          prop: "minWidth",
          type: "string$",
          defaultValue: "100",
          group: "Size",
          label: "Min width",
          visible: (values) => {
            return values.hasBorder || values.hasBackground;
          },
          normalize: pxValueNormalize(0, 512),
        },
        {
          prop: "horizontalPadding",
          type: "space",
          group: "Size",
          label: "Left / Right padding",
          visible: (values) => {
            return values.hasBorder || values.hasBackground;
          },
          defaultValue: {
            ref: "16",
            value: "16px",
          },
        },
        {
          prop: "radius",
          type: "string$",
          defaultValue: "0",
          visible: (values) => {
            return (
              values.hasBorder ||
              values.hasBackground ||
              values.boxShadow !== "none"
            );
          },
          group: "Shape",
          label: "Corner radius",
          normalize: pxValueNormalize(0, 16),
        },
      ],
    },

    // {
    //   id: "$MissingComponent",
    //   schema: [
    //     {
    //       prop: "error",
    //       type: "string",
    //       visible: false,
    //     },
    //   ],
    //   tags: ["notrace"],
    //   styles: () => ({}),
    //   editing: () => ({
    //     components: {},
    //     fields: [],
    //   }),
    // },

    // {
    //   id: "$MissingAction",
    //   schema: [],
    //   tags: ["action", "notrace"],
    //   styles: () => ({}),
    //   editing: () => ({
    //     components: {},
    //     fields: [],
    //   }),
    // },

    playgroundComponentDefinition,

    {
      id: "$BannerCard2",
      label: "Banner Card",
      tags: ["card"],
      pasteSlots: ["SideImage", "Stack"],
      styles: bannerCard2Styles,
      auto: bannerCard2Auto,
      editing: ({ values, editingInfo }) => {
        const isNoneMode = values.mode === "none";
        const isBackgroundMode = values.mode === "background";
        const isBackgroundWithSeparateStackMode =
          values.mode === "background-separate-stack";

        let newFields: Required<EditingFunctionResult>["fields"] = [
          ...editingInfo.fields,
        ];

        const modeIndexPlus1 =
          editingInfo.fields.findIndex(
            (field) => field.path === "sideModeWidth"
          ) + 1;
        const fieldsBefore = editingInfo.fields.slice(0, modeIndexPlus1);
        const fieldsAfter = editingInfo.fields.slice(modeIndexPlus1);
        const fields = Object.fromEntries(
          editingInfo.fields.map((f) => [f.path, f])
        );

        fields.sideModeWidth.visible = false;

        const card1Fields: (typeof editingInfo)["fields"] = [];

        const card1StackFields: Array<EditingComponentFields> = [
          {
            type: "fields",
            path: `Card1.0`,
            filters: {
              group: "Stack",
            },
          },
        ];

        const fieldFromCard2 = (
          fieldName: string,
          group: string,
          label?: string
        ) => {
          const field: EditingField = {
            type: "field",
            path: `Card2.0.${fieldName}`,
            label,
            group,
          };

          return field;
        };

        const card2FieldPortalsBasic = [
          fieldFromCard2("size", "Cover"),
          fieldFromCard2("Background", "Cover", "Cover"),
        ];

        const card2FieldPortalsAll = [
          ...card2FieldPortalsBasic,
          ...borderSchemaProps("whatever").map((schemaProp) =>
            fieldFromCard2(schemaProp.prop, "Cover")
          ),
        ];

        // hide all background mode fields by default
        for (const field of editingInfo.fields) {
          if (field.path.startsWith("backgroundMode")) {
            fields[field.path].visible = false;
          }
        }

        if (isNoneMode) {
          newFields = [...fieldsBefore, ...card1StackFields, ...fieldsAfter];
        } else if (isBackgroundMode) {
          newFields = [
            ...fieldsBefore,
            ...card2FieldPortalsAll,
            ...card1StackFields,
            ...fieldsAfter,
          ];
        } else if (isBackgroundWithSeparateStackMode) {
          newFields = [
            ...fieldsBefore,
            ...card2FieldPortalsAll,
            ...fieldsAfter,
          ];
        } else if (values.mode === "left" || values.mode === "right") {
          fields.sideModeWidth.visible = true;
          newFields = [
            ...fieldsBefore,
            ...card2FieldPortalsBasic,
            ...fieldsAfter,
          ];
        } else if (values.mode === "top" || values.mode === "bottom") {
          newFields = [
            ...fieldsBefore,
            ...card2FieldPortalsBasic,
            ...fieldsAfter,
          ];
        }

        if (isBackgroundWithSeparateStackMode) {
          const { fieldsHorizontal, fieldsVertical } =
            bannerCard2SeparateStackModeController(values);

          for (const key in fields) {
            if (key.startsWith("backgroundMode")) {
              card1Fields.push(fields[key]);
            }
          }

          fields.backgroundModePosition.visible = true;
          fields.backgroundModeEdgeMarginProtection.visible = true;

          if (arePaddingFieldsSeparate(fieldsHorizontal)) {
            if (fieldsHorizontal.start !== null) {
              fields.backgroundModePaddingLeft.visible = true;
            }
            if (fieldsHorizontal.end !== null) {
              fields.backgroundModePaddingRight.visible = true;
            }
          } else {
            if (fieldsHorizontal.both !== null) {
              fields.backgroundModePaddingLeft.visible = true;
              fields.backgroundModePaddingLeft.label = "Offset horizontal";
            }
          }

          if (arePaddingFieldsSeparate(fieldsVertical)) {
            if (fieldsVertical.start !== null) {
              fields.backgroundModePaddingTop.visible = true;
            }
            if (fieldsVertical.end !== null) {
              fields.backgroundModePaddingBottom.visible = true;
            }
          } else {
            if (fieldsVertical.both !== null) {
              fields.backgroundModePaddingTop.visible = true;
              fields.backgroundModePaddingTop.label = "Offset vertical";
            }
          }
        }

        return {
          fields: newFields,

          components: {
            Card1: {
              selectable: !(isBackgroundMode || isNoneMode),
              fields: card1Fields,
              passedSize: "none",
            },
            Card2: {
              selectable: !(
                isBackgroundMode ||
                isNoneMode ||
                isBackgroundWithSeparateStackMode
              ),
              passedSize: "auto",
            },
          },
        };
      },
      schema: [
        {
          prop: "cornerRadius",
          label: "Corner radius",
          type: "select$",
          options: Array.from(Array(30).keys()).map((x) => x.toString()),
          group: "General",
        },
        ...borderSchemaProps("General"),

        {
          prop: "Card1",
          label: "Card1",
          type: "component-fixed",
          componentType: "$BasicCard",
        },
        {
          prop: "Card2",
          label: "Card2",
          type: "component-fixed",
          componentType: "$BasicCardBackground",
        },
        {
          prop: "mode", // main image size
          label: "Position",
          type: "select$",
          options: [
            { value: "none", label: "none" },
            { value: "background", label: "background" },
            { value: "left", label: "left" },
            { value: "right", label: "right" },
            { value: "top", label: "top" },
            { value: "bottom", label: "bottom" },
            {
              value: "background-separate-stack",
              label: "background (stack separate)",
            },
          ], // there is no "fit-content", because it doesn't make sense on mobile and it's actually very rare. If you want image, you don't want it to have some super narrow height, so the height is kind of "minimal" heihgt only.
          group: "Cover",
        },
        {
          prop: "sideModeWidth", // main image size
          label: "Width",
          type: "select$",
          options: ["25%", "33%", "40%", "50%", "60%", "66%", "75%"], // there is no "fit-content", because it doesn't make sense on mobile and it's actually very rare. If you want image, you don't want it to have some super narrow height, so the height is kind of "minimal" heihgt only.
          group: "Cover",
          defaultValue: "50%",
        },
        {
          prop: "backgroundModePosition",
          label: "Position",
          type: "select$",
          options: [
            "top-left",
            "top-center",
            "top-right",
            "center-left",
            "center-center",
            "center-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ],
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: "bottom-center",
        },

        {
          prop: "backgroundModePaddingLeft",
          label: "Offset left",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },
        {
          prop: "backgroundModePaddingRight",
          label: "Offset right",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },

        {
          prop: "backgroundModePaddingTop",
          label: "Offset top",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },

        {
          prop: "backgroundModePaddingBottom",
          label: "Offset bottom",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },

        {
          prop: "backgroundModeEdgeMarginProtection",
          label: "Snap to container margin",
          type: "boolean$",
          defaultValue: true,
          group: "Content Card",
        },

        buttonActionSchemaProp,
      ],
    },

    richTextEditableComponent,
    richTextBlockElementEditableComponent,
    richTextLineElementEditableComponent,
    richTextPartEditableComponent,
    richTextInlineWrapperElementEditableComponent,
    vimeoPlayerEditableComponent,
    basicCardDefinition,
    basicBackgroundCardDefinition,
    cardPlaceholderDefinition,
    componentContainerDefinition,

    {
      id: "$MissingComponent",
      schema: [
        {
          prop: "error",
          type: "string",
          visible: false,
        },
      ],
      tags: ["notrace"],
    },
    {
      id: "$MissingAction",
      schema: [],
      tags: ["action", "notrace"],
    },
  ];
