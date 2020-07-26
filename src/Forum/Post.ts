class ForumPost extends Core {
  public core: Core;
  public uuid;
  public title;
  public content;
  public player: Player;
  public open: boolean;
  public network: Network;
  public category: ForumCategory;

  public constructor(
    core: Core,
    uuid?: string,
    title?: string,
    content?: string,
    player?: Player,
    open?: boolean,
    network?: Network,
    category?: ForumCategory
  ) {
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

  public fromObject(array): ForumPost {
    this.uuid = array.uuid;
    this.title = array.title;
    this.content = array.content;
    this.player = new Player(
      this.core,
      array.player.coreid,
      array.player.username,
      array.player.uuid,
      array.player.verified
    );
    this.open = array.open;
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.category = new ForumCategory(this.core).fromObject(array.category);
    return this;
  }

  public async createReply(content): Promise<ForumReply> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          object: this.uuid,
          content: escape(content),
        },
        "forum/create/reply/"
      )
      .then((jsonresponse) => {
        return new ForumReply(main.core).fromObject(jsonresponse);
      });
  }

  public async getReplies(page = 0): Promise<Array<ForumReply>> {
    if (page == null || page == undefined) {
      page = 0;
    }

    let main = this;

    return new Call(this.core)
      .commit(
        {
          object: this.uuid,
          page: page.toString(),
        },
        "forum/get/reply/list/"
      )
      .then((jsonresponse) => {
        var replies = new Array<ForumReply>();
        jsonresponse.forEach((response) => {
          replies.push(new ForumReply(main.core).fromObject(response));
        });
        return replies;
      });
  }
}
