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
          ).fromArray(tool);
        }
      }
    }

    // if not start with fromdiscord or fromtoken
  }

  public getCacheCollection(): CacheCollection {
    return new CacheCollection();
  }

  public getPlans() {
    return new Promise(function (resolve, reject) {
      try {
        return fetch("https://api.purecore.io/rest/2/plan/list/", {
          method: "GET",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonresponse) {
            if ("error" in jsonresponse) {
              throw new Error(jsonresponse.error);
            } else {
              var response = new Array<Plan>();

              jsonresponse.forEach((planData) => {
                var plan = new Plan().fromArray(planData);
                response.push(plan);
              });

              resolve(response);
            }
          })
          .catch(function (error) {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  public requestGlobalHash() {
    return new Promise(function (resolve, reject) {
      try {
        return fetch("https://api.purecore.io/rest/2/session/hash/list/", {
          method: "GET",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonresponse) {
            if ("error" in jsonresponse) {
              throw new Error(jsonresponse.error);
            } else {
              var response = new Array();

              jsonresponse.forEach((hashData) => {
                var hash = new ConnectionHashGlobal(new Core());
                response.push(hash.fromArray(hashData));
              });

              resolve(response);
            }
          })
          .catch(function (error) {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  public getPlayersFromIds(ids): Array<Player> {
    var playerList = new Array<Player>();
    ids.forEach((id) => {
      playerList.push(new Player(this, id));
    });
    return playerList;
  }

  public getMachine(hash) {
    return new Promise(function (resolve, reject) {
      try {
        return fetch("https://api.purecore.io/rest/2/machine/?hash=" + hash, {
          method: "GET",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonresponse) {
            if ("error" in jsonresponse) {
              reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
            } else {
              resolve(new Machine().fromArray(jsonresponse));
            }
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  public fromToken(GoogleToken: string) {
    var obj = this;

    return new Promise(function (resolve, reject) {
      try {
        return fetch(
          "https://api.purecore.io/rest/2/session/from/google/?token=" +
            GoogleToken,
          { method: "GET" }
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            if ("error" in response) {
              throw new Error(response.error + ". " + response.msg);
            } else {
              var session = new Session(new Core(null)).fromArray(response);
              obj.session = session;
              resolve(obj);
            }
          })
          .catch(function (error) {
            throw error;
          });
      } catch (e) {
        reject(e.message);
      }
    });
  }

  public asBillingAddress(array): BillingAddress {
    return new BillingAddress().fromArray(array);
  }

  public getWorkbench(): Workbench {
    return new Workbench();
  }

  public async pushFCM(token: string) {
    var core = this;
    var url;

    if (core.getCoreSession() != null) {
      if (this.getTool() instanceof Session) {
        url =
          "https://api.purecore.io/rest/2/account/push/fcm/?hash=" +
          core.getCoreSession().getHash() +
          "&token=" +
          token;
      }

      try {
        return await fetch(url, { method: "GET" })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonresponse) {
            if ("error" in jsonresponse) {
              throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
            } else {
              return true;
            }
          });
      } catch (e) {
        throw new Error(e.message);
      }
    } else {
      throw new Error("invalid account");
    }
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

  public getElements() {
    return new Elements(this);
  }

  public getInstance(instanceId, name?, type?): Instance {
    return new Instance(this, instanceId, name, type);
  }

  public getCore(): Core {
    return this;
  }

  public async fromDiscord(guildId: string, botToken: string, devkey: boolean) {
    var obj = this;

    return new Promise(function (resolve, reject) {
      try {
        var params = "";

        if (devkey == true) {
          params =
            "?guildid=" + guildId + "&token=" + botToken + "&devkey=true";
        } else {
          params = "?guildid=" + guildId + "&token=" + botToken;
        }

        return fetch(
          "https://api.purecore.io/rest/2/key/from/discord/?token=" + params,
          { method: "GET" }
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            if ("error" in response) {
              throw new Error(response.error + ". " + response.msg);
            } else {
              obj.key = response.hash;
              resolve(obj);
            }
          })
          .catch(function (error) {
            throw error;
          });
      } catch (e) {
        reject(e.message);
      }
    });
  }
}

try {
  module.exports = Core;
} catch (error) {
  console.log(
    "[corejs] starting plain vanilla instance, as nodejs exports were not available"
  );
}
