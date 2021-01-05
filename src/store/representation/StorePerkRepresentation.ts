class StorePerkRepresentation {

    public perkRepresentations: Array<PerkCategoryRepresentation>;

    public constructor(representations: Array<PerkCategoryRepresentation>) {
        this.perkRepresentations = representations;
    }

    public static fromObject(object: any): StorePerkRepresentation {
        let representations = new Array<PerkCategoryRepresentation>();
        for (let index = 0; index < object.perkRepresentations.length; index++) {
            const element = object.perkRepresentations[index];
            representations.push(PerkCategoryRepresentation.fromObject(element));
        }
        return new StorePerkRepresentation(representations);
    }

}