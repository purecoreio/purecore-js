class StoreRepresentation {

    public itemCategoryRepresentations: Array<ItemCategoryRepresentation>;

    public constructor(representations: Array<ItemCategoryRepresentation>) {
        this.itemCategoryRepresentations = representations;
    }

    public static fromObject(object: any): StoreRepresentation {
        let representations = new Array<ItemCategoryRepresentation>();
        for (let i = 0; i < object.itemCategoryRepresentations.length; i++) {
            const element = object.itemCategoryRepresentations[i];
            representations.push(ItemCategoryRepresentation.fromObject(element));
        }
        return new StoreRepresentation(representations);
    }

}