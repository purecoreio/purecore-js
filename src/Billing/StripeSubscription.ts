class StripeSubscription {

    public id;

    public constructor(id: string) {
        this.id = id;
    }

    public getID() {
        return this.id;
    }

}