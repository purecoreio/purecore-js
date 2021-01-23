class StoreRepresentation {

    public categories: Array<ItemCategoryRepresentation>;

    public constructor(representations: Array<ItemCategoryRepresentation>) {
        this.categories = representations;
    }

    public static fromObject(object: any): StoreRepresentation {
        let representations = new Array<ItemCategoryRepresentation>();
        for (let i = 0; i < object.categories.length; i++) {
            const element = object.categories[i];
            representations.push(ItemCategoryRepresentation.fromObject(element));
        }
        return new StoreRepresentation(representations);
    }

}