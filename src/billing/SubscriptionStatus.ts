class SubscriptionStatus {

    public plus: boolean;
    public plusGateway: number;
    public plusReview: boolean;
    public hostingGateway: number;
    public hostingReview: boolean;
    public usedTrial: Date;

    public static fromObject(object: any): SubscriptionStatus {
        let ss = new SubscriptionStatus();
        ss.plus = Boolean(object.plus);
        ss.plusReview = Boolean(object.plusReview);
        ss.plusGateway = Number(object.plusGateway);
        ss.hostingReview = Boolean(object.hostingReview);
        ss.hostingGateway = Number(object.hostingGateway);
        ss.usedTrial = Util.date(object.usedTrial);
        return ss;
    }

    public isSubbed() {
        return this.plus;
    }

    public didUseTrial() {
        return this.usedTrial != null;
    }

}