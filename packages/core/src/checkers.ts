import { z } from "zod";
import { isCompiledComponentConfig } from "./isCompiledComponentConfig";
import {
  RenderableContent,
  NonEmptyRenderableContent,
  EmptyRenderableContent,
  Document,
  ComponentConfig,
} from "./types";

function isRenderableContent(input: unknown): input is RenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    (isCompiledComponentConfig(
      (input as { renderableContent: unknown }).renderableContent
    ) ||
      (input as { renderableContent: unknown }).renderableContent === null)
  );
}

function isNonEmptyRenderableContent(
  input: unknown
): input is NonEmptyRenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    isCompiledComponentConfig(
      (input as { renderableContent: unknown }).renderableContent
    )
  );
}

function isEmptyRenderableContent(
  input: unknown
): input is EmptyRenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    (input as { renderableContent: unknown }).renderableContent === null
  );
}

const documentSchema = z.object({
  documentId: z.string(),
  projectId: z.string(),
  rootContainer: z.string().optional(),
  preview: z.object({}).optional(),
  config: z.optional(z.object({})),
});

function isDocument(value: unknown): value is Document {
  return documentSchema.safeParse(value).success;
}

export function isComponentConfig(value: any): value is ComponentConfig {
  return (
    typeof value === "object" &&
    typeof value?._template === "string" &&
    typeof value?._id === "string"
  );
}

export {
  isRenderableContent,
  isNonEmptyRenderableContent,
  isEmptyRenderableContent,
  isDocument,
};
