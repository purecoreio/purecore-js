class MultipleAnalytics {

    public analytics: Array<Analytics>;

    public static fromObject(object: any): MultipleAnalytics {
        let ma = new MultipleAnalytics();
        ma.analytics = new Array<Analytics>();
        for (let i = 0; i < object.analytics.length; i++) {
            const element = object.analytics[i];
            ma.analytics.push(Analytics.fromObject(element));
        }
        return ma;
    }

}