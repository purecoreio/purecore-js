class StorePerkRepresentation {

    public perks: Array<PerkCategoryRepresentation>;

    public constructor(representations: Array<PerkCategoryRepresentation>) {
        this.perks = representations;
    }

    public static fromObject(object: any): StorePerkRepresentation {
        let representations = new Array<PerkCategoryRepresentation>();
        for (let index = 0; index < object.perks.length; index++) {
            const element = object.perks[index];
            representations.push(PerkCategoryRepresentation.fromObject(element));
        }
        return new StorePerkRepresentation(representations);
    }

}