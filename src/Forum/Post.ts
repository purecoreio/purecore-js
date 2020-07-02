class ForumPost extends Core {
    public core: Core;
    public uuid: string;
    public title: string;
    public content: string;
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

    public async getReplies(page = 0): Promise<Array<ForumReply>> {
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

    public getTitle(): string {
        return this.title;
    }

    public getContent(): string {
        return this.content;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public isOpen(): boolean {
        return this.open;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getCategory(): ForumCategory {
        return this.category;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): ForumPost {
        this.uuid = array.uuid;
        this.title = array.title;
        this.content = array.content;
        this.player = Player.fromJSON(this.core, array.player);
        this.open = array.open;
        this.network = Network.fromJSON(this.core, array.network);
        this.category = ForumCategory.fromJSON(this.core, array.category);
        return this;
    }

    public static fromJSON(core: Core, json: any) {
        return new ForumPost(
            core,
            json.uuid,
            json.title,
            json.content,
            Player.fromJSON(core, json.player),
            json.open,
            Network.fromJSON(core, json.network),
            ForumCategory.fromJSON(core, json.category)
        );
    }
}
