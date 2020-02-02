class ForumPost extends Core {

    public core: Core;
    public uuid;
    public title;
    public content;
    public player: Player;
    public open: boolean;
    public network: Network;
    public category: ForumCategory;

    public constructor(core: Core, uuid?: string, title?: string, content?: string, player?: Player, open?: boolean, network?: Network, category?: ForumCategory) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.title = title;
        this.content = content;
        this.player = player;
        this.open = open;
        this.network = network;
        this.category = category;
    }

    public fromArray(array): ForumPost {
        this.uuid = array.uuid;
        this.title = array.title;
        this.content = array.content;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.open = array.open;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.category = new ForumCategory(this.core).fromArray(array.category);
        return this;
    }

    public createReply(content) {

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/reply/?hash=" + core.getCoreSession().getHash() + "&object=" + this.uuid + "&content=" + escape(content);
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

                        resolve(new ForumReply(core).fromArray(jsonresponse));

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    public getReplies(page = 0) {

        if (page == null || page == undefined) {
            page = 0;
        }

        var objid = this.uuid;
        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?hash=" + core.getCoreSession().getHash() + "&object=" + objid + "&page=" + page;
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?key=" + core.getKey() + "&object=" + objid + "&page=" + page;
        } else {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?object=" + objid + "&page=" + page;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        var finalResponse = new Array<ForumReply>();
                        jsonresponse.forEach(replyJSON => {
                            finalResponse.push(new ForumReply(core).fromArray(replyJSON));
                        });

                        resolve(finalResponse);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

}