class Command {
    private readonly id: string;
    private readonly command: string;
    private readonly network: Network;

    public constructor(id: string, command: string, network: Network) {
        this.id = id;
        this.command = command;
        this.network = network;
    }

    public getId(): string {
        return this.id;
    }

    public getCommand(): string {
        return this.command;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public static fromJSON(network: Network, json: any): Command {
        return new Command(
            json.cmdId,
            json.cmdString,
            network
        );
    }
}
