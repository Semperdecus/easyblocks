type EditorSearchParams = {
  readOnly: boolean | null;
  documentId: string | null;
  rootComponentId: string | null;
  locale: string | null;
  preview: boolean;
};

export function parseQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);

  const readOnly =
    searchParams.get("readOnly") === "true"
      ? true
      : searchParams.get("readOnly") === "false"
      ? false
      : null;
  const documentId = searchParams.get("document");
  const rootComponentId = searchParams.get("rootComponent");
  const locale = searchParams.get("locale");

  const preview = searchParams.get("preview") === "true";

  const editorSearchParams: EditorSearchParams = {
    readOnly,
    documentId,
    rootComponentId,
    locale,
    preview,
  };

  return editorSearchParams;
}
