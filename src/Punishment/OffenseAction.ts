class OffenceAction extends Core {

    public core: Core;
    public uuid: string;
    public cmd: Command;
    public requiredPoints;
    public network: Network;
    public pointsType: string;
    public punishmentType: string;
    public name: string;
    public description: string;

    constructor(core: Core, uuid?: string, cmd?: Command, requiredPoints?, network?: Network, pointsType?: string, punishmentType?: string, name?: string, description?: string) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.cmd = cmd;
        this.requiredPoints = requiredPoints;
        this.network = network;
        this.pointsType = pointsType;
        this.punishmentType = punishmentType;
        this.name = name;
        this.description = description;
    }

    public fromArray(array) {

        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"))
        this.cmd = new Command(array.cmd.cmdId, array.cmd.cmdString, this.network)
        this.requiredPoints = parseInt(array.requiredPoints);
        this.pointsType = array.pointsType;
        this.punishmentType = array.punishmentType;
        this.name = array.name;
        this.description = array.description;

        return this;

    }
}