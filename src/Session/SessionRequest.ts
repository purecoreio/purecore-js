class SessionRequest extends Core {
  core: Core;
  uuid: string;
  token: string;
  validated: boolean;
  player: Player;
  network: Network;
  type: string;

  constructor(
    core: Core,
    uuid: string,
    token: string,
    validated: boolean,
    player: Player,
    network: Network,
    type: string
  ) {
    super(core.getKey());
    this.core = core;
    this.uuid = uuid;
    this.token = token;
    this.validated = validated;
    this.player = player;
    this.network = network;
    this.type = type;
  }

  public isValidated() {
    return this.validated;
  }

  public getValidationUrl() {
    return (
      "https://api.purecore.io/link/discord/redirect/?uuid=" +
      this.uuid +
      "&hash=" +
      this.token
    );
  }

  public getToken() {
    return this.token;
  }

  public async getSession(): Promise<Session> {
    var core = this.core;
    var token = this.token;

    return await new Call(this.core)
      .commit({ token: token }, "session/hash/token/exchange/")
      .then(function (jsonresponse) {
        return new Session(core).fromObject(jsonresponse);
      });
  }
}
