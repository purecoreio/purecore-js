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

    public fromArray(array): Connection {

        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        this.location = new ConnectionLocation().fromArray(array.location);
        this.status = new ConnectionStatus().fromArray(array.status);
        this.uuid = array.uuid;
        return this;

    }

}