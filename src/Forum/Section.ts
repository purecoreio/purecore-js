class ForumSection extends Core {
  public core: Core;
  public uuid;
  public name;
  public description;
  public network: Network;

  public constructor(
    core: Core,
    uuid?: string,
    name?: string,
    description?: string,
    network?: Network
  ) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.network = network;
  }

  public async getCategories(): Promise<Array<ForumCategory>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          section: this.uuid,
        },
        "forum/get/category/list/"
      )
      .then((jsonresponse) => {
        var finalResponse = new Array<ForumCategory>();
        jsonresponse.forEach((categoryJSON) => {
          finalResponse.push(
            new ForumCategory(main.core).fromObject(categoryJSON)
          );
        });
        return finalResponse;
      });
  }

  public fromObject(array): ForumSection {
    this.uuid = array.uuid;
    this.name = array.name;
    this.description = array.description;
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    return this;
  }

  public async createCategory(
    name: string,
    description: string
  ): Promise<ForumCategory> {
    let main = this;

    return new Call(this.network.core)
      .commit(
        {
          section: this.uuid,
          name: name,
          description: description,
        },
        "forum/create/category/"
      )
      .then((jsonresponse) => {
        return new ForumCategory(main.core).fromObject(jsonresponse);
      });
  }
}
