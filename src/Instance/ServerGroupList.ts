class ServerGroupList extends Core {

    public core: Core;
    public uuid: String;
    public network: Network;
    public name: String;
    public servers: Array<Server>;

    public constructor(core: Core, uuid?: String, network?: Network, name?: String, servers?: Array<Server>) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.servers = servers;
    }

    public fromObject(object: any): ServerGroupList {
        this.uuid = object.uuid;
        this.network = new Network(this.core).fromObject(object.network);
        this.name = object.name;
        this.servers = new Array<Server>();
        object.servers.forEach(serverObj => {
            this.servers.push(new Server(this.core).fromObject(serverObj))
        });
        return this;
    }

    public asServerGroup(): ServerGroup {
        return new ServerGroup(this.core, this.uuid, this.network, this.name);
    }

}