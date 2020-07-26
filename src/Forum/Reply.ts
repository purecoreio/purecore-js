class ForumReply extends Core {
  public core: Core;
  public uuid;
  public content;
  public player: Player;
  public network: Network;
  public replyingTo;

  public constructor(
    core: Core,
    uuid?: string,
    content?: string,
    player?: Player,
    network?: Network,
    replyingTo?: ForumCategory
  ) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.content = content;
    this.player = player;
    this.network = network;
    this.replyingTo = replyingTo;
  }

  public fromObject(array): ForumReply {
    this.uuid = array.uuid;
    this.content = array.content;
    this.player = new Player(
      this.core,
      array.player.coreid,
      array.player.username,
      array.player.uuid,
      array.player.verified
    );
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    if ("title" in array.responseTo) {
      this.replyingTo = new ForumPost(this.core).fromObject(array.responseTo);
    } else {
      this.replyingTo = new ForumReply(this.core).fromObject(array.responseTo);
    }
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
