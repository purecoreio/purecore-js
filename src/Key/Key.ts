class Key extends Core {
    public core: Core;
    public type: string;
    public uuid: string;
    public hash: string;
    public instance: Instance;

    public restrict: boolean;
    public allowedReferrers: Array<RefererRestriction>;
    public allowedRegions: Array<GeoRestriction>;

    public constructor(core: Core, type?: string, uuid?: string, hash?: string, instance?: Instance, restrict?: boolean, allowedReferrers?: Array<RefererRestriction>, allowedRegions?: Array<GeoRestriction>) {
        super(core.getTool());
        this.core = core;
        this.type = type;
        this.uuid = uuid;
        this.hash = hash;
        this.instance = instance;
    }

    public getType(): string {
        return this.type;
    }

    public getId(): string {
        return this.uuid;
    }

    public getHash(): string {
        return this.hash;
    }

    public getInstance(): Instance {
        return this.instance;
    }

    public isRestricted(): boolean {
        return this.restrict;
    }

    public getAllowedReferrers(): Array<RefererRestriction> {
        return this.allowedReferrers;
    }

    public getAllowedRegions(): Array<GeoRestriction> {
        return this.allowedRegions;
    }

    public async update(): Promise<Key> {
        return new Call(this.core)
            .commit(
                {
                    keyid: this.uuid,
                },
                "key/from/id/"
            )
            .then(json => Key.fromJSON(this.core, json));
    }

    public async setRestrict(restrict: boolean): Promise<Key> {
        return new Call(this.core)
            .commit(
                {
                    keyid: this.uuid,
                    enable: restrict,
                },
                "key/restriction/enable/"
            )
            .then(json => Key.fromJSON(this.core, json));
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
            .then(json => RefererRestriction.fromJSON(json));
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
            .then(json => RefererRestriction.fromJSON(json));
    }

    public async addGeo(country: string, state?: string, city?: string): Promise<GeoRestriction> {
        const args = {};
        args["keyid"] = this.uuid;
        args["country"] = country;

        if (state != null) args["state"] = state;
        if (city != null) args["city"] = city;

        return new Call(this.core)
            .commit(args, "restriction/geo/add/")
            .then(json => GeoRestriction.fromJSON(json));
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
            .then(json => GeoRestriction.fromJSON(json));
    }

    /**
     * @deprecated use static method fromJSON
     */
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
        this.allowedReferrers = array.allowedReferrers.map(RefererRestriction.fromJSON);
        this.allowedRegions = array.allowedRegions.map(GeoRestriction.fromJSON);

        return this;
    }

    public static fromJSON(core: Core, json: any): Key {
        return new Key(
            core,
            json.type,
            json.uuid,
            json.hash,
            new Instance(
                core,
                json.instance.uuid,
                json.instance.name,
                json.instance.type
            ),
            json.restrict,
            json.allowedReferrers.map(RefererRestriction.fromJSON),
            json.allowedRegions.map(GeoRestriction.fromJSON)
        );
    }
}
