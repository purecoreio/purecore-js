class Session extends Core {

    core: Core;
    uuid: string;
    hash: string;
    device: SessionDevice;
    location: SessionLocation;
    usage: SessionUsage;
    network: Network;
    player: Player;

    constructor(core: Core, uuid?: string, hash?: string, device?: SessionDevice, location?: SessionLocation, usage?: SessionUsage, network?: Network, player?: Player) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.hash = hash;
        this.device = device;
        this.location = location;
        this.usage = usage;
        this.network = network;
        this.player = player;
    }

    fromArray(array) {

        this.uuid = array.uuid;
        this.hash = array.hash;
        this.device = new SessionDevice(array.device.brand, array.device.device, array.device.model, array.device.os);
        this.location = new SessionLocation(array.location.city, array.location.state, array.location.country_code);
        this.usage = new SessionUsage(array.usage.creation, array.usage.uses);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);

        return this;

    }

    fromHash(sessionHash) {

        var key = this.core.getKey();
        var core = this.core;
        var hash = sessionHash;

        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/session/get/?key=" + key + "&hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {
                        var newSession = new Session(core);
                        newSession = newSession.fromArray(jsonresponse);
                        resolve(newSession)
                    }
                })
            } catch (e) {
                reject(new Error(e.message));
            }
        });

    }

    getId() {
        return this.uuid;
    }

    getHash() {
        return this.hash;
    }

    getPlayer() {
        return this.player;
    }
}