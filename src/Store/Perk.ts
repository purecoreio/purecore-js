class Perk {

    uuid: string;
    network: Network;
    name: string;
    description: string;
    type: string;
    category: PerkCategory;

    constructor(uuid: string, network: Network, name: string, description: string, type: string, category: PerkCategory) {

        this.uuid=uuid;
        this.network=network;
        this.name=name;
        this.description=description;
        this.type=type;
        this.category=category;

    }
}