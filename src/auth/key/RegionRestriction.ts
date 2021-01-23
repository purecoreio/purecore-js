class RegionRestriction {

    private index;
    private country;
    private state;
    private city;

    public constructor(index?: number, country?: string, state?: string, city?: string) {
        this.index = index;
        this.country = country;
        this.state = state;
        this.city = city;
    }

    public static fromObject(object: any): RegionRestriction {
        let ref = new RegionRestriction();
        ref.index = Number(object.index);
        ref.country = String(object.country);
        ref.state = String(object.state);
        ref.city = String(object.city);
        return ref;
    }

}