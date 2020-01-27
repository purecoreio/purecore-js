class StoreItem extends Core {

    core: Core;
    uuid: string;
    name: string;
    description: string;
    category: StoreCategory;
    network: Network;
    price;
    perks: Array<PerkContextualized>;

    constructor(core: Core, uuid?: string, name?: string, description?: string, category?: StoreCategory, network?: Network, price?, contextualizedPerks?: Array<PerkContextualized>) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = new Array<PerkContextualized>();
    }

    getId() {
        return this.uuid;
    }

    fromArray(array): StoreItem {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.category = new StoreCategory(this.core).fromArray(array.category);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.price = array.price;

        array.perks.forEach(perkJson => {
            this.perks.push(new PerkContextualized(this.core).fromArray(perkJson));
        });

        return this;
    }

    getOrganizedPerks(): Array<OrganizedPerkCategory> {

        var perkOrganized = [];
        this.perks.forEach(perk => {
            if (perk.perk.category.uuid in perkOrganized) {
                perkOrganized[perk.perk.category.uuid].push(perk)
            } else {
                perkOrganized[perk.perk.category.uuid] = new Array<PerkContextualized>();
                perkOrganized[perk.perk.category.uuid].push(perk)
            }
        });

        var organizedPerkCategories = new Array<OrganizedPerkCategory>();

        for (const key in perkOrganized) {

            var category = null;
            perkOrganized[key].forEach(conperk => {
                if (conperk.perk.category.uuid == key) {
                    category = conperk.perk.category;
                }
            });

            var organizedCat = new OrganizedPerkCategory(category, perkOrganized[key])
            organizedPerkCategories.push(organizedCat);
        }

        return organizedPerkCategories;

    }

}