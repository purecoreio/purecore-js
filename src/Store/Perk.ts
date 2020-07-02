class Perk extends Core {
    public readonly core: Core;
    public uuid: string;
    public network: Network;
    public name: string;
    public description: string;
    public type: string;
    public category: PerkCategory;
    public commands: Array<StoreCommand>;

    constructor(core: Core, uuid?: string, network?: Network, name?: string, description?: string, type?: string, category?: PerkCategory, commands?: Array<StoreCommand>) {
        super(core.getTool());

        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
        this.commands = commands;
    }

    public async addCmd(cmd: string, needsOnline: boolean, executeOn: Array<Instance>): Promise<Array<StoreCommand>> {
        const ids: Array<string> = executeOn.map(instance => instance.uuid);

        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    perk: this.uuid,
                    cmd: cmd,
                    needsOnline: needsOnline,
                    instances: JSON.stringify(ids),
                },
                "store/perk/cmd/add/"
            )
            .then(json => json.map(command => StoreCommand.fromJSON(this.core, command)));
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getType(): string {
        return this.type;
    }

    public getCategory(): PerkCategory {
        return this.category;
    }

    public getCommands(): Array<StoreCommand> {
        return this.commands;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): Perk {
        this.uuid = array.uuid;
        this.network = Network.fromJSON(this.core, array.network);
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = PerkCategory.fromJSON(this.core, array.category);
        this.commands = array.commands.map(command => StoreCommand.fromJSON(this.core, command));

        return this;
    }

    public static fromJSON(core: Core, json: any): Perk {
        return new Perk(
            core,
            json.uuid,
            Network.fromJSON(core, json.network),
            json.name,
            json.description,
            json.type,
            PerkCategory.fromJSON(core, json.category),
            json.commands.map(command => StoreCommand.fromJSON(core, command))
        );
    }
}
