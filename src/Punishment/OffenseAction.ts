class OffenceAction extends Core {
    public core: Core;
    public uuid: string;
    public cmd: Command;
    public requiredPoints: number;
    public network: Network;
    public pointsType: PointType;
    public punishmentType: string; //TODO: enum
    public name: string;
    public description: string;

    constructor(core: Core, uuid?: string, cmd?: Command, requiredPoints?, network?: Network, pointsType?: PointType, punishmentType?: string, name?: string, description?: string) {
        super(core.getTool());
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

    public getId(): string {
        return this.uuid;
    }

    public getCommand(): Command {
        return this.cmd;
    }

    public getRequiredPoints(): number {
        return this.requiredPoints;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getPointsType(): PointType {
        return this.pointsType;
    }

    public getPunishmentType(): string {
        return this.punishmentType;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array) {
        this.uuid = array.uuid;
        this.network = Network.fromJSON(this.core, array.network);
        this.cmd = new Command(array.cmd.cmdId, array.cmd.cmdString, this.network);
        this.requiredPoints = parseInt(array.requiredPoints);
        this.pointsType = array.pointsType;
        this.punishmentType = array.punishmentType;
        this.name = array.name;
        this.description = array.description;

        return this;
    }

    public static fromJSON(core: Core, json: any): OffenceAction {
        const network: Network = Network.fromJSON(core, json.network);

        return new OffenceAction(
            core,
            json.uuid,
            Command.fromJSON(network, json.cmd),
            parseInt(json.requiredPoints),
            network,
            json.pointsType,
            json.punishmentType,
            json.name,
            json.description
        );
    }
}
