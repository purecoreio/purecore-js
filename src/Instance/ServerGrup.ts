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

    public static fromObject(object: any): ServerGroup {
        let sg = new ServerGroup();
        sg.id = String(object.id);
        sg.network = null;
        if ('network' in object && object.network != null) {
            sg.network = Network.fromObject(object.network);
        }
        sg.name = String(object.name);
        return sg;
    }

    public async delete(): Promise<void> {
        return await new Call()
            .addParam(Param.Instance, this.id)
            .commit('instance/group/delete').then(() => {
                return;
            })
    }

}