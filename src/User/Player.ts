class Player extends Core {
  core: Core;
  id: string;
  username: string;
  uuid: string;
  verified;

  constructor(
    core: Core,
    id: string,
    username?: string,
    uuid?: string,
    verified?
  ) {
    super(core.getKey(), core.dev);
    this.core = core;
    this.id = id;
    this.username = username;
    this.uuid = uuid;
    this.verified = verified;
  }

  public async closeConnections(
    instance: Instance
  ): Promise<Array<Connection>> {
    var core = this.core;

    return await new Call(core)
      .commit({ instance: instance.getId() }, "connection/close/all/")
      .then(function (jsonresponse) {
        var connectionsClosed = new Array<Connection>();
        jsonresponse.forEach((connectionJson) => {
          connectionsClosed.push(
            new Connection(core).fromArray(connectionJson)
          );
        });
        return connectionsClosed;
      });
  }

  public async openConnection(
    ip: string,
    instance: Instance
  ): Promise<Connection> {
    var core = this.core;

    return await new Call(core)
      .commit(
        {
          instance: instance.getId(),
          ip: ip,
          username: this.username,
          uuid: this.uuid,
        },
        "connection/new/"
      )
      .then(function (jsonresponse) {
        return new Connection(core).fromArray(jsonresponse);
      });
  }

  public async getBillingAddress(): Promise<BillingAddress> {
    var core = this.core;

    return await new Call(core)
      .commit({}, "player/billing/get/")
      .then(function (jsonresponse) {
        return new BillingAddress().fromArray(jsonresponse);
      });
  }

  public async getPunishments(
    network?: Network,
    page?
  ): Promise<Array<Punishment>> {
    var id = this.id;
    var core = this.core;
    var queryPage = 0;

    if (page != undefined || page != null) {
      queryPage = page;
    }

    var args = {};
    if (network != null) {
      args = {
        page: page,
        player: id,
        network: network.getId(),
      };
    } else {
      args = {
        player: id,
        page: page,
      };
    }

    return await new Call(core)
      .commit(args, "player/punishment/list/")
      .then(function (jsonresponse) {
        var punishments = new Array<Punishment>();
        jsonresponse.forEach((punishmentJson) => {
          punishments.push(new Punishment(core).fromArray(punishmentJson));
        });
        return punishments;
      });
  }

  public async getPayments(store: Store, page?): Promise<Array<Payment>> {
    var id = this.id;
    var core = this.core;
    var queryPage = 0;

    if (page != undefined || page != null) {
      queryPage = page;
    }

    return await new Call(core)
      .commit(
        {
          network: store.getNetwork().getId(),
          page: queryPage,
          player: id,
        },
        "player/payment/list/"
      )
      .then(function (jsonresponse) {
        var payments = new Array<Payment>();
        jsonresponse.forEach((paymentJson) => {
          payments.push(new Payment(core).fromArray(paymentJson));
        });
        return payments;
      });
  }

  public async getDiscordId(): Promise<String> {
    return await new Call(this.core)
      .commit({}, "player/payment/list/")
      .then(function (jsonresponse) {
        return String(jsonresponse.id);
      });
  }

  public async getConnections(
    instance: Instance,
    page?
  ): Promise<Array<Connection>> {
    var id = this.id;
    var core = this.core;
    var queryPage = 0;

    if (page != undefined || page != null) {
      queryPage = page;
    }

    var args = {};
    if (instance != null) {
      args = { page: queryPage, player: id, instance: instance.getId() };
    } else {
      args = { page: queryPage, player: id };
    }

    return await new Call(this.core)
      .commit({}, "player/connection/list/")
      .then(function (jsonresponse) {
        var connections = new Array<Connection>();
        jsonresponse.forEach((connectionJson) => {
          connections.push(new Connection(core).fromArray(connectionJson));
        });
        return connections;
      });
  }

  public async getMatchingConnections(
    instance: Instance,
    page?,
    playerList?: Array<Player>
  ): Promise<Array<ActivityMatch>> {
    var id = this.id;
    var queryPage = 0;
    var playerListIds = [];
    playerList.forEach((player) => {
      playerListIds.push(player.getId());
    });

    if (page != undefined || page != null) {
      queryPage = page;
    }

    return await new Call(this.core)
      .commit(
        {
          instance: instance.getId(),
          page: queryPage,
          players: JSON.stringify(playerListIds),
          player: id,
        },
        "connection/list/match/players/"
      )
      .then(function (jsonresponse) {
        var activityMatch = new Array<ActivityMatch>();

        jsonresponse.forEach((activity) => {
          var matchingRanges = new Array<MatchingRange>();
          activity.matchList.forEach((matchingRangeJson) => {
            var matchingRange = new MatchingRange(
              new Date(matchingRangeJson.startedOn * 1000),
              new Date(matchingRangeJson.finishedOn * 1000),
              matchingRangeJson.matchWith
            );
            matchingRanges.push(matchingRange);
          });

          activityMatch.push(
            new ActivityMatch(
              new Date(activity.startedOn * 1000),
              new Date(activity.finishedOn * 1000),
              activity.activity,
              matchingRanges
            )
          );
        });

        return activityMatch;
      });
  }

  getId() {
    return this.id;
  }

  getUuid() {
    return this.uuid;
  }

  getUsername() {
    return this.username;
  }
}
