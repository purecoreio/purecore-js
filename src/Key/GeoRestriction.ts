class GeoRestriction {

    public index: string;
    public country: string;
    public state: string;
    public city: string;

    public constructor(index?: string, country?: string, state?: string, city?: string) {
        this.index = index;
        this.country = country;
        this.state = state;
        this.city = city;
    }

    public fromArray(array): GeoRestriction {
        this.index = array.index;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        return this;
    }

    public getIndex(): string {
        return this.index
    }

    public getCountry(): string {
        return this.country;
    }

    public getState(): string {
        return this.state;
    }

    public getCity(): string {
        return this.city;
    }

}