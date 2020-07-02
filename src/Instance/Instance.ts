class Instance extends Core {
    public core: Core;
    public uuid: string;
    public name: string;
    public type: CoreInstanceType;

    public constructor(core: Core, uuid: string, name: string, type: CoreInstanceType) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.type = type;
    }

    public async closeOpenConnections(): Promise<Array<Connection>> {
        return new Call(this.core)
            .commit({instance: this.uuid}, "instance/connections/close/all/")
            .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
    }

    public async getOpenConnections(): Promise<Array<Connection>> {
        return new Call(this.core)
            .commit({instance: this.uuid}, "instance/connections/open/list/")
            .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
    }

    public async getGrowthAnalytics(span = 3600 * 24): Promise<Array<GrowthAnalytic>> {
        return new Call(this.core)
            .commit(
                {
                    instance: this.uuid,
                    span: span,
                },
                "instance/growth/analytics/"
            )
            .then(json => json.map(growthAnalytic => new GrowthAnalytic().fromArray(growthAnalytic)));
    }

    public async delete(): Promise<boolean> {
        return new Call(this.core)
            .commit({instance: this.uuid}, "instance/delete/")
            .then(() => true); //TODO: process return
    }

    public async getKeys(): Promise<Array<Key>> {
        return new Call(this.core)
            .commit({instance: this.uuid}, "instance/key/list/")
            .then(json => json.map(key => Key.fromJSON(this.core, key)));
    }

    public getName(): string {
        return this.name;
    }

    public getId(): string {
        return this.uuid;
    }

    public getType(): CoreInstanceType {
        return this.type;
    }

    public asNetwork(): Network {
        return new Network(this.core, this);
    }

    public async update(): Promise<Instance> {
        return new Call(this.core)
            .commit({instance: this.uuid}, "instance/info/")
            .then(json => {
                if (json.server == null) {
                    this.type = "NTW";
                    this.uuid = json.network.uuid;
                    this.name = json.network.name;
                } else {
                    this.type = "SVR";
                    this.uuid = json.server.uuid;
                    this.name = json.server.name;
                }
                return this;
            });
    }

    public static fromJSON(core: Core, json: any, type?: CoreInstanceType): Instance {
        return new Instance(
            core,
            json.uuid,
            json.name,
            type == undefined ? "UNK" : type //TODO: check api calls for json.type
        );
    }
}
