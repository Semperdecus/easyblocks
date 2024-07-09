"use client";
import React, { ReactElement, useEffect } from "react";
import { RichTextClient } from "../compiler/builtins/$richText/$richText.client";
import { RichTextBlockElementClient } from "../compiler/builtins/$richText/$richTextBlockElement/$richTextBlockElement.client";
import { RichTextLineElementClient } from "../compiler/builtins/$richText/$richTextLineElement/$richTextLineElement.client";
import { RichTextPartClient } from "../compiler/builtins/$richText/$richTextPart/$richTextPart.client";
import { TextClient } from "../compiler/builtins/$text/$text.client";
import { ExternalData, RenderableDocument } from "../types";
import {
  ComponentBuilder,
  ComponentBuilderProps,
} from "./ComponentBuilder/ComponentBuilder";
import { EasyblocksExternalDataProvider } from "./EasyblocksExternalDataProvider";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";
import { MissingComponent } from "./MissingComponent";

export type EasyblocksProps = {
  renderableDocument: RenderableDocument;
  externalData?: ExternalData;
  components?: Record<string, React.ComponentType<any>>;
  componentOverrides?: ComponentOverrides;
};

export type ComponentOverrides = Record<string, ReactElement>;

const builtinComponents: ComponentBuilderProps["components"] = {
  "@easyblocks/missing-component": MissingComponent,
  "@easyblocks/rich-text.client": RichTextClient,
  "@easyblocks/rich-text-block-element": RichTextBlockElementClient,
  "@easyblocks/rich-text-line-element": RichTextLineElementClient,
  "@easyblocks/rich-text-part": RichTextPartClient,
  "@easyblocks/text.client": TextClient,
  "EditableComponentBuilder.client": ComponentBuilder,
};

// const css = stitches.css({
//   width: "100%",
//   wordWrap: "break-word",
//   display: "block",
//   fontSize: "inherit",
//   fontFamily: "inherit",
//   fontWeight: "inherit",
//   boxSizing: "border-box",
//   color: "inherit",
//   letterSpacing: "inherit",
//   lineHeight: "inherit",
//   margin: "0 auto",
//   maxWidth: "inherit",
//   textTransform: "inherit",
//   backgroundColor: "inherit",
//   textAlign: "inherit",
//   outline: "none",
//   resize: "none",
//   border: "none",
//   overflow: "visible",
//   position: "relative",
//   padding: 0,
//   "-ms-overflow-style": "none",
//   "&::-webkit-scrollbar": {
//     display: "none",
//   },
//   pointerEvents: isEnabled ? "auto" : "none",
// })();

const easyblocksStyles = `
  .EasyblocksInlineTextarea_Textarea {
    width: 100%;
    word-wrap: break-word;
    display: block;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    box-sizing: border-box;
    color: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    margin: 0 auto;
    max-width: inherit;
    text-transform: inherit;
    background-color: inherit;
    text-align: inherit;
    outline: none;
    resize: none;
    border: none;
    overflow: visible;
    position: relative;
    padding: 0;
    -ms-overflow-style: none;
    pointer-events: none;
  }

  .EasyblocksInlineTextarea_Textarea::-webkit-scrollbar {
    display: none;
  }

  .EasyblocksInlineTextarea_Textarea--enabled {
    pointer-events: auto;
  }

  .EasyblocksRichTextEditor_Root {
    cursor: inherit;
  }

  .EasyblocksRichTextEditor_Root--enabled {
    cursor: text;
  }

  .EasyblocksRichTextEditor_Root--fallbackValue {
    opacity: 0.5;
  }

  .EasyblocksRichTextEditor_Root [data-slate-node] {
    text-decoration: none;
  }

  .EasyblocksRichTextEditor_Root * {
    pointer-events: none;
    user-select: none;
  }

  .EasyblocksRichTextEditor_Root--enabled * {
    pointer-events: auto;
    user-select: auto;
  }

  .EasyblocksRichTextEditor_Root * {
    pointer-events: none;
    user-select: none;
  }

  .EasyblocksRichTextEditor_Root *::selection {
    background-color: #b4d5fe;
  }

  .EasyblocksRichTextEditor_Root--decorationActive *::selection {
    background-color: transparent;
  }

  .EasyblocksRichTextEditor_Root--decorationActive *[data-easyblocks-rich-text-selection] {
    background-color: #b4d5fe;
  }
`;

// cursor: !isEnabled ? "inherit" : "text",
// "& *": {
//   pointerEvents: isEnabled ? "auto" : "none",
//   userSelect: isEnabled ? "auto" : "none",
// },
// "& *::selection": {
//   backgroundColor: "#b4d5fe",
// },
// ...(isDecorationActive && {
//   "& *::selection": {
//     backgroundColor: "transparent",
//   },
//   "& *[data-easyblocks-rich-text-selection]": {
//     backgroundColor: "#b4d5fe",
//   },
// }),
// ...(isFallbackValueShown && {
//   opacity: 0.5,
// }),
// // Remove any text decoration from slate nodes that are elements. We only need text decoration on text elements.
// "[data-slate-node]": {
//   textDecoration: "none",
// },

function Easyblocks({
  renderableDocument,
  externalData,
  componentOverrides,
  components,
}: EasyblocksProps) {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shopstory-viewport-width",
      `calc(100vw - ${
        window.innerWidth - document.documentElement.clientWidth
      }px)`
    );
  });

  const renderableContent = renderableDocument.renderableContent;

  if (renderableContent === null) {
    return null;
  }

  if (componentOverrides) {
    const overridesEntries = Object.entries(componentOverrides);

    overridesEntries.forEach(([componentProp, componentOverride]) => {
      renderableContent.components[componentProp] = [componentOverride];
    });
  }

  return (
    <EasyblocksMetadataProvider meta={renderableDocument.meta}>
      <EasyblocksExternalDataProvider externalData={externalData ?? {}}>
        <style dangerouslySetInnerHTML={{ __html: easyblocksStyles }} />
        <ComponentBuilder
          compiled={renderableContent}
          path={""}
          components={{
            ...components,
            ...builtinComponents,
          }}
        />
      </EasyblocksExternalDataProvider>
    </EasyblocksMetadataProvider>
  );
}

export { Easyblocks };
