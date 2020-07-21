class SessionRequest extends Core {
    public core: Core;
    public uuid: string;
    public token: string;
    public validated: boolean;
    public player: Player;
    public network: Network;
    public type: string; //TODO: enum

    public constructor(core: Core, uuid: string, token: string, validated: boolean, player: Player, network: Network, type: string) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.token = token;
        this.validated = validated;
        this.player = player;
        this.network = network;
        this.type = type;
    }

    public isValidated(): boolean {
        return this.validated;
    }

    public getValidationUrl(): string {
        return `https://api.purecore.io/link/discord/redirect/?uuid=${this.uuid}&hash=${this.token};`
    }

    public getToken(): string {
        return this.token;
    }

    public async getSession(): Promise<Session> {
        return await new Call(this.core)
            .commit({token: this.token}, "session/hash/token/exchange/")
            .then(json => new Session(this.core).fromArray(json));
    }

    public static fromJSON(core: Core, json: any): SessionRequest {
        return new SessionRequest(
            core,
            json.uuid,
            json.token,
            json.validated,
            Player.fromJSON(core, json.player),
            Network.fromJSON(core, json.network),
            "player"
        );
    }
}
