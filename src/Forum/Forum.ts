class Forum {

    public network: Network;

    public constructor(network: Network) {
        this.network = network;
    }

    public createSection(name, description) {

        var core = this.network.core;
        var network = this.network;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/section/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId() + "&name=" + name + "&description=" + description;
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/create/section/?key=" + core.getKey() + "&name=" + name + "&description=" + description;;
        } else {
            url = "https://api.purecore.io/rest/2/forum/create/section/?network=" + network.getId() + "&name=" + name + "&description=" + description;;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        resolve(new ForumSection(core).fromArray(jsonresponse));

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

}