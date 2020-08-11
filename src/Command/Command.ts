class Command extends Core {
  public core: Core;

  public uuid: String;
  public cmd: String;
  public network: Network;

  constructor(core: Core, uuid?: String, cmd?: String, network?: Network) {
    super(core.getTool, core.dev);
    this.core = core;
    this.uuid = uuid;
    this.cmd = cmd;
    this.network = network;
  }

  public fromObject(object: any): Command {
    this.uuid = object.cmdId;
    this.cmd = object.cmdString;
    this.network = new Network(this.core).fromObject(object.network);
    return this;
  }

}
