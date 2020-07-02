class StoreCategory extends Core {
    public readonly core: Core;
    public uuid: string;
    public name: string;
    public description: string;
    public network: Network;
    public upgradable: boolean;

    public constructor(core: Core, uuid?: string, name?: string, description?: string, network?: Network, upgradable?: boolean) {
        super(core.getTool());

        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }

    public async createItem(name: string, description: string, price): Promise<StoreItem> {
        return new Call(this.core)
            .commit(
                {
                    network: this.network.uuid,
                    name: name,
                    description: description,
                    category: this.uuid,
                    price: price,
                },
                "store/item/create/"
            )
            .then(item => StoreItem.fromJSON(this.core, item));
    }

    public getId() {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public isUpgradable(): boolean {
        return this.upgradable;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): StoreCategory {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = Network.fromJSON(this.core, array.network);
        this.upgradable = array.upgradable;
        return this;
    }

    public static fromJSON(core: Core, json: any): StoreCategory {
        return new StoreCategory(
            core,
            json.uuid,
            json.name,
            json.description,
            Network.fromJSON(core, json.network),
            json.upgradable
        );
    }
}
