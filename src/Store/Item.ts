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

    public async addPerk(perk, quantity = 'undefined') {

        var core = this.core;
        let main = this;
        var url;

        var perkId = null;
        if (typeof perk == "string") {
            perkId = perk;
        } else {
            perkId = perk.uuid;
        }

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/item/add/perk/?hash=" + core.getCoreSession().getHash() + "&network=" + main.network.uuid + "&item=" + main.uuid + "&perk=" + perkId + "&quantity=" + quantity;
        } else {
            url = "https://api.purecore.io/rest/2/store/item/add/perk/?key=" + core.getKey() + "&network=" + main.network.uuid + "&item=" + main.uuid + "&perk=" + perkId + "&quantity=" + quantity;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new PerkContextualized(core).fromArray(jsonresponse);;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

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

        if (array.perks != null) {
            array.perks.forEach(perkJson => {
                this.perks.push(new PerkContextualized(this.core).fromArray(perkJson));
            });
        } else {
            this.perks = new Array<PerkContextualized>()
        }

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