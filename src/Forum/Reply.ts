class ForumReply extends Core {
    public core: Core;
    public uuid: string;
    public content: string;
    public player: Player;
    public network: Network;
    public replyingTo: ForumPost | ForumReply;

    public constructor(core: Core, uuid?: string, content?: string, player?: Player, network?: Network, replyingTo?: ForumPost | ForumReply) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.content = content;
        this.player = player;
        this.network = network;
        this.replyingTo = replyingTo;
    }

    public async createReply(content): Promise<ForumReply> {
        return new Call(this.core)
            .commit(
                {
                    object: this.uuid,
                    content: escape(content),
                },
                "forum/create/reply/"
            )
            .then(json => ForumReply.fromJSON(this.core, json));
    }

    public async getReplies(page?: number): Promise<Array<ForumReply>> {
        if (page == undefined) page = 0;

        return new Call(this.core)
            .commit(
                {
                    object: this.uuid,
                    page: page.toString(),
                },
                "forum/get/reply/list/"
            )
            .then(json => json.map(reply => ForumReply.fromJSON(this.core, reply)));
    }

    public getId(): string {
        return this.uuid;
    }

    public getContent(): string {
        return this.content;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getReplyingTo(): ForumPost | ForumReply {
        return this.replyingTo;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): ForumReply {
        this.uuid = array.uuid;
        this.content = array.content;
        this.player = Player.fromJSON(this.core, array.player);
        this.network = Network.fromJSON(this.core, array.network);
        this.replyingTo = "title" in array.responseTo ? ForumPost.fromJSON(this.core, array.responseTo) :
            ForumReply.fromJSON(this.core, array.responseTo)

        return this;
    }

    public static fromJSON(core: Core, json: any): ForumReply {
        return new ForumReply(
            core,
            json.uuid,
            json.content,
            Player.fromJSON(core, json.player),
            Network.fromJSON(core, json.network),
            "title" in json.responseTo ? ForumPost.fromJSON(core, json.responseTo) :
                ForumReply.fromJSON(core, json.responseTo)
        );
    }
}
