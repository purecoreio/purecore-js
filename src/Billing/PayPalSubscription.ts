class PayPalSubscription {
    public url: string;
    public id: string;

    public constructor(url: string, id: string) {
        this.url = url;
        this.id = id;
    }

    public getURL(): string {
        return this.url;
    }

    public getID(): string {
        return this.id;
    }

    public static fromJSON(json: any): PayPalSubscription {
        return new PayPalSubscription(
            json.url,
            json.id
        )
    }
}
