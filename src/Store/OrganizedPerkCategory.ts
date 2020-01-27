class OrganizedPerkCategory {

    public perkCategory: PerkCategory;
    public perkList: Array<PerkContextualized>;

    public constructor(category?: PerkCategory, perk?: Array<PerkContextualized>) {
        this.perkCategory=category;
        this.perkList=perk;
    }

    getPerks():Array<PerkContextualized>{
        return this.perkList;
    }

    getCategory():PerkCategory{
        return this.perkCategory;
    }

}