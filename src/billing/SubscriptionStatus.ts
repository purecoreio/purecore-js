class SubscriptionStatus {

    public subbed: boolean;
    public usedTrial: Date;

    public static fromObject(object: any): SubscriptionStatus {
        let ss = new SubscriptionStatus();
        ss.subbed = Boolean(object.subbed);
        ss.usedTrial = Util.date(object.usedTrial);
        return ss;
    }

    public isSubbed() {
        return this.subbed;
    }

    public didUseTrial() {
        return this.usedTrial != null;
    }

}