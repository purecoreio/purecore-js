class PerkCategoryRepresentation {

    public category: PerkCategory;
    public perks: Array<Perk | PerkContext>;

    public constructor(perkCategory: PerkCategory, perks: Array<Perk | PerkContext>) {
        this.category = perkCategory;
        this.perks = perks;
    }

    public static fromObject(object: any): PerkCategoryRepresentation {
        let perks = new Array<Perk | PerkContext>();
        for (let i = 0; i < object.perks.length; i++) {
            const element = object.perks[i];
            if ('quantity' in element) {
                perks.push(PerkContext.fromObject(element));
            } else {
                perks.push(Perk.fromObject(element));
            }
        }
        return new PerkCategoryRepresentation(PerkCategory.fromObject(object.category), perks);
    }

}