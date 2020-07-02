class ForumCategory extends Core {
    public core: Core;
    public uuid: string;
    public name: string;
    public description: string;
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

    public async getPosts(page?: number): Promise<Array<ForumPost>> {
        if (page == undefined) page = 0;

        return new Call(this.core)
            .commit(
                {
                    category: this.uuid,
                    page: page.toString(),
                },
                "forum/get/post/list/"
            )
            .then(json => json.map(post => ForumPost.fromJSON(this.core, post)));
    }

    public async createPost(title, content): Promise<ForumPost> {
        return new Call(this.core)
            .commit(
                {
                    category: this.uuid,
                    title: title,
                    content: escape(content),
                },
                "forum/create/post/"
            )
            .then(json => ForumPost.fromJSON(this.core, json));
    }

    public getId(): string {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getSelection(): ForumSection {
        return this.section;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): ForumCategory {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = Network.fromJSON(this.core, array.network);
        this.section = ForumSection.fromJSON(this.core, array.session);
        return this;
    }

    public static fromJSON(core: Core, json: any) {
        return new ForumCategory(
            core,
            json.uuid,
            json.name,
            json.description,
            Network.fromJSON(core, json.network),
            ForumSection.fromJSON(core, json.session)
        );
    }
}
