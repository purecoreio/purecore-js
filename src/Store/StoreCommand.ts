class StoreCommand extends Core {
    public readonly core: Core;
    public network: Network;
    public cmd: Command;
    public needsOnline: boolean;
    public executeOn: Array<Instance>;
    public listId: string;

    public constructor(core: Core, network?: Network, cmd?: Command, needsOnline?: boolean, executeOn?: Array<Instance>, listId?: string) {
        super(core.getTool());

        this.core = core;
        this.network = network;
        this.cmd = cmd;
        this.needsOnline = needsOnline;
        this.executeOn = executeOn;
        this.listId = listId;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public isNeedsOnline(): boolean {
        return this.needsOnline;
    }

    public getExecuteOn(): Array<Instance> {
        return this.executeOn;
    }

    public getListId(): string {
        return this.listId;
    }

    public getCommand(): Command {
        return this.cmd;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): StoreCommand {
        this.network = Network.fromJSON(this.core, array.network);

        if (typeof array.command == "string") {
            this.cmd = new Command(array.command, null, this.network);
        } else {
            this.cmd = new Command(
                array.command.cmdId,
                array.command.cmdString,
                this.network
            );
        }
        this.needsOnline = array.needs_online;

        this.listId = array.listid;

        this.executeOn = array.execute_on.map(instance => {
            if (typeof instance == "string") {
                return new Instance(this.core, instance, null, "UNK");
            } else {
                return Instance.fromJSON(this.core, instance);
            }
        });

        return this;
    }

    public static fromJSON(core: Core, json: any): StoreCommand {
        const network: Network = Network.fromJSON(core, json.network);

        return new StoreCommand(
            core,
            network,
            typeof json.command == "string" ? new Command(json.command, null, network) :
                Command.fromJSON(network, json.command),
            json.needs_online,
            json.execute_on.map(instance => typeof instance == "string" ? new Instance(core, instance, null, "UNK") :
                Instance.fromJSON(core, json.instance)),
            json.listid
        );
    }
}
