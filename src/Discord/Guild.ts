class DiscordGuild {
  network: Network;
  name: string;
  uuid;
  memberCount;

  constructor(network: Network, name?: string, uuid?, memberCount?) {
    this.network = network;
    this.name = name;
    this.uuid = uuid;
    this.memberCount = memberCount;
  }

  public fromObject(array): DiscordGuild {
    this.name = array.name;
    this.uuid = array.uuid;
    this.memberCount = array.memberCount;
    return this;
  }
}
