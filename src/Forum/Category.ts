class ForumCategory extends Core {
  public core: Core;
  public uuid;
  public name;
  public description;
  public network: Network;
  public section: ForumSection;

  public constructor(
    core: Core,
    uuid?: string,
    name?: string,
    description?: string,
    network?: Network,
    section?: ForumSection
  ) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.network = network;
    this.section = section;
  }

  public fromObject(array): ForumCategory {
    this.uuid = array.uuid;
    this.name = array.name;
    this.description = array.description;
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.section = new ForumSection(this.core).fromObject(array.section);
    return this;
  }

  public async getPosts(page = 0): Promise<Array<ForumPost>> {
    if (page == null || page == undefined) {
      page = 0;
    }

    let main = this;

    return new Call(this.core)
      .commit(
        {
          category: this.uuid,
          page: page.toString(),
        },
        "forum/get/post/list/"
      )
      .then((jsonresponse) => {
        var finalResponse = new Array<ForumPost>();
        jsonresponse.forEach((postJSON) => {
          finalResponse.push(
            new ForumPost(main.network.core).fromObject(postJSON)
          );
        });
        return finalResponse;
      });
  }

  public async createPost(title, content): Promise<ForumPost> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          category: this.uuid,
          title: title,
          content: escape(content),
        },
        "forum/create/post/"
      )
      .then((jsonresponse) => {
        return new ForumPost(main.core).fromObject(jsonresponse);
      });
  }
}
