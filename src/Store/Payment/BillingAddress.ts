class BillingAddress {

    name: string;
    email: string;
    country: string;
    state: string;
    city: string;
    postalcode: string;
    line1: string;
    line2: string;

    constructor(name?: string, email?: string, country?: string, state?: string, city?: string, postalcode?: string, line1?: string, line2?: string) {
        this.name = name;
        this.email = email;
        this.city = city;
        this.country = country;
        this.state = state;
        this.postalcode = postalcode;
        this.line1 = line1;
        this.line2 = line2;
    }

    public fromArray(array): BillingAddress {
        this.name = array.name;
        this.email = array.email;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        this.postalcode = array.postalcode;
        this.line1 = array.line1;
        if (array.line2 != null && array.line2 != "") {
            this.line2 = array.line2;
        } else {
            this.line2 = null;
        }
        return this;
    }

}