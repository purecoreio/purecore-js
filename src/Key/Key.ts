class Key extends Core {
  public core: Core;
  public type: string;
  public uuid: string;
  public hash: string;
  public instance: Instance;

  public restrict: boolean;
  public allowedReferrers: Array<RefererRestriction>;
  public allowedRegions: Array<GeoRestriction>;

  public constructor(
    core: Core,
    type?: string,
    uuid?: string,
    hash?: string,
    instance?: Instance
  ) {
    super(core.getTool());
    this.core = core;
    this.type = type;
    this.uuid = uuid;
    this.hash = hash;
    this.instance = instance;
  }

  public fromArray(array): Key {
    this.type = array.type;
    this.uuid = array.uuid;
    this.hash = array.hash;
    this.instance = new Instance(
      this.core,
      array.instance.uuid,
      array.instance.name,
      array.instance.type
    );

    this.restrict = array.restrict;

    this.allowedReferrers = new Array<RefererRestriction>();
    array.allowedReferrers.forEach((referrerJSON) => {
      this.allowedReferrers.push(
        new RefererRestriction().fromArray(referrerJSON)
      );
    });

    this.allowedRegions = new Array<GeoRestriction>();
    array.allowedRegions.forEach((regionJSON) => {
      this.allowedRegions.push(new GeoRestriction().fromArray(regionJSON));
    });

    return this;
  }

  public async update() {
    var core = this.core;
    let main = this;
    var url;

    if (core.getTool() instanceof Session) {
      url =
        "https://api.purecore.io/rest/2/key/from/id/?hash=" +
        core.getCoreSession().getHash() +
        "&keyid=" +
        main.uuid;
    } else {
      url =
        "https://api.purecore.io/rest/2/key/from/hash/?key=" + core.getKey();
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
            return new Key(core).fromArray(jsonresponse);
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async setRestrict(restrict: boolean) {
    var core = this.core;
    let main = this;
    var url;

    var enableStr = "false";
    if (restrict) {
      enableStr = "true";
    }

    if (core.getTool() instanceof Session) {
      url =
        "https://api.purecore.io/rest/2/key/restriction/enable/?hash=" +
        core.getCoreSession().getHash() +
        "&keyid=" +
        main.uuid +
        "&enable=" +
        enableStr;
    } else {
      url =
        "https://api.purecore.io/rest/2/key/restriction/enable/?key=" +
        core.getKey() +
        "&keyid=" +
        main.uuid +
        "&enable=" +
        enableStr;
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
            return new Key(core).fromArray(jsonresponse);
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async addReferer(ipOrHostname: string) {
    var core = this.core;
    let main = this;
    var url;

    if (core.getTool() instanceof Session) {
      url =
        "https://api.purecore.io/rest/2/key/restriction/host/add/?hash=" +
        core.getCoreSession().getHash() +
        "&keyid=" +
        main.uuid +
        "&host=" +
        ipOrHostname;
    } else {
      url =
        "https://api.purecore.io/rest/2/key/restriction/host/add/?key=" +
        core.getKey() +
        "&keyid=" +
        main.uuid +
        "&host=" +
        ipOrHostname;
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
            return new RefererRestriction().fromArray(jsonresponse);
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async removeReferer(index: string) {
    var core = this.core;
    let main = this;
    var url;

    if (core.getTool() instanceof Session) {
      url =
        "https://api.purecore.io/rest/2/key/restriction/host/remove/?hash=" +
        core.getCoreSession().getHash() +
        "&keyid=" +
        main.uuid +
        "&index=" +
        index;
    } else {
      url =
        "https://api.purecore.io/rest/2/key/restriction/host/remove/?key=" +
        core.getKey() +
        "&keyid=" +
        main.uuid +
        "&index=" +
        index;
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
            return new RefererRestriction().fromArray(jsonresponse);
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async addGeo(country: string, state?: string, city?: string) {
    var core = this.core;
    let main = this;
    var url;

    if (core.getTool() instanceof Session) {
      url =
        "https://api.purecore.io/rest/2/key/restriction/geo/add/?hash=" +
        core.getCoreSession().getHash() +
        "&keyid=" +
        main.uuid +
        "&country=" +
        country;
    } else {
      url =
        "https://api.purecore.io/rest/2/key/restriction/geo/add/?key=" +
        core.getKey() +
        "&keyid=" +
        main.uuid +
        "&country=" +
        country;
    }

    if (state != null) {
      url += "&state=" + state;
    }

    if (city != null) {
      url += "&city=" + city;
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
            return new GeoRestriction().fromArray(jsonresponse);
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async removeGeo(index: string) {
    var core = this.core;
    let main = this;
    var url;

    if (core.getTool() instanceof Session) {
      url =
        "https://api.purecore.io/rest/2/key/restriction/geo/remove/?hash=" +
        core.getCoreSession().getHash() +
        "&keyid=" +
        main.uuid +
        "&index=" +
        index;
    } else {
      url =
        "https://api.purecore.io/rest/2/key/restriction/geo/remove/?key=" +
        core.getKey() +
        "&keyid=" +
        main.uuid +
        "&index=" +
        index;
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
            return new GeoRestriction().fromArray(jsonresponse);
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
