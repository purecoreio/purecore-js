class PerkCategory extends Core {
    public readonly core: Core;
    public uuid: string;
    public name: string;
    public network: Network;

    constructor(core: Core, id?: string, name?: string, network?: Network) {
        super(core.getTool());
        this.core = core;
        this.uuid = id;
        this.name = name;
        this.network = network;
    }

    public async createPerk(name: string, description: string, type: string): Promise<Perk> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    name: name,
                    description: description,
                    type: type.toUpperCase(),
                    category: this.uuid,
                },
                "store/perk/create/"
            )
            .then(json => Perk.fromJSON(this.core, json));
    }

    public getId(): string {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }

    public getNetwork(): Network {
        return this.network
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): PerkCategory {
        this.uuid = array.uuid;
        this.name = array.name;
        this.network = Network.fromJSON(this.core, array.network);

        return this;
    }

    public static fromJSON(core: Core, json: any): PerkCategory {
        return new PerkCategory(
            core,
            json.uuid,
            json.name,
            Network.fromJSON(core, json.network),
        );
    }
}
