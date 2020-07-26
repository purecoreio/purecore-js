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

  public fromObject(array): Key {
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
        new RefererRestriction().fromObject(referrerJSON)
      );
    });

    this.allowedRegions = new Array<GeoRestriction>();
    array.allowedRegions.forEach((regionJSON) => {
      this.allowedRegions.push(new GeoRestriction().fromObject(regionJSON));
    });

    return this;
  }

  public async update(): Promise<Key> {
    let main = this;
    return new Call(this.core)
      .commit(
        {
          keyid: this.uuid,
        },
        "key/from/id/"
      )
      .then((jsonresponse) => {
        return new Key(main.core).fromObject(jsonresponse);
      });
  }

  public async setRestrict(restrict: boolean): Promise<Key> {
    let main = this;

    var enableStr = "false";
    if (restrict) {
      enableStr = "true";
    }

    return new Call(this.core)
      .commit(
        {
          keyid: this.uuid,
          enable: enableStr,
        },
        "key/restriction/enable/"
      )
      .then((jsonresponse) => {
        return new Key(main.core).fromObject(jsonresponse);
      });
  }

  public async addReferer(ipOrHostname: string): Promise<RefererRestriction> {
    return new Call(this.core)
      .commit(
        {
          keyid: this.uuid,
          host: ipOrHostname,
        },
        "key/restriction/host/add/"
      )
      .then((jsonresponse) => {
        return new RefererRestriction().fromObject(jsonresponse);
      });
  }

  public async removeReferer(index: string): Promise<RefererRestriction> {
    return new Call(this.core)
      .commit(
        {
          keyid: this.uuid,
          index: index,
        },
        "restriction/host/remove/"
      )
      .then((jsonresponse) => {
        return new RefererRestriction().fromObject(jsonresponse);
      });
  }

  public async addGeo(
    country: string,
    state?: string,
    city?: string
  ): Promise<GeoRestriction> {
    var args = {};
    args["keyid"] = this.uuid;
    args["country"] = country;

    if (state != null) {
      args["state"] = state;
    }

    if (city != null) {
      args["city"] = city;
    }

    return new Call(this.core)
      .commit(args, "restriction/geo/add/")
      .then((jsonresponse) => {
        return new GeoRestriction().fromObject(jsonresponse);
      });
  }

  public async removeGeo(index: string): Promise<GeoRestriction> {
    return new Call(this.core)
      .commit(
        {
          keyid: this.uuid,
          index: index,
        },
        "key/restriction/geo/remove/"
      )
      .then((jsonresponse) => {
        return new GeoRestriction().fromObject(jsonresponse);
      });
  }
}
