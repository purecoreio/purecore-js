class NestedItem extends Core {
  public core: Core;
  public uuid: string;
  public items: Array<StoreItem>;
  public category: StoreCategory;

  constructor(core: Core) {
    super(core.getTool());
    this.core = core;
  }

  fromArray(array): NestedItem {
    this.category = new StoreCategory(this.core).fromArray(array.category);
    this.uuid = this.category.getId();

    this.items = new Array<StoreItem>();
    array.products.forEach((product) => {
      this.items.push(new StoreItem(this.core).fromArray(product));
    });

    return this;
  }

  getCategory(): StoreCategory {
    return this.category;
  }

  getItems(): Array<StoreItem> {
    return this.items;
  }
}
