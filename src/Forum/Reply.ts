class ForumReply extends Core {

    public core: Core;
    public uuid;
    public content;
    public player: Player;
    public network: Network;
    public replyingTo;

    public constructor(core: Core, uuid?: string, content?: string, player?: Player, network?: Network, replyingTo?: ForumCategory) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.content = content;
        this.player = player;
        this.network = network;
        this.replyingTo = replyingTo;
    }

    public fromArray(array): ForumReply {
        this.uuid = array.uuid;
        this.content = array.content;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        if ("title" in array.replyingTo) {
            this.replyingTo = new ForumPost(this.core).fromArray(array.replyingTo);
        } else {
            this.replyingTo = new ForumReply(this.core).fromArray(array.replyingTo);
        }
        return this;
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