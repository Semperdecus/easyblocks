import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { buttonsStyles } from "./$buttons.styles";

const buttonsComponentDefinition: InternalRenderableComponentDefinition<"$buttons"> =
  {
    id: "$buttons",
    label: "Button Group",
    type: "item",
    pasteSlots: ["Buttons"],
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button_group.png",
    styles: buttonsStyles,
    editing: ({ values }) => {
      return {
        components: {
          Buttons: values.Buttons.map(() => ({
            direction: "horizontal",
          })),
        },
      };
    },
    schema: [
      {
        prop: "verticalLayout",
        label: "Vertical layout",
        type: "boolean",
      },
      {
        prop: "gap",
        label: "Gap",
        type: "space",
      },
      {
        prop: "Buttons",
        label: "Buttons",
        type: "component-collection",
        componentTypes: ["button"],
      },
    ],
  };

export { buttonsComponentDefinition };
