class MultipleAnalytics {

    public analytics: Array<Analytics>;

    public static fromObject(object: any, type: AnalyticType): MultipleAnalytics {
        let ma = new MultipleAnalytics();
        ma.analytics = new Array<Analytics>();
        for (let i = 0; i < object.analytics.length; i++) {
            const element = object.analytics[i];
            ma.analytics.push(Analytics.fromObject(element, type));
        }
        return ma;
    }

    public fill(): MultipleAnalytics {
        let final = new Array<Analytics>();
        for (let i = 0; i < this.analytics.length; i++) {
            final.push(this.analytics[i].fill())
        }
        this.analytics = final;
        return this;
    }

}