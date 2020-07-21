class OrganizedPerkCategory {
    public readonly perkCategory: PerkCategory;
    public readonly perkList: Array<PerkContextualized>;

    public constructor(category?: PerkCategory, perk?: Array<PerkContextualized>) {
        this.perkCategory = category;
        this.perkList = perk;
    }

    public getPerks(): Array<PerkContextualized> {
        return this.perkList;
    }

    public getCategory(): PerkCategory {
        return this.perkCategory;
    }
}
