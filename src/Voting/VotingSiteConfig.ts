class VotingSiteConfig extends Core {
  public core: Core;
  public network: Network;
  public votingSite: VotingSite;
  public url: string;

  public constructor(
    core: Core,
    network?: Network,
    votingSite?: VotingSite,
    url?: string
  ) {
    super(core.getTool());
    this.core = core;
    this.network = network;
    this.votingSite = votingSite;
    this.url = url;
  }

  public fromArray(array): VotingSiteConfig {
    this.votingSite = new VotingSite(this.core).fromArray(array.votingSite);
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.url = array.url;
    return this;
  }

  public async setURL(url: string): Promise<VotingSiteConfig> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.network.uuid,
          url: url,
          site: this.votingSite.uuid,
        },
        "instance/network/voting/site/setup/"
      )
      .then((jsonresponse) => {
        main.url = jsonresponse.url;
        return this;
      });
  }
}
