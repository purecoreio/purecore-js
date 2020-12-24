class Analytics {

    public list: Array<Analytic>;
    public base: string;

    public static fromObject(object: any): Analytics {
        let analytics = new Analytics();
        analytics.list = new Array<Analytic>();
        analytics.base = object.base;
        for (let i = 0; i < object.list.length; i++) {
            const element = object.list[i];
            if ('totalPayments' in element) {
                analytics.list.push(RevenueAnalytic.fromObject(element));
            }
        }
        return analytics;
    }

    public getTotal(fieldName: string): number {
        let total = 0;
        for (let i = 0; i < this.list.length; i++) {
            const element = this.list[i];
            total += Number(element.asObject()[fieldName]);
        }
        return total;
    }

}