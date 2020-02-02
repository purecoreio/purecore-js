class ForumCategory extends Core {

    public core: Core;
    public uuid;
    public name;
    public description;
    public network: Network;
    public section: ForumSection;

    public constructor(core: Core, uuid?: string, name?: string, description?: string, network?: Network, section?: ForumSection) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.section = section;
    }

    public fromArray(array): ForumCategory {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.section = new ForumSection(this.core).fromArray(array.section);
        return this;
    }

    public getPosts(page = 0) {

        if (page == null || page == undefined) {
            page = 0;
        }

        var catid = this.uuid;
        var core = this.network.core;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/post/list/?hash=" + core.getCoreSession().getHash() + "&category=" + catid + "&page=" + page;
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/post/list/?key=" + core.getKey() + "&category=" + catid + "&page=" + page;
        } else {
            url = "https://api.purecore.io/rest/2/forum/get/post/list/?category=" + catid + "&page=" + page;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        var finalResponse = new Array<ForumPost>();
                        jsonresponse.forEach(postJSON => {
                            finalResponse.push(new ForumPost(core).fromArray(postJSON));
                        });

                        resolve(finalResponse);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

    public createPost(title, content) {

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {

            var player = this.core.getCoreSession().getPlayer();
            var playerid = player.getId();

            url = "https://api.purecore.io/rest/2/forum/create/post/?hash=" + core.getCoreSession().getHash() + "&category=" + this.uuid + "&title=" + title + "&player=" + playerid + "&content=" + escape(content);
        } else {
            throw new Error("You're not logged in");
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        resolve(new ForumPost(core).fromArray(jsonresponse));

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

}