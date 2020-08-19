class Session extends Core {
  core: Core;
  uuid: string;
  hash: string;
  device: SessionDevice;
  location: SessionLocation;
  usage: SessionUsage;
  network: Network;
  player: Player;
  owner: Owner;

  constructor(
    core: Core,
    uuid?: string,
    hash?: string,
    device?: SessionDevice,
    location?: SessionLocation,
    usage?: SessionUsage,
    network?: Network,
    user?
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
  }

  getOwner(): Owner {
    if (this.owner == null) {
      return new Owner(this.core, null, null, null, null);
    }
    else {
      return this.owner;
    }
  }

  getUser(): Owner | Player {
    if (this.player == undefined && this.owner != undefined) {
      return new Owner(
        this.core,
        this.owner.getId(),
        this.owner.getName(),
        this.owner.getSurname(),
        this.owner.getEmail()
      );
    } else {
      return new Player(
        this.core,
        this.player.getId(),
        this.player.getUsername(),
        this.player.getUuid(),
        this.player.verified
      );
    }
  }

  fromObject(array): Session {
    var core = this.core;
    this.uuid = array.uuid;
    this.hash = array.hash;
    this.device = new SessionDevice(
      array.device.brand,
      array.device.device,
      array.device.model,
      array.device.os
    );
    this.location = new SessionLocation(
      array.location.city,
      array.location.state,
      array.location.country_code
    );
    this.usage = new SessionUsage(array.usage.creation, array.usage.uses);

    if ("network" in array) {
      this.network = new Network(
        this.core,
        new Instance(this.core, array.network.uuid, array.network.name, "NTW")
      );
      this.core = new Core(
        new Session(
          new Core(null, core.dev),
          this.uuid,
          this.hash,
          this.device,
          this.location,
          this.usage,
          this.network,
          null
        ),
        core.dev
      );
    } else {
      this.core = new Core(
        new Session(
          new Core(null, core.dev),
          this.uuid,
          this.hash,
          this.device,
          this.location,
          this.usage,
          null,
          null
        ),
        core.dev
      );
    }

    if ("player" in array) {
      this.player = new Player(
        this.core,
        array.player.coreid,
        array.player.username,
        array.player.uuid,
        array.player.verified
      );
    } else if ("owner" in array) {
      this.owner = new Owner(
        this.core,
        array.owner.uuid,
        array.owner.name,
        array.owner.surname,
        array.owner.email
      );
    }

    return this;
  }

  public async fromHash(sessionHash): Promise<Session> {
    var core = this.core;
    var hash = sessionHash;

    return await new Call(this.core)
      .commit({ hash: hash }, "session/get/")
      .then(function (jsonresponse) {
        return new Session(core).fromObject(jsonresponse);
      });
  }

  getId(): string {
    return this.uuid;
  }

  getHash(): string {
    return this.hash;
  }

  getPlayer(): Player {
    if (this.player == null) {
      return new Player(this.core, null);
    }
    else {
      return this.player;
    }
  }

  public async getMachines(): Promise<Array<Machine>> {
    var hash = this.hash;

    return await new Call(this.core)
      .commit({ hash: hash }, "machine/list/")
      .then(function (jsonresponse) {
        var machines = new Array<Machine>();
        jsonresponse.forEach((machineJSON) => {
          machines.push(new Machine(this.core).fromObject(machineJSON));
        });
        return machines;
      });
  }

  public async getNetworks(): Promise<Array<Network>> {
    var core = this.core;
    return await new Call(this.core)
      .commit({}, "instance/network/list/")
      .then(function (jsonresponse) {
        var networks = new Array<Network>();
        jsonresponse.forEach((network) => {
          networks.push(
            new Network(
              core,
              new Instance(core, network.uuid, network.name, "NTW")
            )
          );
        });
        return networks;
      });
  }
}
