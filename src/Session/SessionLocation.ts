class SessionLocation {
    public city: string;
    public state: string;
    public country_code: string;
    public os: string;

    public constructor(city?: string, state?: string, country_code?: string) {
        this.city = city;
        this.state = state;
        this.country_code = country_code;
    }

    public getCity(): string {
        return this.city;
    }

    public getState(): string {
        return this.state;
    }

    public getCountry(): string {
        return this.country_code;
    }

    public getOs(): string {
        return this.os;
    }

    public static fromJSON(json: any): SessionLocation {
        return new SessionLocation(
            json.city,
            json.state,
            json.country_code
        );
    }
}
