class Offence extends Core {

    public core: Core;
    public uuid: string;
    public type: string;
    public network: Network;
    public name: string;
    public description: string;
    public negativePoints;

    constructor(core: Core, uuid?: string, type?: string, network?: Network, name?: string, description?: string, negativePoints?) {
        super(core.getTool())
        this.core = core;
        this.uuid = uuid;
        this.type = type;
        this.network = network;
        this.name = name;
        this.description = description;
        this.negativePoints = negativePoints;
    }

    public fromArray(array) {
        this.uuid = array.uuid;
        this.type = array.type;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"))
        this.name = array.name;
        this.description = array.description;
        this.negativePoints = parseInt(array.negativePoints);

        return this;
    }

    public getType() {
        return this.type;
    }

    public getName() {
        return this.name;
    }

    public getDescription() {
        return this.description;
    }

    public getNegativePoints() {
        return this.negativePoints;
    }
}