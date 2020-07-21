class VotingSiteConfig extends Core {
    private readonly core: Core;
    private network: Network;
    private votingSite: VotingSite;
    private url: string;

    public constructor(core: Core, network?: Network, votingSite?: VotingSite, url?: string) {
        super(core.getTool());
        this.core = core;
        this.network = network;
        this.votingSite = votingSite;
        this.url = url;
    }

    public async setURL(url: string): Promise<VotingSiteConfig> {
        return new Call(this.core)
            .commit(
                {
                    network: this.network.uuid,
                    url: url,
                    site: this.votingSite.getId(),
                },
                "instance/network/voting/site/setup/"
            )
            .then((json) => {
                this.url = json.url;
                return this;
            });
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getVotingSite(): VotingSite {
        return this.votingSite;
    }

    public getUrl(): string {
        return this.url;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): VotingSiteConfig {
        this.votingSite = VotingSite.fromJSON(this.core, array.votingSite);
        this.network = Network.fromJSON(this.core, array.network);
        this.url = array.url;
        return this;
    }

    public static fromJSON(core: Core, json: any): VotingSiteConfig {
        return new VotingSiteConfig(
            core,
            Network.fromJSON(core, json.network),
            VotingSite.fromJSON(core, json.votingSite),
            json.url
        );
    }
}
