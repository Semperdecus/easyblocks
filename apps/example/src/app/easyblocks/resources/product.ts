import {
  FetchInputResources,
  FetchOutputCompoundResources,
  ImageSrc,
  PickerItem,
  Widget,
} from "@easyblocks/core";
import { MockProductsService } from "../../../data/MockData/MockProductsService";

const productWidget: Widget = {
  id: "product",
  component: {
    type: "item-picker",
    async getItemById(id) {
      const item = await MockProductsService.getProductById(id);

      if (!item) {
        throw new Error("Unable to find product for id: " + id);
      }

      return {
        id: item.id,
        title: item.title,
        thumbnail: item.image,
      };
    },
    async getItems(query) {
      const items = await MockProductsService.searchProducts(query);

      return items.map<PickerItem>((item) => {
        return {
          id: item.id,
          title: item.title,
          thumbnail: item.image,
        };
      });
    },
  },
  label: "E-commerce",
};

async function fetchProductResources(
  resources: FetchInputResources
): Promise<FetchOutputCompoundResources> {
  const productResources = Object.entries(resources).filter(
    ([, resource]) => resource.widgetId === productWidget.id
  );

  if (productResources.length === 0) {
    return {};
  }

  const productIds = productResources.map(
    ([, resource]) => resource.externalId
  );

  const products = await MockProductsService.getProductsByIds(productIds);

  const result: FetchOutputCompoundResources = {};

  productResources.forEach(([id, inputResource]) => {
    const product = products.find((p) => p.id === inputResource.externalId);

    if (!product) {
      result[id] = {
        type: "object",
        error: new Error(
          `Product with id "${inputResource.externalId}" not found`
        ),
        values: undefined,
      };
      return;
    }

    const productImage: ImageSrc = {
      alt: product.title,
      aspectRatio: 2000 / 1333,
      mimeType: "image/jpeg",
      url: product.image,
      srcset: [
        {
          h: 1333,
          url: product.image,
          w: 2000,
        },
      ],
    };

    result[id] = {
      type: "object",
      values: {
        mainImage: {
          type: "image",
          value: productImage,
          label: "Main image",
        },
        title: {
          type: "text",
          value: product.title,
        },
      },
      error: null,
    };
  });

  return result;
}

export { productWidget, fetchProductResources };
