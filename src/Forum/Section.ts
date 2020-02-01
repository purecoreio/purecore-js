class ForumSection extends Core {

    public core: Core;
    public uuid;
    public name;
    public description;
    public network: Network;

    public constructor(core: Core, uuid?: string, name?: string, description?: string, network?: Network) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
    }

    public getCategories() {

        var secid = this.uuid;
        var core = this.network.core;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/category/list/?hash=" + core.getCoreSession().getHash() + "&section=" + secid;
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/category/list/?key=" + core.getKey() + "&section=" + secid;
        } else {
            url = "https://api.purecore.io/rest/2/forum/get/category/list/?section=" + secid;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        var finalResponse = new Array<ForumCategory>();
                        jsonresponse.forEach(categoryJSON => {
                            finalResponse.push(new ForumCategory(core).fromArray(categoryJSON));
                        });

                        resolve(finalResponse);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

    public fromArray(array): ForumSection {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        return this;
    }

    public createCategory(name, description) {

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/category/?hash=" + core.getCoreSession().getHash() + "&section=" + this.uuid + "&name=" + name + "&description=" + description;
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/create/category/?key=" + core.getKey() + "&section=" + this.uuid + "&name=" + name + "&description=" + description;;
        } else {
            url = "https://api.purecore.io/rest/2/forum/create/category/?section=" + this.uuid + "&name=" + name + "&description=" + description;;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        resolve(new ForumCategory(core).fromArray(jsonresponse));

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

}