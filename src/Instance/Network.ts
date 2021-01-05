class Network {

    private id: string;
    private name: string;
    private game: Game;
    private platform: Platform;

    public constructor(id?: string, name?: string, game?: Game, platform?: Platform) {
        this.id = id;
        this.name = name;
        this.game = game;
        this.platform = platform;
    }

    public asStore(): Store {
        return new Store(this.id, this.name, this.game, this.platform);
    }

    public getId(): string {
        return this.id;
    }

    public asObject(): any {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }

    public static fromObject(object: any): Network {
        let net = new Network();
        net.name = String(object.name);
        net.id = String(object.id);
        net.game = Number(object.game);
        net.platform = Number(object.platform);
        return net;
    }

    public asInstance(): Instance {
        return new Instance(this.id, this.name, CoreInstanceType.Network);
    }

    public async getMonthRevenue(month: number = null, year: number = null): Promise<MultipleAnalytics> {
        let call = new Call();
        call.addParam(Param.Network, this.id)
        if (month != null && year != null) {
            call.addParam(Param.Month, month)
            call.addParam(Param.Year, year)
        }
        return call.commit('analytics/revenue/month').then((res) => {
            return MultipleAnalytics.fromObject(res, AnalyticType.Revenue);
        })
    }

    public async getServers(): Promise<Array<ServerGroupList>> {
        return await new Call()
            .addParam(Param.Network, this.id)
            .commit('instance/group/list').then((res) => {
                let lists = new Array<ServerGroupList>();
                if (Array.isArray(res)) {
                    for (let i = 0; i < res.length; i++) {
                        const groupData = res[i];
                        lists.push(ServerGroupList.fromObject(groupData));
                    }
                    return lists;
                } else {
                    throw new Error("Invalid result");

                }
            })
    }

    public async createServer(name: String): Promise<Server> {
        return await new Call()
            .addParam(Param.Network, this.id)
            .addParam(Param.Name, name)
            .commit('instance/create').then((res) => {
                return Server.fromObject(res);
            })
    }

    public async createServerGroup(name: String): Promise<ServerGroup> {
        return await new Call()
            .addParam(Param.Network, this.id)
            .addParam(Param.Name, name)
            .commit('instance/group/create').then((res) => {
                return ServerGroup.fromObject(res);
            })
    }

    public async delete(confirmation: boolean): Promise<void> {
        if (confirmation) {
            return await new Call()
                .addParam(Param.Instance, this.id)
                .commit('instance/delete').then(() => {
                    return;
                })
        } else {
            return new Promise((resolve, reject) => {
                reject(new Error("missing confirmation"))
            });
        }
    }

}