class VotingSite extends Core {
  public core: Core;
  public uuid: string;
  public supervisor: Owner;
  public resetTimes;
  public timezone: string;
  public name: string;
  public url: string;
  public technicalName: string;

  public constructor(
    core: Core,
    uuid?: string,
    supervisor?: Owner,
    resetTimes?,
    timezone?: string,
    name?: string,
    url?: string,
    technicalName?: string
  ) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.supervisor = supervisor;
    this.resetTimes = resetTimes;
    this.timezone = timezone;
    this.name = name;
    this.url = url;
  }

  public fromArray(array): VotingSite {
    this.uuid = array.uuid;
    this.supervisor = new Owner(
      this.core,
      array.supervisor.id,
      array.supervisor.name,
      array.supervisor.surname,
      array.supervisor.email
    );
    this.resetTimes = array.resetTimes;
    this.timezone = array.timezone;
    this.name = array.name;
    this.url = array.url;
    this.technicalName = array.technicalName;
    return this;
  }

  public async getConfig(network: Network, empty: boolean = true) {
    if (empty) {
      return new VotingSiteConfig(this.core, network, this, null);
    } else {
      throw new Error("to be implemented");
      // to-do fetch from server
    }
  }
}
