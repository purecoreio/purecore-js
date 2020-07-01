class ConnectionHashGlobal extends Core {
  core: Core;
  hash: string;
  player: Player;

  constructor(core: Core, hash?: string, player?: Player) {
    super(core.getKey());
    this.core = core;
    this.hash = hash;
    this.player = player;
  }

  fromArray(array) {
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

  public async requestSession(): Promise<SessionRequest> {
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
        if (main.core.getTool() != null) {
          var instance = new Network(
            main.core,
            new Instance(
              main.core,
              jsonresponse.network.uuid,
              jsonresponse.network.name,
              "NTW"
            )
          );
          var sessionRequest = new SessionRequest(
            main.core,
            jsonresponse.uuid,
            jsonresponse.token,
            jsonresponse.validated,
            player,
            instance,
            "player"
          );
          return sessionRequest;
        } else {
          var sessionRequest = new SessionRequest(
            main.core,
            jsonresponse.uuid,
            jsonresponse.token,
            jsonresponse.validated,
            player,
            null,
            "masterplayer"
          );
          return sessionRequest;
        }
      });
  }
}
