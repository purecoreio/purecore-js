class Address {
    public name: string;
    public email: string;
    public country: string;
    public state: string;
    public city: string;
    public postalCode: string;
    public line1: string;
    public line2: string;

    public constructor(name?: string, email?: string, country?: string, state?: string, city?: string, postalCode?: string, line1?: string, line2?: string) {
        this.name = name;
        this.email = email;
        this.country = country;
        this.state = state;
        this.city = city;
        this.postalCode = postalCode;
        this.line1 = line1;
        this.line2 = line2;
    }

    public static fromObject(object: any): Address {
        let address = new Address();
        address.name = (object.name == null ? null : String(object.name))
        address.email = (object.email == null ? null : String(object.email))
        address.country = (object.country == null ? null : String(object.country))
        address.state = (object.state == null ? null : String(object.state))
        address.city = (object.city == null ? null : String(object.city))
        address.postalCode = (object.postalcode == null ? null : String(object.postalcode))
        address.line1 = (object.line1 == null ? null : String(object.line1))
        address.line2 = (object.name == null ? null : String(object.line2))
        return object;
    }

    public asObject(): any {
        let obj = {}
        if (this.name != null) {
            obj["name"] = this.name
        }
        if (this.email != null) {
            obj["email"] = this.email
        }
        if (this.state != null) {
            obj["state"] = this.state
        }
        if (this.city != null) {
            obj["city"] = this.city
        }
        if (this.postalCode != null) {
            obj["postalcode"] = this.postalCode
        }
        if (this.line1 != null) {
            obj["line1"] = this.line1
        }
        if (this.line2 != null) {
            obj["line2"] = this.line2
        }
        return obj;
    }

    public asQuery(): string {
        return JSON.stringify(this.asObject());
    }

}