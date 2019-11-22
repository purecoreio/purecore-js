class ConnectionHash extends Core {

    core: Core;
    network: Network;
    uuid: string;
    hash: string;
    player: Player;

    constructor(core: Core, network?: Network, uuid?: string, hash?: string, player?: Player) {
        super(core.getKey())
        this.core = core;
        this.network = network;
        this.uuid = uuid;
        this.hash = hash;
        this.player = player;
    }

    fromArray(array) {
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        return this;
    }

    getPlayer() {
        return this.player;
    }

    getHash() {
        return this.hash;
    }

    getNetwork() {
        return this.network;
    }

    async requestSession() {

        var key = this.core.getKey();
        var core = this.core;
        var hash = this.hash;
        
        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/session/hash/token/?key=" + key + "&hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var player = new Player(core, jsonresponse.player.coreid, jsonresponse.player.username, jsonresponse.player.uuid, jsonresponse.player.verified);
                        var instance = new Network(core, new Instance(core, jsonresponse.network.uuid, jsonresponse.network.name, "NTW"));
                        var sessionRequest = new SessionRequest(core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, instance, "player");
                        resolve(sessionRequest)
                    }
                }).catch(function (error) {
                    throw new Error(error)
                })
            } catch (e) {
                throw new Error(e.message)
            }
        });
    }

}