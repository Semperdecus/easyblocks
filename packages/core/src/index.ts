export * from "./checkers";
export type { ResourcesStore } from "./createResourcesStore";
export { createResourcesStore } from "./createResourcesStore";
export { loadScript } from "./loadScripts";
export * from "./types";
export * from "./resourcesUtils";
export * from "./buildPreview";
export * from "./locales";
export { ApiClient } from "./infrastructure/apiClient";
export type {
  ApiAuthenticationStrategy,
  ConfigDTO,
  DocumentDTO,
  DocumentWithResolvedConfigDTO,
  AssetDTO,
  IApiClient,
} from "./infrastructure/apiClient";
export { ShopstoryAccessTokenApiAuthenticationStrategy } from "./infrastructure/ShopstoryAccessTokenApiAuthenticationStrategy";
export { createFetchingContext } from "./createFetchingContext";
export type { FetchingContext } from "./createFetchingContext";

export function getResourceId(
  configId: string,
  fieldName: string,
  deviceId?: string
) {
  let resourceId = `${configId}.${fieldName}`;

  if (deviceId) {
    resourceId += `.${deviceId}`;
  }

  return resourceId;
}

export { buildEntry } from "./buildEntry";
export { buildDocument } from "./buildDocument";
