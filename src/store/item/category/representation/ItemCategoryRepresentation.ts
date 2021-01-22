class ItemCategoryRepresentation {

    public category: ItemCategory;
    public items: Array<StoreItem>;

    public constructor(itemCategory: ItemCategory, items: Array<StoreItem>) {
        this.category = itemCategory;
        this.items = items;
    }

    public static fromObject(object: any): ItemCategoryRepresentation {
        const itemCategory = ItemCategory.fromObject(object.itemCategory);
        let items = new Array<StoreItem>();
        for (let i = 0; i < object.items.length; i++) {
            const element = object.items[i];
            items.push(StoreItem.fromObject(element));
        }
        return new ItemCategoryRepresentation(itemCategory, items);
    }

}