class Offence extends Core {

    public core: Core;
    public uuid: string;
    public type: string;
    public network: Network;
    public name: string;
    public description: string;
    public negativePoints;

    constructor(core?: Core, uuid?: string, type?: string, network?: Network, name?: string, description?: string, negativePoints?) {
        super(core.getKey())
        this.core = core;
        this.uuid = uuid;
        this.type = type;
        this.network = network;
        this.name = name;
        this.description = description;
        this.negativePoints = negativePoints;
    }
}