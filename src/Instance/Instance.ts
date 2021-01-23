class Instance {

    public id: string;
    public name: string;
    public online: boolean;
    public type: CoreInstanceType;

    public constructor(id?: string, name?: string, type?: CoreInstanceType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public static fromObject(object: any): Instance {
        let ins = new Instance();
        ins.id = String(object.id);
        ins.name = String(object.name);
        ins.online = Boolean(object.online);
        ins.type = Number(object.type);
        return ins;
    }

    public async connect(): Promise<void> {
        return await new Call()
            .addParam(Param.Instance, this.id)
            .commit('instance/log/connection/').then(() => {
                return;
            })
    }

    public async disconnect(): Promise<void> {
        return await new Call()
            .addParam(Param.Instance, this.id)
            .commit('instance/log/disconnection').then(() => {
                return;
            })
    }

    public isOnline(): boolean {
        return this.online;
    }

    public asNetwork(): Network {
        return new Network(this.id, this.name, Game.Unknown, Platform.Unknown);
    }

    public getId(): string {
        return this.id;
    }

    public async delete(): Promise<void> {
        return await new Call()
            .addParam(Param.Instance, this.id)
            .commit('instance/delete').then(() => {
                return;
            })
    }

    public async getKeys(): Promise<Array<Key>> {
        return await new Call()
            .addParam(Param.Instance, this.id)
            .commit('instance/get/key/').then((keyData) => {
                let keys = new Array<Key>();
                for (let i = 0; i < keyData.length; i++) {
                    const element = keyData[i];
                    keys.push(Key.fromObject(element));
                }
                return keys;
            })
    }

}