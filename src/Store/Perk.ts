class Perk extends Core {
  core: Core;
  uuid: string;
  network: Network;
  name: string;
  description: string;
  type: string;
  category: PerkCategory;
  commands: Array<StoreCommand>;

  constructor(
    core: Core,
    uuid?: string,
    network?: Network,
    name?: string,
    description?: string,
    type?: string,
    category?: PerkCategory,
    commands?: Array<StoreCommand>
  ) {
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

  fromObject(array): Perk {
    this.uuid = array.uuid;
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.name = array.name;
    this.description = array.description;
    this.type = array.type;
    this.category = new PerkCategory(this.core).fromObject(array.category);

    var commands = new Array<StoreCommand>();
    array.commands.forEach((cmd) => {
      commands.push(new StoreCommand(this.core).fromObject(cmd));
    });

    this.commands = commands;

    return this;
  }

  public async addCmd(
    cmd: string,
    needsOnline: boolean,
    executeOn: Array<Instance>
  ): Promise<Array<StoreCommand>> {
    let core = this.core;
    var ids = [];

    executeOn.forEach((instance) => {
      ids.push(instance.uuid);
    });

    var needsOnlineStr = "false";
    if (needsOnline) {
      needsOnlineStr = "true";
    }

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
      .then((jsonresponse) => {
        var commands = new Array<StoreCommand>();
        jsonresponse.forEach((cmd) => {
          commands.push(new StoreCommand(core).fromObject(cmd));
        });
        return commands;
      });
  }
}
