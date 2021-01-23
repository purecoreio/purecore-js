/// <reference path="Player.ts"/>
class Owner extends Player {

    public constructor(id?: string, creation?: Date, username?: string, lastLogin?: Date, lastUpdated?: Date, bio?: string, birthdate?: Date) {
        super(id, creation, username, lastLogin, lastUpdated, bio, birthdate);
    }

    public asObject(): any {
        let obj = JSON.parse(JSON.stringify(this));
        obj.lastUpdated = Util.epoch(this.getLastUpdated())
        obj.lastLogin = Util.epoch(this.getLastLogin())
        obj.birthdate = Util.epoch(this.getBirthdate())
        obj.creation = Util.epoch(this.getCreation())
        return obj;
    }

    public async getNetworks(): Promise<Array<Network>> {
        return await new Call()
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
        game = Util.gameVal(game);
        platform = Util.platformVal(platform);
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