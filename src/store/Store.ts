class Store extends Network {

    public constructor(id: string, name: string, game: Game, platform: Platform) {
        super(id, name, game, platform);
    }

    public async requestPayment(profile: PlatformProfile | string, items: Array<StoreItem | string>, address: Address | any): Promise<HashedPayment> {
        let profileId = (typeof profile == 'string') ? profile : profile.id;
        let addressObj = (address instanceof Address) ? address.asObject() : address;
        let itemIds = Array<String>();
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            if (element instanceof StoreItem) {
                itemIds.push(element.id);
            } else if (typeof element == 'string') {
                itemIds.push(element);
            }
        }
        return await new Call()
            .addParam(Param.Network, this.getId())
            .addParam(Param.Profile, profileId)
            .addParam(Param.Address, JSON.stringify(addressObj))
            .addParam(Param.StoreItems, JSON.stringify(itemIds))
            .commit('payment/request/').then((res) => {
                return HashedPayment.fromObject(res);
            })
    }

    public async getRepresentation(): Promise<StoreRepresentation> {
        return await new Call()
            .addParam(Param.Network, this.getId())
            .commit('store/representation/').then((res) => {
                return StoreRepresentation.fromObject(res);
            })
    }

    public async getPublishableRepresentation(): Promise<StoreRepresentation> {
        return await new Call()
            .addParam(Param.Network, this.getId())
            .commit('store/representation/publishable/').then((res) => {
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