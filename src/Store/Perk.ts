class Perk extends Core {

    core: Core;
    uuid: string;
    network: Network;
    name: string;
    description: string;
    type: string;
    category: PerkCategory;
    commands: Array<StoreCommand>;

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

    fromArray(array): Perk {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = new PerkCategory(this.core).fromArray(array.category);

        var commands = new Array<StoreCommand>();
        array.commands.forEach(cmd => {
            commands.push(new StoreCommand(this.core).fromArray(cmd))
        });

        this.commands = commands;

        return this;
    }
}