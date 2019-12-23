class StoreCategory extends Core {

    core: Core;
    uuid: string;
    name: string;
    description: string;
    network: Network;
    upgradable: boolean;

    constructor(core: Core, uuid?: string, name?: string, description?: string, network?: Network, upgradable?: boolean) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }

    fromArray(array): StoreCategory {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.upgradable = array.upgradable;
        return this;
    }

    getId() {
        return this.uuid;
    }

}