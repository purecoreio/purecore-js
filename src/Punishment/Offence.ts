class Offence extends Core {
    public core: Core;
    public uuid: string;
    public type: string;
    public network: Network;
    public name: string;
    public description: string;
    public negativePoints: number;

    public constructor(core: Core, uuid?: string, type?: string, network?: Network, name?: string, description?: string, negativePoints?: number) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.type = type;
        this.network = network;
        this.name = name;
        this.description = description;
        this.negativePoints = negativePoints;
    }

    public getType(): string {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getNegativePoints(): number {
        return this.negativePoints;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array) {
        this.uuid = array.uuid;
        this.type = array.type;
        this.network = Network.fromJSON(this.core, array.network);
        this.name = array.name;
        this.description = array.description;
        this.negativePoints = parseInt(array.negativePoints);

        return this;
    }

    public static fromJSON(core: Core, json: any): Offence {
        return new Offence(
            core,
            json.uuid,
            json.type,
            Network.fromJSON(core, json.network),
            json.name,
            json.description,
            parseInt(json.negativePoints)
        );
    }
}
