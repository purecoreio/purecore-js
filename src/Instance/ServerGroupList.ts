class ServerGroupList {

    private id: string;
    private name: string;
    private network: Network;
    private servers: Array<Server>;

    public constructor(id?: string, name?: string, network?: Network, servers?: Array<Server>) {
        this.id = id;
        this.name = name;
        this.network = network;
        this.servers = servers;
    }

    public static fromObject(object: any): ServerGroupList {
        let sg = new ServerGroupList();
        sg.id = (object.id == null ? null : String(object.id));
        sg.name = (object.name == null ? null : String(object.name));
        sg.network = null;
        if ('network' in object && object.network != null) {
            sg.network = Network.fromObject(object.network);
        }
        sg.servers = new Array<Server>();
        if ('servers' in object && object.servers != null && Array.isArray(object.servers)) {
            for (let i = 0; i < object.servers.length; i++) {
                sg.servers.push(Server.fromObject(object.servers[i]))
            }
        }
        return sg;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getServers(): Array<Server> {
        return this.servers;
    }

    public asServerGroup(): ServerGroup {
        return new ServerGroup(this.id, this.network, this.name);
    }


}