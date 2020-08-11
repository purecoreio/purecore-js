class Execution extends Core {

    public core: Core;

    public uuid: string;
    public network: Network;
    public command: Command;
    public commandContext: CommandContext;
    public instances: Array<Instance>;
    public needsOnline: boolean;
    public executedOn: Array<Instance>;
    public executed: boolean;

    public constructor(core: Core, uuid?: string, network?: Network, command?: Command, commandContext?: CommandContext, instances?: Array<Instance>, needsOnline?: boolean, executedOn?: Array<Instance>, executed?: boolean) {
        super(core.getTool(), core.dev);

        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.command = command;
        this.commandContext = commandContext;
        this.instances = instances;
        this.needsOnline = needsOnline;
        this.executedOn = executedOn;
        this.executed = executed;
    }

    public fromObject(object: any): Execution {
        this.uuid = object.uuid;
        this.network = new Network(this.core).fromObject(object.network);
        this.command = new Command(this.core).fromObject(object.command);
        this.commandContext = new CommandContext(this.core).fromObject(object.commandCOntext);

        this.instances = new Array<Instance>();
        if (Array.isArray(object.instances)) {
            object.instances.forEach(element => {
                if (typeof "element" === "string") {
                    this.instances.push(new Instance(this.core, element, null, null));
                } else {
                    this.instances.push(new Instance(this.core).fromObject(element));
                }
            });
        }

        this.needsOnline = object.needsOnline;

        this.executedOn = new Array<Instance>();
        if (Array.isArray(object.executedOn)) {
            object.executedOn.forEach(element => {
                if (typeof "element" === "string") {
                    this.executedOn.push(new Instance(this.core, element, null, null));
                } else {
                    this.executedOn.push(new Instance(this.core).fromObject(element));
                }
            });
        }

        this.executed = object.executed;
        return this;
    }

}