class Instance {

    private id: string;
    private name: string;
    private type: CoreInstanceType;

    public constructor(id?: string, name?: string, type?: CoreInstanceType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public static fromObject(object: any): Instance {
        let ins = new Instance();
        ins.id = String(object.id);
        ins.name = String(object.name);
        ins.type = Number(object.type);
        return ins;
    }

    public asNetwork(): Network {
        return new Network(this.id, this.name, Game.Unknown, Platform.Unknown);
    }

    public async delete(): Promise<void> {
        return await new Call()
            .addParam(Param.Instance, this.id)
            .commit('instance/delete').then(() => {
                return;
            })
    }

}