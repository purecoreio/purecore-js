class ConnectionHash extends Core {
    public core: Core;
    public network: Network;
    public uuid: string;
    public hash: string;
    public player: Player;

    public constructor(core: Core, network?: Network, uuid?: string, hash?: string, player?: Player) {
        super(core.getKey());
        this.core = core;
        this.network = network;
        this.uuid = uuid;
        this.hash = hash;
        this.player = player;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getHash(): string {
        return this.hash;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getId(): string {
        return this.uuid;
    }

    public async requestSession(): Promise<SessionRequest> {
        return new Call(this.core)
            .commit({hash: this.hash}, "session/hash/token/")
            .then(json => {
                return new SessionRequest(
                    this.core,
                    json.uuid,
                    json.token,
                    json.validated,
                    Player.fromJSON(this.core, json.player),
                    Network.fromJSON(this.core, json.network),
                    "player"
                );
            });
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array) {
        this.network = Network.fromJSON(this.core, array.network);
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.player = Player.fromJSON(this.core, array.player);
        return this;
    }

    public static fromJSON(core: Core, json: any): ConnectionHash {
        return new ConnectionHash(
            core,
            Network.fromJSON(core, json.network),
            json.uuid,
            json.hash,
            Player.fromJSON(core, json.player)
        );
    }
}
