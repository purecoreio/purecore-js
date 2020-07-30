class Perk extends Core {
  core: Core;
  uuid: string;
  network: Network;
  name: string;
  description: string;
  type: string;
  category: PerkCategory;
  commands: Array<StoreCommand>;
  params: Array<PerkParam>;

  constructor(
    core: Core,
    uuid?: string,
    network?: Network,
    name?: string,
    description?: string,
    type?: string,
    category?: PerkCategory,
    commands?: Array<StoreCommand>,
    params?: Array<PerkParam>
  ) {
    super(core.getTool(),core.dev);
    this.core = core;
    this.uuid = uuid;
    this.network = network;
    this.name = name;
    this.description = description;
    this.type = type;
    this.category = category;
    this.commands = commands;
    this.params = params;
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
    this.params = new Array<PerkParam>()
    if (array.params == null) {
      this.params = null;
    } else {
      array.params.forEach(param => {
        this.params.push(new PerkParam(this.core).fromObject(param));
      });
    }
    return this;
  }

  public async addParam(placeholder: string, name: string, description: string, type: string, mandatory?: boolean, defaultv?: string): Promise<PerkParam> {
    if (mandatory == null) mandatory = false;
    if (defaultv == null) defaultv = "null";
    var strMandatory:string = null;
    mandatory ? (strMandatory='true') : (strMandatory='false')

    return new Call(this.core)
      .commit(
        {
          perk: this.uuid,
          placeholder: placeholder,
          name: name,
          description: description,
          type: type,
          mandatory: strMandatory,
          default: defaultv,
        },
        "store/perk/param/add/"
      )
      .then((jsonresponse) => {
        return new PerkParam(this.core).fromObject(jsonresponse);
      });
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
