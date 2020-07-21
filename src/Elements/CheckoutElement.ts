class CheckoutElement extends Core {
    public products: Array<StoreItem>;
    public core: Core;

    public constructor(core: Core, products: Array<StoreItem>, successFunction) {
        super(core.getKey());
        this.core = core;
        this.products = products;

        document.addEventListener("paymentSuccess", successFunction);
    }

    public getJSON(): string {
        return JSON.stringify(this.products.map(product => product.getId()));
    }

    public loadInto(selector: string): void {
        /*
        $.getScript("https://js.stripe.com/v3/", (
            data,
            textStatus,
            jqxhr
        ) => {
            $(selector).load(
                "https://api.purecore.io/rest/2/element/checkout/?key=" +
                this.core +
                "&items=" +
                this.getJSON()
            );
        });*/
    }
}
