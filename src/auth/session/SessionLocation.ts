class SessionLocation {

    private city: string;
    private state: string;
    private country: string;

    public constructor(city?: string, state?: string, country?: string) {
        this.city = city;
        this.state = state;
        this.country = country;
    }

    public asObject(): any {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }

    public static fromObject(object: any): SessionLocation {
        let loc = new SessionLocation();
        loc.city = String(object.city);
        loc.state = String(object.state);
        loc.country = String(object.country);
        return loc;
    }

}