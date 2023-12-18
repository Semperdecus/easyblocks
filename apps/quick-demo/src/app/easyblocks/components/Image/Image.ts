import {
  ExternalReference,
  NoCodeComponentDefinition,
  getExternalReferenceLocationKey,
  getExternalValue,
  isCompoundExternalDataValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/core";
import { buttonActionSchemaProp } from "@easyblocks/core/_internals";
import { ImageSrc } from "@easyblocks/editable-components";
import { assertDefined, last } from "@easyblocks/utils";
import { imageStyles } from "./Image.styles";

const imageComponentDefinition: NoCodeComponentDefinition = {
  id: "Image",
  label: "Image",
  type: "item",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_image.png",
  styles: imageStyles,
  editing: ({ params, editingInfo }) => {
    let fields = [...editingInfo.fields];

    // If aspect ratio passed from external, we don't need it.
    if (params.noAspectRatio) {
      fields = fields.filter((field) => field.path !== "aspectRatio");
    }

    if (params.noAction) {
      fields = fields.filter((field) => field.path !== "action");
    }

    return {
      fields,
    };
  },
  schema: [
    {
      prop: "image",
      type: "@easyblocks/image",
      label: "Source",
      optional: true,
    },
    {
      prop: "aspectRatio", // main image size
      label: "Aspect Ratio",
      type: "stringToken",
      params: {
        tokenId: "aspectRatios",
        extraValues: ["natural"],
      },
      buildOnly: true,
    },
    buttonActionSchemaProp,
  ],
  preview({ values }) {
    const activeImageValue = values.image as ImageSrc | undefined;

    if (!activeImageValue) {
      return {
        description: "None",
      };
    }

    const imageFileName = last(activeImageValue.url.split("/"));
    const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

    return {
      thumbnail: {
        type: "image",
        src: activeImageValue.url,
      },
      description: imageFileNameWithoutQueryParams,
    };
  },
};

export { imageComponentDefinition };
