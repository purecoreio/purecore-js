class ItemCategory {

    public id: string;
    public name: string;
    public description: string;
    public icon: string;
    public banner: string;
    public preferredRepresentation: PreferredRepresentation;
    public list: boolean;
    public enabled: boolean;
    public upgradable: boolean;
    public archived: boolean;

    public constructor(id: string, name: string, description: string, icon: string, banner: string, preferredRepresentation: PreferredRepresentation, list: boolean, enabled: boolean, upgradable: boolean, archived: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.banner = banner;
        this.preferredRepresentation = preferredRepresentation;
        this.list = list;
        this.enabled = enabled;
        this.upgradable = upgradable;
        this.archived = archived;
    }

    public static fromObject(object: any): ItemCategory {
        let representation = null;
        switch (object.preferredRepresentation) {
            case 0:
                representation = PreferredRepresentation.List;
                break;
            case 1:
                representation = PreferredRepresentation.Box;
                break;
            case 2:
                representation = PreferredRepresentation.Table;
                break;
            case 3:
                representation = PreferredRepresentation.Carousel;
                break;
            default:
                representation = PreferredRepresentation.Unknown;
                break;
        }
        return new ItemCategory(object.id, object.name, object.description, object.icon, object.banner, representation, object.list, object.enabled, object.upgradable, object.archived);
    }

    public async createItem(name: string, price: Number, description: string = null): Promise<StoreItem> {
        let call = new Call()
            .addParam(Param.StoreCategory, this.id)
            .addParam(Param.Name, name)
            .addParam(Param.Price, price)
        if (description != null) {
            call.addParam(Param.Description, description)
        }
        return await call.commit('store/item/create/').then((res) => {
            return StoreItem.fromObject(res);
        })
    }

}