class Server {

    private network: Network;
    private id: string;
    private name: string;
    private group: ServerGroup;

    public constructor(network?: Network, id?: string, name?: string, group?: ServerGroup) {
        this.network = network;
        this.id = id;
        this.name = name;
        this.group = group;
    }

    public static fromObject(object?: any): Server {
        let ser = new Server();
        ser.id = String(object.id);
        ser.name = String(object.name);
        ser.group = null;
        if ('group' in object && object.group != null) {
            ser.group = ServerGroup.fromObject(object.group);
        }
        return ser;
    }

    public asInstance(): Instance {
        return new Instance(this.id, this.name, CoreInstanceType.Server);
    }

    public getGroup(): ServerGroup {
        return this.group;
    }

    public async setGroup(group: ServerGroup): Promise<Server> {
        return await new Call()
            .addParam(Param.Server, this.id)
            .addParam(Param.ServerGroup, group.getId())
            .commit('instance/group/set').then((res) => {
                let server = Server.fromObject(res);
                this.group = server.getGroup();
                return server;
            })
    }

    public async ungroup(): Promise<Server> {
        return await new Call()
            .addParam(Param.Server, this.id)
            .commit('instance/group/unset').then((res) => {
                let server = Server.fromObject(res);
                this.group = server.getGroup();
                return server;
            })
    }


}