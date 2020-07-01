class Punishment extends Core {
  public core: Core;
  public uuid: string;
  public player: Player;
  public offenceList: Array<Offence>;
  public moderator: Player;
  public network: Network;
  public pointsChat;
  public pointsGameplay;
  public report: Report;
  public notes: string;
  public appealStatus: AppealStatus;

  public constructor(
    core?: Core,
    player?: Player,
    offenceList?: Array<Offence>,
    moderator?: Player,
    network?: Network,
    pointsChat?,
    pointsGameplay?,
    report?: Report,
    notes?: string,
    appealStatus?: AppealStatus
  ) {
    super(core.getTool());
    this.core = core;
    this.player = player;
    this.offenceList = offenceList;
    this.moderator = moderator;
    this.network = network;
    this.pointsChat = pointsChat;
    this.pointsGameplay = pointsGameplay;
    this.report = report;
    this.notes = notes;
    this.appealStatus = appealStatus;
  }

  public fromArray(array) {
    this.uuid = array.uuid;
    this.player = new Player(
      this.core,
      array.player.coreid,
      array.player.username,
      array.player.uuid,
      array.player.verified
    );

    var finalOffenceList = new Array<Offence>();
    array.offenceList.forEach((offenceArray) => {
      var offence = new Offence(this.core);
      finalOffenceList.push(offence.fromArray(offenceArray));
    });

    this.offenceList = finalOffenceList;
    this.moderator = new Player(
      this.core,
      array.createdBy.coreid,
      array.createdBy.username,
      array.createdBy.uuid,
      array.createdBy.verified
    );
    this.network = new Network(
      this.core,
      new Instance(this.core, array.network.uuid, array.network.name, "NTW")
    );
    this.pointsChat = array.pointsAddedChat;
    this.pointsGameplay = array.pointsAddedGameplay;
    if (array.report == null) {
      this.report = null;
    } else {
      // to-do: report implementation
    }
    this.appealStatus = new AppealStatus(
      this.core,
      array.appealStatus.status,
      array.appealStatus.appealId
    );
    return this;
  }

  public getStatus() {
    return this.appealStatus;
  }

  public getPlayer() {
    return this.player;
  }

  public getOffenceList() {
    return this.offenceList;
  }

  public getPoints(type) {
    if (type == "GMP") {
      return this.pointsGameplay;
    } else if (type == "CHT") {
      return this.pointsChat;
    } else {
      throw new Error("invalid point selection type");
    }
  }
}
