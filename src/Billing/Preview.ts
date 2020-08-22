class BillingPreview {

    public now: number;
    public days: number;
    public monthly: number;

    public constructor(now?: number, days?: number, monthly?: number) {
        this.now = now;
        this.days = days;
        this.monthly = monthly;
    }

    public fromObject(object: any): BillingPreview {
        this.now = object.now;
        this.days = object.days;
        this.monthly = object.monthly;
        return this;
    }


}