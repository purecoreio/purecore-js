class BillingAddress {
    public name: string;
    public email: string;
    public country: string;
    public state: string;
    public city: string;
    public postalcode: string;
    public line1: string;
    public line2: string;

    public constructor(name: string, email: string, country: string, state: string, city: string, postalCode: string, line1: string, line2: string) {
        this.name = name;
        this.email = email;
        this.city = city;
        this.country = country;
        this.state = state;
        this.postalcode = postalCode;
        this.line1 = line1;
        this.line2 = line2;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
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

    public getPostalCode(): string {
        return this.postalcode;
    }

    public getLine1(): string {
        return this.line1;
    }

    public getLine2(): string {
        return this.line2;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): BillingAddress {
        this.name = array.name;
        this.email = array.email;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        this.postalcode = array.postalcode;
        this.line1 = array.line1;
        this.line2 = array.line2 == "" ? null : array.line2;
        return this;
    }

    public static fromJSON(json: any): BillingAddress {
        return new BillingAddress(
            json.name,
            json.email,
            json.country,
            json.state,
            json.city,
            json.postalcode,
            json.line1,
            json.line2 == "" ? null : json.line2
        );
    }
}
