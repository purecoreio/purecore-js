class DiscordGuild {
    public network: Network;
    public name: string;
    public uuid: string;
    public memberCount: number;

    public constructor(network: Network, name?: string, uuid?: string, memberCount?: number) {
        this.network = network;
        this.name = name;
        this.uuid = uuid;
        this.memberCount = memberCount;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getName(): string {
        return this.name;
    }

    public getId(): string {
        return this.uuid;
    }

    public getMemberCount(): number {
        return this.memberCount;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): DiscordGuild {
        this.name = array.name;
        this.uuid = array.uuid;
        this.memberCount = array.memberCount;
        return this;
    }

    public static fromJSON(network: Network, json: any): DiscordGuild {
        return new DiscordGuild(
            network,
            json.name,
            json.uuid,
            json.memberCount
        );
    }
}
