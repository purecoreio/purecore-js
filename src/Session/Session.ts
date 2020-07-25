class Session extends Core {
  public core: Core;
  public uuid: string;
  public hash: string;
  public device: SessionDevice;
  public location: SessionLocation;
  public usage: SessionUsage;
  public network: Network;
  public player: Player;
  public owner: Owner;
  public user: Player | Owner;

  public constructor(
    core: Core,
    uuid?: string,
    hash?: string,
    device?: SessionDevice,
    location?: SessionLocation,
    usage?: SessionUsage,
    network?: Network,
    user?: Owner | Player
  ) {
    super(core.getTool(), core.dev);

    this.core = core;
    this.uuid = uuid;
    this.hash = hash;
    this.device = device;
    this.location = location;
    this.usage = usage;
    this.network = network;

    if (user instanceof Player) {
      this.player = user;
    } else if (user instanceof Owner) {
      this.owner = user;
    }

    this.user = user;
  }

  public getOwner(): Owner {
    if (this.user == null || !(this.user instanceof Owner)) {
      return new Owner(this.core, null, null, null, null);
    } else {
      return this.user;
    }
  }

  public getUser(): Owner | Player {
    return this.user;
  }

  public async fromHash(sessionHash: string): Promise<Session> {
    return await new Call(this.core)
      .commit({ hash: sessionHash }, "session/get/")
      .then((json) => new Session(this.core).fromArray(json));
  }

  public getId(): string {
    return this.uuid;
  }

  public getHash(): string {
    return this.hash;
  }

  public getPlayer(): Player {
    return this.player;
  }

  public async getMachines(): Promise<Array<Machine>> {
    return await new Call(this.core)
      .commit({ hash: this.getHash() }, "machine/list/")
      .then((json) => json.map((machine) => new Machine().fromArray(machine)));
  }

  public async getNetworks(): Promise<Array<Network>> {
    return await new Call(this.core)
      .commit({}, "instance/network/list/")
      .then((json) =>
        json.map((network) => Network.fromJSON(this.core, network))
      );
  }

  /**
   * @deprecated use static method fromJSON
   */
  public fromArray(array: any): Session {
    this.uuid = array.uuid;
    this.hash = array.hash;
    this.device = SessionDevice.fromJSON(array.device);
    this.location = SessionLocation.fromJSON(array.location);
    this.usage = SessionUsage.fromJSON(array.usage);

    if ("network" in array) {
      this.network = Network.fromJSON(this.core, array.network);
      this.core = new Core(this, this.core.dev);
    } else {
      this.core = new Core(this, this.core.dev);
    }

    if ("player" in array) {
      this.player = Player.fromJSON(this.core, array.player);
    } else if ("owner" in array) {
      this.owner = Owner.fromJSON(this.core, array.owner);
    }

    return this;
  }

  public static fromJSON(core: Core, json: any): Session {
    return new Session(
      core,
      json.uuid,
      json.hash,
      SessionDevice.fromJSON(json.device),
      SessionLocation.fromJSON(json.location),
      SessionUsage.fromJSON(json.usage),
      "network" in json ? Network.fromJSON(core, json.network) : null,
      "player" in json
        ? Player.fromJSON(core, json.network)
        : Owner.fromJSON(core, json.owner)
    );
  }
}
