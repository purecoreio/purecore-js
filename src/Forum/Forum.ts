class Forum {
  public network: Network;

  public constructor(network: Network) {
    this.network = network;
  }

  public async getSections(): Promise<Array<ForumSection>> {
    let main = this;

    return new Call(this.network.core)
      .commit(
        {
          network: this.network.uuid,
        },
        "forum/get/section/list/"
      )
      .then((jsonresponse) => {
        var finalResponse = new Array<ForumSection>();
        jsonresponse.forEach((sectionJSON) => {
          finalResponse.push(
            new ForumSection(main.network.core).fromArray(sectionJSON)
          );
        });
        return finalResponse;
      });
  }

  public async getCategory(catid: string): Promise<ForumCategory> {
    let main = this;

    return new Call(this.network.core)
      .commit(
        {
          category: catid,
        },
        "forum/get/category/"
      )
      .then((jsonresponse) => {
        return new ForumCategory(main.network.core).fromArray(jsonresponse);
      });
  }

  public async getPost(postid): Promise<ForumPost> {
    let main = this;

    return new Call(this.network.core)
      .commit(
        {
          post: postid,
        },
        "forum/get/post/"
      )
      .then((jsonresponse) => {
        return new ForumPost(main.network.core).fromArray(jsonresponse);
      });
  }

  public async createSection(name, description): Promise<ForumSection> {
    let main = this;

    return new Call(this.network.core)
      .commit(
        {
          network: this.network.uuid,
          name: name,
          description: description,
        },
        "forum/create/section/"
      )
      .then((jsonresponse) => {
        return new ForumSection(main.network.core).fromArray(jsonresponse);
      });
  }
}
