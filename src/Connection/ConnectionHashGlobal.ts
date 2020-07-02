class ConnectionHashGlobal extends Core {
    public core: Core;
    public hash: string;
    public player: Player;

    public constructor(core: Core, hash?: string, player?: Player) {
        super(core.getKey());
        this.core = core;
        this.hash = hash;
        this.player = player;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getHash(): string {
        return this.hash;
    }

    public async requestSession(): Promise<SessionRequest> {
        return new Call(this.core)
            .commit({hash: this.hash}, "session/hash/token/")
            .then(json => {
                if (this.core.getTool() != null) {
                    return SessionRequest.fromJSON(this.core, json);
                } else {
                    return new SessionRequest(
                        this.core,
                        json.uuid,
                        json.token,
                        json.validated,
                        Player.fromJSON(this.core, json.player),
                        null,
                        "masterplayer"
                    );
                }
            });
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array) {
        this.hash = array.hash;
        this.player = Player.fromJSON(this.core, array.player);
        return this;
    }
}
