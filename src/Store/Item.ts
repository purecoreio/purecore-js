class StoreItem extends Core {
    public readonly core: Core;
    public uuid: string;
    public name: string;
    public description: string;
    public category: StoreCategory;
    public network: Network;
    public price: number;
    public perks: Array<PerkContextualized>;

    constructor(core: Core, uuid?: string, name?: string, description?: string, category?: StoreCategory, network?: Network, price?: number, contextualizedPerks?: Array<PerkContextualized>) {
        super(core.getTool());

        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = contextualizedPerks;
    }

    public async addPerk(perk: Perk | string, quantity: number): Promise<PerkContextualized> {
        return new Call(this.core)
            .commit(
                {
                    network: this.network.uuid,
                    item: this.uuid,
                    perk: typeof perk == "string" ? perk : perk.getUuid(),
                    quantity: quantity,
                },
                "store/item/add/perk/"
            )
            .then(json => PerkContextualized.fromJSON(this.core, json));
    }

    public getOrganizedPerks(): Array<OrganizedPerkCategory> {
        const perkOrganized = {};
        this.perks.forEach((perk: PerkContextualized) => {
            const uuid: string = perk.getPerk().getCategory().getId();

            if (uuid in perkOrganized) {
                perkOrganized[uuid].push(perk);
            } else {
                perkOrganized[uuid] = new Array<PerkContextualized>();
                perkOrganized[uuid].push(perk);
            }
        });

        return Object.keys(perkOrganized)
            .map(key => {
                let category = null;
                perkOrganized[key].forEach((conperk) => {
                    if (conperk.perk.category.uuid == key) {
                        category = conperk.perk.category;
                    }
                });

                return new OrganizedPerkCategory(
                    category,
                    perkOrganized[key]
                );
            });
    }

    public getId(): string {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCategory(): StoreCategory {
        return this.category;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getPrice(): number {
        return this.price;
    }

    public getPerks(): Array<PerkContextualized> {
        return this.perks;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array: any): StoreItem {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.category = StoreCategory.fromJSON(this.core, array.category);
        this.network = new Network(
            this.core,
            new Instance(this.core, array.network.uuid, array.network.name, "NTW")
        );
        this.price = array.price;

        if (array.perks != null) {
            this.perks = array.perks.map(perk => PerkContextualized.fromJSON(this.core, perk))
        } else {
            this.perks = new Array<PerkContextualized>();
        }

        return this;
    }

    public static fromJSON(core: Core, json: any): StoreItem {
        return new StoreItem(
            core,
            json.uuid,
            json.name,
            json.description,
            StoreCategory.fromJSON(core, json.category),
            Network.fromJSON(core, json.network),
            json.price,
            json.perks.map(perk => PerkContextualized.fromJSON(core, perk))
        );
    }
}
