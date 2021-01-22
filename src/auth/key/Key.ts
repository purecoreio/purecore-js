class Key implements AuthMethod {

    private type: KeyType;
    private hash: string;
    private id: string;

    private restrict: boolean;
    private allowedReferrers: Array<RefererRestriction>;
    private allowedRegions: Array<RegionRestriction>;

    public constructor(hash: string, id?: string, type?: KeyType, restrict?: boolean, allowedReferrers?: Array<RefererRestriction>, allowedRegions?: Array<RegionRestriction>) {
        this.hash = hash;
        this.id = id;
        this.type = type;
        this.restrict = restrict;
        this.allowedReferrers = allowedReferrers;
        this.allowedRegions = allowedRegions;
    }

    public getCredentials(): string {
        return this.hash;
    }

    public getParam(): string {
        return Param.Key;
    }

    public static fromObject(object: any): Key {
        if ('hash' in object) {
            let key = new Key(String(object.hash));

            if ('id' in object) {
                key.id = String(object.id);
            }
            if ('restrict' in object) {
                key.restrict = Boolean(object.restrict);
            }
            if ('allowedReferrers' in object) {
                key.allowedReferrers = new Array<RefererRestriction>();
                if (Array.isArray(object.allowedReferrers)) {
                    for (let i = 0; i < object.allowedReferrers.length; i++) {
                        const refererData = object.allowedReferrers[i];
                        key.allowedReferrers.push(RefererRestriction.fromObject(refererData));
                    }
                }
            }
            if ('allowedRegions' in object) {
                key.allowedRegions = new Array<RegionRestriction>();
                if (Array.isArray(object.allowedRegions)) {
                    for (let i = 0; i < object.allowedRegions.length; i++) {
                        const regionData = object.allowedRegions[i];
                        key.allowedRegions.push(RegionRestriction.fromObject(regionData));
                    }
                }
            }

            return key;
        } else {
            throw new MissingProp('hash');
        }
    }

}