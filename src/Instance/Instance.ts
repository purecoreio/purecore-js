class Instance extends Core {

    core: Core;
    uuid: string;
    name: string;
    type: string;

    constructor(core: Core, uuid: string, name: string, type: string) {
        super(core.getTool())
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.type = type;
    }

    public getKeys() {

        var core = this.core;
        var instance = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/key/list/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId();
        } else {
            url = "https://api.purecore.io/rest/2/instance/key/list/?key=" + core.getKey() + "&instance=" + instance.getId();
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error)
                    } else {

                        var keyList = new Array<Key>();
                        jsonresponse.forEach(jsonKey => {
                            keyList.push(new Key(core).fromArray(jsonKey))
                        });

                        resolve(keyList);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.uuid;
    }

    asNetwork(): Network {
        return new Network(this.core, this)
    }

    update() {

        var core = this.core;
        var instance = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/info/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId();
        } else {
            url = "https://api.purecore.io/rest/2/instance/info/?key=" + core.getKey() + "&instance=" + instance.getId();
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        if (jsonresponse.server == null) {
                            instance.type = "NTW";
                            instance.uuid = jsonresponse.network.uuid;
                            instance.name = jsonresponse.network.name;
                        } else {
                            instance.type = "SVR";
                            instance.uuid = jsonresponse.server.uuid;
                            instance.name = jsonresponse.server.name;
                        }

                        resolve(instance);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

}