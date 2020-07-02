class Forum {
    public network: Network;

    public constructor(network: Network) {
        this.network = network;
    }

    public async getSections(): Promise<Array<ForumSection>> {
        return new Call(this.network.core)
            .commit({network: this.network.uuid}, "forum/get/section/list/")
            .then(json => json.map(section => ForumSection.fromJSON(this.network.core, section)));
    }

    public async getCategory(categoryId: string): Promise<ForumCategory> {
        return new Call(this.network.core)
            .commit({category: categoryId}, "forum/get/category/")
            .then(json => ForumCategory.fromJSON(this.network.core, json));
    }

    public async getPost(postId): Promise<ForumPost> {
        return new Call(this.network.core)
            .commit({post: postId}, "forum/get/post/")
            .then(json => ForumPost.fromJSON(this.network.core, json));
    }

    public async createSection(name, description): Promise<ForumSection> {
        return new Call(this.network.core)
            .commit(
                {
                    network: this.network.uuid,
                    name: name,
                    description: description,
                },
                "forum/create/section/"
            )
            .then(json => ForumSection.fromJSON(this.network.core, json));
    }
}
