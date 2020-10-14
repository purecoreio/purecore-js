class Server extends Core {

    public core: Core;
    public uuid: String;
    public network: Network;
    public name: String;
    public group: ServerGroup;

    constructor(core: Core, uuid?: string, network?: Network, name?: string, group?: ServerGroup) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.group = group;
    }

    public fromObject(object: any): Server {
        this.uuid = object.uuid;
        this.network = new Network(this.core).fromObject(object.network);
        this.name = object.name;
        if (object.group == null) {
            this.group = null;
        } else {
            this.group = new ServerGroup(this.core).fromObject(object.group);
        }
        return this;
    }

    public async addToGroup(group: ServerGroup | String): Promise<Server> {

        let main = this;
        let groupid = null;
        if (group instanceof ServerGroup) {
            groupid = String(group.uuid);
        } else {
            groupid = String(group);
        }

        return new Call(this.core)
            .commit(
                {
                    server: this.uuid,
                    group: groupid
                },
                "instance/server/add/to/group/"
            )
            .then((jsonresponse) => {
                main.group = new ServerGroup(main.core).fromObject(jsonresponse.group);
                return new Server(main.core).fromObject(jsonresponse);
            });
    }


}