class Network extends Core {
    public core: Core;
    public uuid: string;
    public name: string;

    public constructor(core: Core, instance: Instance) {
        super(core.getTool());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
    }

    public getStore(): Store {
        return new Store(this);
    }

    public getForum(): Forum {
        return new Forum(this);
    }

    public getId(): string {
        return this.uuid;
    }

    public async getDevKey(): Promise<Key> {
        return new Call(this.core)
            .commit({network: this.uuid}, "key/get/dev/")
            .then(json => Key.fromJSON(this.core, json));
    }

    public async getKeyFromId(keyid: string): Promise<Key> {
        return new Call(this.core)
            .commit({keyid: keyid}, "key/from/id/")
            .then(json => Key.fromJSON(this.core, json));
    }

    public async createServer(name: string): Promise<Instance> {
        return new Call(this.core)
            .commit({name: name}, "instance/server/create/")
            .then(json => Instance.fromJSON(this.core, json, "SVR"));
    }

    public async getServers(): Promise<Array<Instance>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "instance/server/list/")
            .then(json => json.map(server => Instance.fromJSON(this.core, server, "SVR")));
    }

    public asInstance(): Instance {
        return new Instance(this.core, this.uuid, this.name, "NTW");
    }

    public async getVotingAnalytics(span: number = 3600 * 24): Promise<Array<VoteAnalytic>> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    span: span,
                },
                "instance/network/voting/analytics/"
            )
            .then(json => json.map(analytic => new VoteAnalytic().fromArray(analytic)));
    }

    async getVotingSites(): Promise<Array<VotingSite>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "instance/network/voting/site/list/")
            .then(json => json.map(site => VotingSite.fromJSON(this.core, site)));
    }

    public async getSetupVotingSites(displaySetup: boolean = true): Promise<Array<VotingSite | VotingSiteConfig>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "instance/network/voting/site/list/setup/" +
                (displaySetup ? "config" : ""))
            .then(json => displaySetup ? json.map(site => VotingSiteConfig.fromJSON(this.core, site)) :
                json.map(site => VotingSite.fromJSON(this.core, site)));
    }

    public async getGuild(): Promise<DiscordGuild> {
        return new Call(this.core)
            .commit({network: this.uuid}, "instance/network/discord/get/guild/")
            .then(json => DiscordGuild.fromJSON(this, json));
    }

    public async setGuild(discordGuildId: string): Promise<boolean> {
        return new Call(this.core)
            .commit({guildid: discordGuildId}, "/instance/network/discord/setguild/")
            .then(() => true); //TODO: process response
    }

    public async setSessionChannel(channelId: string): Promise<boolean> {
        return new Call(this.core)
            .commit({channelid: channelId}, "instance/network/discord/setchannel/session/")
            .then(() => true); //TODO: process response
    }

    public async setDonationChannel(channelId: string): Promise<boolean> {
        return new Call(this.core)
            .commit({channelid: channelId}, "instance/network/discord/setchannel/donation/")
            .then(() => true); //TODO: process response
    }

    public async getHashes(): Promise<Array<ConnectionHash>> {
        return new Call(this.core)
            .commit({}, "session/hash/list/")
            .then(json => json.map(connection => ConnectionHash.fromJSON(this.core, connection)));
    }

    public async getOffences(): Promise<Array<Offence>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "punishment/offence/list/")
            .then(json => json.map(offence => Offence.fromJSON(this.core, offence)));
    }

    public async getOffenceActions(): Promise<Array<OffenceAction>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "punishment/action/list/")
            .then(json => json.map(action => OffenceAction.fromJSON(this.core, action)));
    }

    public async searchPlayers(username?: string, uuid?: string, coreid?: string): Promise<Array<Player>> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    username: username,
                },
                "player/from/minecraft/username/search/"
            )
            .then(json => json.map(player => Player.fromJSON(this.core, player)));
    }

    public async getPlayer(coreid: string): Promise<Player> {
        return new Call(this.core)
            .commit({player: coreid}, "player/from/core/id/")
            .then(json => Player.fromJSON(this.core, json));
    }

    public async getPlayers(page?: number): Promise<Array<Player>> {
        if (page == undefined) page = 0;

        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    page: page,
                },
                "instance/network/list/players/"
            )
            .then(json => json.map(player => Player.fromJSON(this.core, player)));
    }

    public async getPunishments(page?: number): Promise<Array<Punishment>> {
        if (page == undefined) page = 0;

        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    page: page,
                },
                "punishment/list/"
            )
            .then(json => json.map(punishment => Punishment.fromJSON(this.core, punishment)));
    }

    public static fromJSON(core: Core, json: any): Network {
        return new Network(
            core,
            new Instance(core, json.uuid, json.name, "NTW")
        );
    }
}
