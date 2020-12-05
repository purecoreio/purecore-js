class Owner {

    /*
    public constructor(id?: string, creation?: Date, username?: string, lastLogin?: Date, lastUpdated?: Date, bio?: string, birthdate?: Date) {
        super(id, creation, username, lastLogin, lastUpdated, bio, birthdate);
    }*/

    public async getNetworks(name: string, cname: string, game: Game, platform: Platform): Promise<Array<Network>> {
        return await new Call()
            .addParam(Param.Name, name)
            .addParam(Param.Cname, cname)
            .addParam(Param.Game, game)
            .addParam(Param.Platform, platform)
            .commit('network/list/').then((res) => {
                if (Array.isArray(res)) {
                    let networkList = new Array<Network>();
                    for (let i = 0; i < res.length; i++) {
                        networkList.push(Network.fromObject(res[i]));
                    }
                    return networkList;
                } else {
                    throw new Error("Invalid type");
                }
            })
    }

    public async createNetwork(name: string, cname: string, game: Game, platform: Platform): Promise<Network> {
        return await new Call()
            .addParam(Param.Name, name)
            .addParam(Param.Cname, cname)
            .addParam(Param.Game, game)
            .addParam(Param.Platform, platform)
            .commit('network/create/').then((res) => {
                return Network.fromObject(res);
            })
    }

}