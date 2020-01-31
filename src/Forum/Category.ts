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


    public createPost(title, content, player: Player) {

        var core = this.core;
        var playerid = player.getId();
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/post/?hash=" + core.getCoreSession().getHash() + "&category=" + this.uuid + "&title=" + title + "&player=" + playerid + "&content=" + escape(content);
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/create/post/?key=" + core.getKey() + "&category=" + this.uuid + "&title=" + title + "&player=" + playerid + "&content=" + escape(content);;
        } else {
            url = "https://api.purecore.io/rest/2/forum/create/post/?category=" + this.uuid + "&title=" + title + "&player=" + playerid + "&content=" + escape(content);;
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