class InstanceCache extends Core {
  public createdOn: Date;
  public instance: Instance;

  public connections: Array<Connection>;
  public consoleLines: Array<ConsoleLine>;
  public instanceVitals: Array<InstanceVital>;

  constructor(
    credentials: Core,
    instance: Instance,
    skipFill: boolean = false,
    consoleLines?: Array<ConsoleLine>,
    instanceVitals?: Array<InstanceVital>,
    instanceConnections?: Array<Connection>,
    createdOn?: Date
  ) {
    super(credentials.getTool());

    // ensure valid credentials on the instance object
    var securedInstance = instance;
    securedInstance.core = credentials;
    this.instance = securedInstance;

    // check optional values

    if (consoleLines != null) {
      this.consoleLines = consoleLines;
    } else {
      this.consoleLines = new Array<ConsoleLine>();
    }

    if (instanceVitals != null) {
      this.instanceVitals = instanceVitals;
    } else {
      this.instanceVitals = new Array<InstanceVital>();
    }

    if (instanceConnections != null) {
      this.connections = instanceConnections;
    } else {
      this.connections = new Array<Connection>();
    }

    if (createdOn != null) {
      this.createdOn = createdOn;
    } else {
      this.createdOn = new Date();
    }

    if (!skipFill) {
      this.update();
    }
  }

  public createLine(string: string): void {
    new ConsoleLine(new Date(), LineType.INFO, string);
  }

  public async connectPlayer(ip, uuid, username) {
    let main = this;
    var player = new Player(this.instance.core, null, username, uuid);
    return await player
      .openConnection(ip, this.instance)
      .then(function (connection) {
        main.pushConnection(connection);
        return connection;
      })
  }

  public async disconnectPlayer(uuid, username?) {
    let main = this;
    var player = new Player(this.instance.core, null, username, uuid, false);
    return await player
      .closeConnections(this.instance)
      .then(function (closedConnections) {
        var newConnections = new Array<Connection>();
        main.connections.forEach((connection) => {
          var match = false;
          closedConnections.forEach((closedConnection) => {
            if (connection.uuid == closedConnection.uuid) {
              match = true;
            }
          });
          if (!match) {
            newConnections.push(connection);
          }
        });
        main.connections = newConnections;
        return closedConnections;
      });
  }

  public pushConnection(connection: Connection): void {
    this.connections.push(connection);
  }

  public pushLine(consoleLine: ConsoleLine): void {
    this.consoleLines.push(consoleLine);
  }

  public pushVital(instanceVital: InstanceVital): void {
    this.instanceVitals.push(instanceVital);
  }

  async update() {
    // updates data from the instance if it hasn't been pushed before
    let main = this;
    /*return await this.instance
      .getOpenConnections()
      .then(function (connections) {
        main.connections = connections;
      });*/
  }

  async flush() {
    let main = this;
    return await this.instance.closeOpenConnections().then(function () {
      main.connections = new Array<Connection>();
      main.consoleLines = new Array<ConsoleLine>();
      main.instanceVitals = new Array<InstanceVital>();
    });
  }
}
