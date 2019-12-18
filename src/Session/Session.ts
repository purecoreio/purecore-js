class Session extends Core {

    core: Core;
    uuid: string;
    hash: string;
    device: SessionDevice;
    location: SessionLocation;
    usage: SessionUsage;
    network: Network;
    player: Player;
    owner: Owner;

    constructor(core: Core, uuid?: string, hash?: string, device?: SessionDevice, location?: SessionLocation, usage?: SessionUsage, network?: Network, user?) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.hash = hash;
        this.device = device;
        this.location = location;
        this.usage = usage;
        this.network = network;

        if (user instanceof Player) {
            this.player = user;
        } else if (user instanceof Owner) {
            this.owner = user;
        }

    }

    getUser() {
        if (this.player == undefined && this.owner != undefined) {
            return this.owner;
        } else {
            return this.player;
        }
    }

    fromArray(array) {
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.device = new SessionDevice(array.device.brand, array.device.device, array.device.model, array.device.os);
        this.location = new SessionLocation(array.location.city, array.location.state, array.location.country_code);
        this.usage = new SessionUsage(array.usage.creation, array.usage.uses);

        if ("network" in array) {
            this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        }

        if ("player" in array) {
            this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        } else if ("owner" in array) {
            this.owner = new Owner(this.core, array.owner.uuid, array.owner.name, array.owner.surname, array.owner.email);
        }

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

    getNetworks() {

        var hash = this.hash;
        var core = this.core;

        return new Promise(function (resolve, reject) {

            try {

                return fetch("https://api.purecore.io/rest/2/instance/network/list/?hash=" + hash, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (response) {

                    if ("error" in response) {

                        throw new Error(response.error + ". " + response.msg)

                    } else {

                        var networks = [];

                        response.forEach(network => {
                            networks.push(new Network(core,new Instance(core,network.uuid,network.name,"NTW")))
                        });

                        resolve(networks)

                    }

                }).catch(function (error) {

                    throw error

                })
            } catch (e) {

                reject(e.message)

            }
        });

    }

}