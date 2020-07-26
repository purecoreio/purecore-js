class ConnectionHash extends Core {
  core: Core;
  network: Network;
  uuid: string;
  hash: string;
  player: Player;

  constructor(
    core: Core,
    network?: Network,
    uuid?: string,
    hash?: string,
    player?: Player
  ) {
    super(core.getKey());
    this.core = core;
    this.network = network;
    this.uuid = uuid;
    this.hash = hash;
    this.player = player;
  }

  fromObject(array) {
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.uuid = array.uuid;
    this.hash = array.hash;
    this.player = new Player(
      this.core,
      array.player.coreid,
      array.player.username,
      array.player.uuid,
      array.player.verified
    );
    return this;
  }

  getPlayer() {
    return this.player;
  }

  getHash() {
    return this.hash;
  }

  getNetwork() {
    return this.network;
  }

  async requestSession(): Promise<SessionRequest> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          hash: this.hash,
        },
        "session/hash/token/"
      )
      .then((jsonresponse) => {
        var player = new Player(
          main.core,
          jsonresponse.player.coreid,
          jsonresponse.player.username,
          jsonresponse.player.uuid,
          jsonresponse.player.verified
        );
        var instance = new Network(
          main.core,
          new Instance(
            main.core,
            jsonresponse.network.uuid,
            jsonresponse.network.name,
            "NTW"
          )
        );
        return new SessionRequest(
          main.core,
          jsonresponse.uuid,
          jsonresponse.token,
          jsonresponse.validated,
          player,
          instance,
          "player"
        );
      });
  }
}
