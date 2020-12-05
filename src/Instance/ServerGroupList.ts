class ServerGroupList {

    private id: String;
    private name: String;
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
        sg.id = String(object.id);
        sg.name = String(object.name);
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


}