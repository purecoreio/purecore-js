class StoreItem {

    public id: string;
    public name: string;
    public description: string;
    public icon: string;
    public banner: string;
    public price: number;
    public perks: Array<PerkCategoryRepresentation>;
    public enable: boolean;
    public list: boolean;
    public archived: boolean;

    public constructor(id: string, name: string, description: string, icon: string, banner: string, price: number, perks: Array<PerkCategoryRepresentation>, enable: boolean, list: boolean, archived: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.banner = banner;
        this.price = price;
        this.perks = perks;
        this.enable = enable;
        this.list = list;
        this.archived = archived;
    }

    public static fromObject(object: any): StoreItem {
        let perkRepresentations = new Array<PerkCategoryRepresentation>();
        for (let i = 0; i < object.perks.length; i++) {
            const element = object.perks[i];
            perkRepresentations.push(PerkCategoryRepresentation.fromObject(element));
        }
        return new StoreItem(object.id, object.name, object.description, object.icon, object.banner, object.price, perkRepresentations, object.enable, object.list, object.archived);
    }

    public async addPerk(perk: Perk | string, quantity: number = null): Promise<PerkContext> {
        let perkId = perk;
        if (perk instanceof Perk) {
            perkId = perk.id;
        }
        let call = new Call()
            .addParam(Param.StoreItem, this.id)
            .addParam(Param.Perk, perkId)
        if (quantity != null) {
            call.addParam(Param.Quantity, quantity)
        }
        return await call.commit('store/item/perk/add/').then((res) => {
            return PerkContext.fromObject(res);
        })
    }

    public async removePerk(perk: Perk | PerkContext | string): Promise<void> {
        let perkId = perk;
        if (perk instanceof Perk || perk instanceof PerkContext) {
            perkId = perk.id;
        }
        return new Call()
            .addParam(Param.StoreItem, this.id)
            .addParam(Param.Perk, perkId)
            .commit('store/item/perk/remove/').then(() => {
                return;
            })
    }

}