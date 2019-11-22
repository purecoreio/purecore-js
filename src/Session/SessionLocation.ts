class SessionLocation {

    city: string;
    state: string;
    country_code: string;
    os: string;

    constructor(city?: string, state?: string, country_code?: string) {
        this.city = city;
        this.state = state;
        this.country_code = country_code;
    }
}