class Payment extends Core {
    public core: Core;
    public uuid: string;
    public request: CorePaymentRequest;
    public gateway: Gateway;
    public metadata: any;
    public network: Network;
    public legacyUsername: string;
    public player: Player;
    public sessions: Array<ConnectionHash>;

    constructor(core: Core, uuid?: string, request?: CorePaymentRequest, gateway?: Gateway, metadata?: any, network?: Network, legacyUsername?: string, player?: Player, sessions?: Array<ConnectionHash>) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.request = request;
        this.gateway = gateway;
        this.metadata = metadata;
        this.network = network;
        this.legacyUsername = legacyUsername;
        this.player = player;
        this.sessions = sessions;
    }

    public getId(): string {
        return this.uuid;
    }

    public getRequest(): CorePaymentRequest {
        return this.request;
    }

    public getGateway(): Gateway {
        return this.gateway;
    }

    public getMetadata(): any {
        return this.metadata
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getLegacyUsername(): string {
        return this.legacyUsername;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getSessions(): Array<ConnectionHash> {
        return this.sessions;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): Payment {
        this.uuid = array.uuid;
        this.request = CorePaymentRequest.fromJSON(this.core, array.request);
        this.gateway = Gateway.fromJSON(array.gateway);
        this.metadata = array.metadata;
        this.network = Network.fromJSON(this.core, array.network);
        this.legacyUsername = array.legacyUsername;
        this.player = Player.fromJSON(this.core, array.player);

        this.sessions = new Array<ConnectionHash>();
        // this.sessions = ... (TODO)
        return this;
    }

    public static fromJSON(core: Core, json: any): Payment {
        return new Payment(
            core,
            json.uuid,
            CorePaymentRequest.fromJSON(core, json.request),
            Gateway.fromJSON(json.gateway),
            json.metadata,
            Network.fromJSON(core, json.network),
            json.legacyUsername,
            Player.fromJSON(core, json.player),
            new Array<ConnectionHash>() //TODO: add connections parsing
        );
    }
}
