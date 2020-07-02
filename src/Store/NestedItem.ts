class NestedItem extends Core {
    public core: Core;
    public uuid: string;
    public items: Array<StoreItem>;
    public category: StoreCategory;

    public constructor(core: Core, uuid?: string, items?: Array<StoreItem>, category?: StoreCategory) {
        super(core.getTool());
        this.core = core;
    }

    public getId(): string {
        return this.uuid;
    }

    public getCategory(): StoreCategory {
        return this.category;
    }

    public getItems(): Array<StoreItem> {
        return this.items;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array: any): NestedItem {
        this.category = StoreCategory.fromJSON(this.core, array.category);
        this.uuid = this.category.getId();
        this.items = array.products.map(product => StoreItem.fromJSON(this.core, product))
        return this;
    }

    public static fromJSON(core: Core, json: any): NestedItem {
        const category: StoreCategory = StoreCategory.fromJSON(core, json.category);

        return new NestedItem(
            core,
            category.getId(),
            json.products.map(product => StoreItem.fromJSON(core, product)),
            category,
        );
    }
}
