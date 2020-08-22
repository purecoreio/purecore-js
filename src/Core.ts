class Core {
  key: string;
  session: Session;
  dev: boolean;

  constructor(tool?: any, dev?) {
    if (dev == null) {
      this.dev = false;
    } else {
      this.dev = dev;
    }
    if (tool != undefined) {
      if (typeof tool == "string") {
        this.key = tool;
      } else if (typeof tool == "object") {
        if (tool instanceof Session) {
          this.session = tool;
        } else {
          this.session = new Session(
            new Core(this.session, this.dev)
          ).fromObject(tool);
        }
      }
    }

    // if not start with fromdiscord or fromtoken
  }

  public getCacheCollection(): CacheCollection {
    return new CacheCollection(this.dev);
  }

  public async requestGlobalHash(): Promise<Array<ConnectionHashGlobal>> {
    let core = this;
    return await new Call(this)
      .commit({}, "session/hash/list/")
      .then((json) => {
        var response = new Array<ConnectionHashGlobal>();
        json.forEach((hashData) => {
          var hash = new ConnectionHashGlobal(core);
          response.push(hash.fromObject(hashData));
        });
        return response;
      });
  }

  public getPlayersFromIds(ids): Array<Player> {
    var playerList = new Array<Player>();
    ids.forEach((id) => {
      playerList.push(new Player(this, id));
    });
    return playerList;
  }

  public async getMachine(hash: string): Promise<Machine> {
    return await new Call(this)
      .commit({ hash: hash }, "machine")
      .then((data) => { return new Machine(this, hash).fromObject(data) });
  }


  public async fromToken(googleToken: string): Promise<Session> {
    return await new Call(this)
      .commit({ token: googleToken }, "session/from/google")
      .then(json => {
        const session: Session = new Session(this).fromObject(json);
        this.session = session;
        return session;
      });
  }

  public asBillingAddress(array): BillingAddress {
    return new BillingAddress().fromObject(array);
  }

  public getWorkbench(): Workbench {
    return new Workbench();
  }

  public async pushFCM(token: string): Promise<boolean> {
    return await new Call(this)
      .commit({ token: token }, "account/push/fcm")
      .then(() => true);
  }

  public getTool() {
    if (this.key != null && this.key != undefined) {
      return this.key;
    } else {
      return this.session;
    }
  }

  public getCoreSession() {
    return this.session;
  }

  public getLegacyKey(): Key {
    return new Key(this, "UNK", null, this.key, null);
  }

  public getKey() {
    if (this.key == undefined) {
      return null;
    } else {
      return this.key;
    }
  }

  public getHostingManager(): HostingManager {
    return new HostingManager(this);
  }

  public getElements() {
    return new Elements(this);
  }

  public getInstance(instanceId, name?, type?): Instance {
    return new Instance(this, instanceId, name, type);
  }

  public getCore(): Core {
    return this;
  }

  public async fromDiscord(guildId: string, botToken: string, devkey: boolean): Promise<Core> {
    let params: any = {
      guildid: guildId,
      token: botToken
    };

    if (devkey) params.devkey = true;

    return await new Call(this)
      .commit(params, "key/from/discord")
      .then(json => {
        this.key = json.hash;
        return this;
      });
  }
}

try {
  module.exports = Core;
  const fetch = require('node-fetch');
  if (!global.fetch) {
    global.fetch = fetch;
  }
} catch (error) {
  console.log(
    "[corejs] starting plain vanilla instance, as nodejs exports were not available"
  );
}
