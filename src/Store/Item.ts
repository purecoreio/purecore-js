class StoreItem {

    uuid: string;
    name: string;
    description: string;
    category: StoreCategory;
    network: Network;
    price;
    perks: Array<PerkContextualized>;

    constructor(uuid: string, name: string, description: string, category: StoreCategory, network: Network, price, contextualizedPerks: Array<PerkContextualized>) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = contextualizedPerks;
    }

    getId() {
        return this.uuid;
    }

}