class PerkCategory extends Core {


    core: Core;
    uuid: string;
    name: string;
    network: Network;


    constructor(core: Core, uuid?: string, name?: string, network?: Network) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }

    fromArray(array): PerkCategory {

        this.uuid = array.uuid;
        this.name = array.name;
        try {
            this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        } catch (error) {
            this.network = null;
        }

        return this;

    }

}