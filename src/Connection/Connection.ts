class Connection extends Core {
    public core: Core;
    public player: Player;
    public instance: Instance;
    public location: ConnectionLocation;
    public status: ConnectionStatus;
    public uuid: string;

    public constructor(core: Core, player?: Player, instance?: Instance, location?: ConnectionLocation, status?: ConnectionStatus, uuid?: string) {
        super(core.getTool());
        this.core = core;
        this.player = player;
        this.instance = instance;
        this.location = location;
        this.status = status;
        this.uuid = uuid;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getInstance(): Instance {
        return this.instance;
    }

    public getLocation(): ConnectionLocation {
        return this.location;
    }

    public getStatus(): ConnectionStatus {
        return this.status;
    }

    public getId(): string {
        return this.uuid;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): Connection {
        this.player = Player.fromJSON(this.core, array.player);
        this.instance = Instance.fromJSON(this.core, array.instance);
        this.location = ConnectionLocation.fromJSON(array.location);
        this.status = ConnectionStatus.fromJSON(array.status);
        this.uuid = array.uuid;
        return this;
    }

    public static fromJSON(core: Core, json: any): Connection {
        return new Connection(
            core,
            Player.fromJSON(core, json.player),
            Instance.fromJSON(core, json.instance),
            ConnectionLocation.fromJSON(json.location),
            ConnectionStatus.fromJSON(json.status)
        );
    }
}
