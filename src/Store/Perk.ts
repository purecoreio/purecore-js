class Perk extends Core {

    core: Core;
    uuid: string;
    network: Network;
    name: string;
    description: string;
    type: string;
    category: PerkCategory;

    constructor(core: Core, uuid?: string, network?: Network, name?: string, description?: string, type?: string, category?: PerkCategory) {

        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;

    }

    fromArray(array): Perk {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = new PerkCategory(this.core).fromArray(array.category);
        return this;
    }
}