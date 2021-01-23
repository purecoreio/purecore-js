class ServerGroup {

    private id: string;
    private network: Network;
    private name: string;

    public constructor(id?: string, network?: Network, name?: string) {
        this.id = id;
        this.network = network;
        this.name = name;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public static fromObject(object: any): ServerGroup {
        let sg = new ServerGroup();
        sg.id = (object.id == null ? null : String(object.id));
        sg.network = null;
        if ('network' in object && object.network != null) {
            sg.network = Network.fromObject(object.network);
        }
        sg.name = (object.name == null ? null : String(object.name));
        return sg;
    }

    public async delete(): Promise<void> {
        return await new Call()
            .addParam(Param.ServerGroup, this.id)
            .commit('instance/group/delete').then(() => {
                return;
            })
    }

}