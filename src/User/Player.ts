class Player extends Core {
    public core: Core;
    public id: string;
    public username: string;
    public uuid: string;
    public verified: boolean;

    constructor(core: Core, id: string, username?: string, uuid?: string, verified?: boolean) {
        super(core.getKey(), core.dev);
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }

    public async closeConnections(instance: Instance): Promise<Array<Connection>> {
        return await new Call(this.core)
            .commit({instance: instance.getId()}, "connection/close/all/")
            .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
    }

    public async openConnection(ip: string, instance: Instance): Promise<Connection> {
        return await new Call(this.core)
            .commit(
                {
                    instance: instance.getId(),
                    ip: ip,
                    username: this.username,
                    uuid: this.uuid,
                },
                "connection/new/"
            )
            .then(json => Connection.fromJSON(this.core, json));
    }

    public async getBillingAddress(): Promise<BillingAddress> {
        return await new Call(this.core)
            .commit({}, "player/billing/get/")
            .then(BillingAddress.fromJSON);
    }

    public async getPunishments(network?: Network, page?: number): Promise<Array<Punishment>> {
        if (page == undefined) page = 0;

        let args: any = {
            player: this.id,
            page: page.toString(),
        };

        if (network != null) args.network = network.getId();

        return await new Call(this.core)
            .commit(args, "player/punishment/list/")
            .then(json => json.map(punishment => Punishment.fromJSON(this.core, punishment)));
    }

    public async getPayments(store: Store, page?: number): Promise<Array<Payment>> {
        if (page == undefined) page = 0;

        return await new Call(this.core)
            .commit({
                    network: store.getNetwork().getId(),
                    page: page.toString(),
                    player: this.id,
                }, "player/payment/list/"
            )
            .then(json => json.map(payment => Payment.fromJSON(this.core, payment)));
    }

    public async getDiscordId(): Promise<String> {
        return await new Call(this.core)
            .commit({}, "player/payment/list/")
            .then(json => json.id);
    }

    public async getConnections(instance: Instance, page?: number): Promise<Array<Connection>> {
        if (page == undefined) page = 0;

        let args: any = {
            page: page,
            player: this.id
        };

        if (instance != null) args.instance = instance.getId();

        return await new Call(this.core)
            .commit(args, "player/connection/list/")
            .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
    }

    public async getMatchingConnections(instance: Instance, page?: number, playerList?: Array<Player>): Promise<Array<ActivityMatch>> {
        if (page == undefined) page = 0;

        return await new Call(this.core)
            .commit(
                {
                    instance: instance.getId(),
                    page: page,
                    players: JSON.stringify(playerList.map(player => player.getId())),
                    player: this.id,
                },
                "connection/list/match/players/"
            )
            .then(json => json.map(activity => ActivityMatch.fromJSON(activity)));
    }

    public getId(): string {
        return this.id;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getUsername(): string {
        return this.username;
    }

    public isVerified(): boolean {
        return this.verified;
    }

    public static fromJSON(core: Core, json: any): Player {
        return new Player(
            core,
            json.id,
            json.username,
            json.uuid,
            json.verified
        );
    }
}
