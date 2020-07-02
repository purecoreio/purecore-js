class ForumSection extends Core {
    public core: Core;
    public uuid: string;
    public name: string;
    public description: string;
    public network: Network;

    public constructor(core: Core, uuid?: string, name?: string, description?: string, network?: Network) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
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

    public async getCategories(): Promise<Array<ForumCategory>> {
        return new Call(this.core)
            .commit({section: this.uuid}, "forum/get/category/list/")
            .then(json => json.map(category => ForumCategory.fromJSON(this.core, category)));
    }

    public async createCategory(name: string, description: string): Promise<ForumCategory> {
        return new Call(this.core)
            .commit(
                {
                    section: this.uuid,
                    name: name,
                    description: description,
                },
                "forum/create/category/"
            )
            .then(json => ForumCategory.fromJSON(this.core, json));
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): ForumSection {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = Network.fromJSON(this.core, array.network);
        return this;
    }

    public static fromJSON(core: Core, json: any): ForumSection {
        return new ForumSection(
            core,
            json.uuid,
            json.name,
            json.description,
            Network.fromJSON(core, json.network)
        );
    }
}
