class Store extends Network {

    public constructor(id: string, name: string, game: Game, platform: Platform) {
        super(id, name, game, platform);
    }

    public async getRepresentation(): Promise<StoreRepresentation> {
        return await new Call()
            .addParam(Param.Network, this.getId())
            .commit('store/representation/').then((res) => {
                return StoreRepresentation.fromObject(res);
            })
    }

    public async getPerkRepresentation(): Promise<StorePerkRepresentation> {
        return await new Call()
            .addParam(Param.Network, this.getId())
            .commit('store/representation/perks/').then((res) => {
                return StorePerkRepresentation.fromObject(res);
            })
    }

    public async createCategory(name: string, description: string = null): Promise<ItemCategory> {
        let call = new Call()
            .addParam(Param.Network, this.getId())
            .addParam(Param.Name, name)
        if (description != null) {
            call.addParam(Param.Description, description)
        }
        return await call.commit('store/item/category/create/').then((res) => {
            return ItemCategory.fromObject(res);
        })
    }

    public async createPerkCategory(name: string, description: string = null): Promise<PerkCategory> {
        let call = new Call()
            .addParam(Param.Network, this.getId())
            .addParam(Param.Name, name)
        if (description != null) {
            call.addParam(Param.Description, description)
        }
        return await call.commit('store/perk/category/create/').then((res) => {
            return PerkCategory.fromObject(res);
        })
    }


}