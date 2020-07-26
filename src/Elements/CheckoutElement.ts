class CheckoutElement extends Core {
  products: Array<StoreItem>;
  core: Core;

  constructor(core: Core, products: Array<StoreItem>, successFunction) {
    super(core.getKey());
    this.core = core;
    this.products = products;

    document.addEventListener("paymentSuccess", successFunction);
  }

  getJSON() {
    var finalProducts = new Array();
    this.products.forEach((product) => {
      finalProducts.push(product.getId());
    });
    return JSON.stringify(finalProducts);
  }

  loadInto(selector: string) {
    var key = this.core.getKey();
    var products = this.getJSON();

    /*
    $.getScript("https://js.stripe.com/v3/", function (
      data,
      textStatus,
      jqxhr
    ) {
      $(selector).load(
        "https://api.purecore.io/rest/2/element/checkout/?key=" +
          key +
          "&items=" +
          products
      );
    });*/
  }
}
