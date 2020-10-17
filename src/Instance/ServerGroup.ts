class ServerGroup extends Core {

    public core: Core;
    public uuid: String;
    public network: Network;
    public name: String;

    public constructor(core: Core, uuid?: String, network?: Network, name?: String) {
        super(core.getTool(), core.dev);
        this.uuid = uuid;
        this.core = core;
        this.network = network;
        this.name = name;
    }

    public fromObject(object: any): ServerGroup {
        this.uuid = object.uuid;
        this.network = new Network(this.core).fromObject(object.network);
        this.name = object.name;
        return this;
    }

    public async delete(): Promise<boolean> {

        return new Call(this.core)
            .commit(
                {
                    group: this.uuid,
                },
                "instance/server/group/delete/"
            )
            .then(() => {
                return true;
            });
    }

}