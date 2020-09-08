class Instance extends Core {
  core: Core;
  uuid: string;
  name: string;
  type: string;

  constructor(core: Core, uuid?: string, name?: string, type?: string) {
    super(core.getTool());
    this.core = core;
    this.uuid = uuid;
    this.name = name;
    this.type = type;
  }

  public fromObject(object): Instance {
    this.uuid = object.uuid;
    this.name = object.name;
    this.type = object.type;
    return this;
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
          var connection = new Connection(main.core).fromObject(connectionJson);
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
          var connection = new Connection(main.core).fromObject(connectionJson);
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
          var growthAnalytic = new GrowthAnalytic().fromObject(
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
          keyList.push(new Key(main.core).fromObject(jsonKey));
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

  public async getPendingExecutions(type?: string, page?: number, exclude?: Array<Instance>) {
    if (page == null) page = 0;
    if (type == null) type = "any";
    if (exclude == null) exclude = new Array<Instance>();

    let ids = new Array<String>();
    exclude.forEach(excludedInstance => {
      ids.push(excludedInstance.uuid);
    });

    var args = {};
    if (ids.length > 0) {
      args = {
        instance: this.uuid,
        page: page.toString(),
        type: type,
        excluded: JSON.stringify(ids)
      };
    } else {
      args = {
        instance: this.uuid,
        page: page.toString(),
        type: type,
      };
    }

    return new Call(this.core)
      .commit(
        args,
        "cmds/get/pending/"
      )
      .then((jsonresponse) => {
        let executions = new Array<Execution>();
        jsonresponse.forEach(jsonObject => {
          executions.push(new Execution(this.core).fromObject(jsonObject));
        });
        return executions;
      });
  }

  public async getHost(): Promise<Host> {
    let main = this;
    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/get/host/"
      )
      .then((jsonresponse) => {
        return new Host(main.core).fromObject(jsonresponse);
      });

  }

  public async getHostAuth(): Promise<HostAuth> {
    let main = this;
    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/get/host/auth/"
      )
      .then((jsonresponse) => {
        return new HostAuth(main.core).fromObject(jsonresponse);
      });

  }

  public async update(): Promise<Instance> {
    let main = this;

    return new Call(this.core)
      .commit(
        {
          instance: this.uuid,
        },
        "instance/info/"
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
