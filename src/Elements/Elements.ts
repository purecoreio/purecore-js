class Elements extends Core {
    public core: Core;

    public constructor(core: Core) {
        super(core.getKey());
        this.core = core;
    }

    public getCheckoutElement(products: Array<StoreItem>, successFunction): CheckoutElement {
        return new CheckoutElement(this.core, products, successFunction);
    }
}
