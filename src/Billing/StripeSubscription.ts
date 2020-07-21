class StripeSubscription {
    public id: string;

    public constructor(id: string) {
        this.id = id;
    }

    public getID(): string {
        return this.id;
    }

    public static fromJSON(json: any): StripeSubscription {
        return new StripeSubscription(json.id);
    }
}
