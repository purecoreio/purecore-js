class Elements extends Core {
  core: Core;

  constructor(core: Core) {
    super(core.getKey());
    this.core = core;
  }

  getCheckoutElement(products: Array<StoreItem>, successFunction) {
    return new CheckoutElement(this.core, products, successFunction);
  }
}
