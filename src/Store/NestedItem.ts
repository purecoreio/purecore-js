class NestedItem extends Core {
  public core: Core;
  public uuid: string;
  public items: Array<StoreItem>;
  public category: StoreCategory;

  constructor(core: Core) {
    super(core.getTool());
    this.core = core;
  }

  fromObject(array): NestedItem {
    this.category = new StoreCategory(this.core).fromObject(array.category);
    this.uuid = this.category.getId();

    this.items = new Array<StoreItem>();
    array.products.forEach((product) => {
      this.items.push(new StoreItem(this.core).fromObject(product));
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
