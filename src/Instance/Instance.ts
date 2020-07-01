class Instance extends Core {
  core: Core;
  uuid: string;
  name: string;
  type: string;

  constructor(core: Core, uuid: string, name: string, type: string) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.name = name;
    this.type = type;
  }

  public async closeOpenConnections(): Promise<Array<Connection>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/connections/close/all/"
      )
      .then((jsonresponse) => {
        var connectionList = new Array<Connection>();
        jsonresponse.forEach((connectionJson) => {
          var connection = new Connection(main.core).fromArray(connectionJson);
          connectionList.push(connection);
        });
        return connectionList;
      });
  }

  public async getOpenConnections(): Promise<Array<Connection>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/connections/open/list/"
      )
      .then((jsonresponse) => {
        var connectionList = new Array<Connection>();
        jsonresponse.forEach((connectionJson) => {
          var connection = new Connection(main.core).fromArray(connectionJson);
          connectionList.push(connection);
        });
        return connectionList;
      });
  }

  public async getGrowthAnalytics(
    span = 3600 * 24
  ): Promise<Array<GrowthAnalytic>> {
    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
          span: span,
        },
        "instance/growth/analytics/"
      )
      .then((jsonresponse) => {
        var growthAnalytics = new Array<GrowthAnalytic>();
        jsonresponse.forEach((growthAnalyticJSON) => {
          var growthAnalytic = new GrowthAnalytic().fromArray(
            growthAnalyticJSON
          );
          growthAnalytics.push(growthAnalytic);
        });
        return growthAnalytics;
      });
  }

  public async delete(): Promise<boolean> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/delete/"
      )
      .then(() => {
        return true;
      });
  }

  public async getKeys(): Promise<Array<Key>> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/key/list/"
      )
      .then((jsonresponse) => {
        var keyList = new Array<Key>();
        jsonresponse.forEach((jsonKey) => {
          keyList.push(new Key(main.core).fromArray(jsonKey));
        });
        return keyList;
      });
  }

  public getName() {
    return this.name;
  }

  public getId() {
    return this.uuid;
  }

  public asNetwork(): Network {
    return new Network(this.core, this);
  }

  public update(): Promise<Instance> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/key/list/"
      )
      .then((jsonresponse) => {
        if (jsonresponse.server == null) {
          main.type = "NTW";
          main.uuid = jsonresponse.network.uuid;
          main.name = jsonresponse.network.name;
        } else {
          main.type = "SVR";
          main.uuid = jsonresponse.server.uuid;
          main.name = jsonresponse.server.name;
        }
        return main;
      });
  }
}
