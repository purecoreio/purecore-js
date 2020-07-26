class Payment extends Core {
  public core: Core;
  public uuid: string;
  public request: CorePaymentRequest;
  public gateway: Gateway;
  public metadata;
  public network: Network;
  public legacyUsername: string;
  public player: Player;
  public sessions: Array<ConnectionHash>;

  constructor(
    core: Core,
    uuid?: string,
    request?: CorePaymentRequest,
    gateway?: Gateway,
    metadata?,
    network?: Network,
    legacyUsername?: string,
    player?: Player,
    sessions?
  ) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.request = request;
    this.gateway = gateway;
    this.metadata = metadata;
    this.network = network;
    this.legacyUsername = legacyUsername;
    this.player = player;
    this.sessions = new Array<ConnectionHash>();
  }

  fromObject(array): Payment {
    this.uuid = array.uuid;
    this.request = new CorePaymentRequest(this.core).fromObject(array.request);
    this.gateway = new Gateway(
      array.gateway.name,
      array.gateway.url,
      array.gateway.color,
      array.gateway.logo
    );
    this.metadata = array.metadata;
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.legacyUsername = array.legacyUsername;
    try {
      this.player = new Player(
        this.core,
        array.player.coreid,
        array.player.username,
        array.player.uuid,
        array.player.verified
      );
    } catch (error) {
      this.player = null;
    }

    // this.sessions = ... (TODO)
    return this;
  }
}
