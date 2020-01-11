class Owner extends Core {

    core: Core;
    id: string;
    name: string;
    surname: string;
    email: string;

    constructor(core: Core, id: string, name: string, surname: string, email: string) {
        super(core.getTool())
        this.core = core;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    getName() {
        return this.name;
    }

    getSurname(){
        return this.surname;
    }

    getEmail(){
        return this.email;
    }

    getId() {
        return this.id;
    }

    getSession() {
        return this.core.getTool()
    }

    createNetwork(name: string, game: string, cname: string, ip?: string, port?) {
        if (this.core.getTool() instanceof Session) {

            var core = this.core;
            var url;

            if (ip == null) {
                url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname;
            } else {
                if (port == null) {
                    url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname + "&ip=" + ip;
                } else {
                    url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname + "&ip=" + ip + "&port=" + port;
                }
            }

            return new Promise(function (resolve, reject) {

                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                        } else {

                            var network = new Network(core, new Instance(core, jsonresponse.uuid, jsonresponse.name, "NTW"));
                            resolve(network);

                        }
                    });
                } catch (e) {
                    reject(e);
                }

            });

        } else {
            throw new Error("Invalid tool type, got: "+core.getTool())
        }
    }

}