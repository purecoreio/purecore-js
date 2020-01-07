class Player extends Core {

    core: Core;
    id: string;
    username: string;
    uuid: string;
    verified;

    constructor(core: Core, id: string, username: string, uuid: string, verified) {
        super(core.getKey())
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }

    getConnections(instance: Instance, page?) {

        var id = this.id;
        var core = this.core;
        var queryPage = 0;

        if (page != undefined || page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/connection/list/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player="+id;
        } else {
            url = "https://api.purecore.io/rest/2/player/connection/list/?key=" + core.getKey() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player="+id;;
        }

        console.log(url)

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        console.log(jsonresponse);
                        var connections = new Array<Connection>();

                        jsonresponse.forEach(connectionJson => {

                            connections.push(new Connection(core).fromArray(connectionJson));

                        });

                        resolve(connections);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getId() {
        return this.id;
    }

    getUuid() {
        return this.uuid;
    }

    getUsername() {
        return this.username;
    }

}