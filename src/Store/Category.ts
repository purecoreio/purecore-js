class StoreCategory extends Core {
  core: Core;
  uuid: string;
  name: string;
  description: string;
  network: Network;
  upgradable: boolean;

  constructor(
    core: Core,
    uuid?: string,
    name?: string,
    description?: string,
    network?: Network,
    upgradable?: boolean
  ) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.network = network;
    this.upgradable = upgradable;
  }

  fromObject(array): StoreCategory {
    this.uuid = array.uuid;
    this.name = array.name;
    this.description = array.description;
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.upgradable = array.upgradable;
    return this;
  }

  getId() {
    return this.uuid;
  }

  public async createItem(
    name: string,
    description: string,
    price
  ): Promise<StoreItem> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          network: this.network.uuid,
          name: name,
          description: description,
          category: this.uuid,
          price: price,
        },
        "store/item/create/"
      )
      .then((jsonresponse) => {
        return new StoreItem(main.core).fromObject(jsonresponse);
      });
  }
}
