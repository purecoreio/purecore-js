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

}