class ConnectionLocation {
    public city: string;
    public region: string;
    public country: string;
    public lat: number;
    public long: number;

    public constructor(city?: string, region?: string, country?: string, lat?: number, long?: number) {
        this.city = city;
        this.region = region;
        this.country = country;
        this.lat = lat;
        this.long = long;
    }

    public getCity(): string {
        return this.city;
    }

    public getRegion(): string {
        return this.region;
    }

    public getCountry(): string {
        return this.country;
    }

    public getLat(): number {
        return this.lat;
    }

    public getLong(): number {
        return this.long;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): ConnectionLocation {
        this.city = array.city;
        this.region = array.region;
        this.country = array.country;
        this.lat = array.lat;
        this.long = array.long;
        return this;
    }

    public static fromJSON(json: any): ConnectionLocation {
        return new ConnectionLocation(
            json.city,
            json.region,
            json.country,
            json.lat,
            json.long
        );
    }
}
