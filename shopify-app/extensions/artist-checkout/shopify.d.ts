import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/index.tsx' {
  const shopify:
    | import('@shopify/ui-extensions/pos.home.tile.render').Api
    | import('@shopify/ui-extensions/pos.home.modal.render').Api;
  const globalThis: { shopify: typeof shopify };
}
