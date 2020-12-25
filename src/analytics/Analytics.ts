class Analytics {

    public list: Array<Analytic>;
    public period: number;
    public beggining: Date;
    public base: string;
    public type: AnalyticType;

    public static fromObject(object: any, type: AnalyticType): Analytics {
        let analytics = new Analytics();
        analytics.list = new Array<Analytic>();
        analytics.base = object.base;
        analytics.beggining = Util.date(object.beggining);
        analytics.period = Number(object.period);
        for (let i = 0; i < object.list.length; i++) {
            const element = object.list[i];
            if (type == AnalyticType.Revenue) {
                analytics.list.push(RevenueAnalytic.fromObject(element));
            } else {
                throw new Error("Unknown type");
            }
        }
        analytics.type = type;
        return analytics;
    }

    public fill(until: Date | number = null): Analytics {
        if (until != null && !(until instanceof Date)) {
            until = Util.date(until);
        }
        if (until == null) until = new Date();
        if (until instanceof Date) {

            let unused = this.list.reverse();
            let final = new Array<Analytic>();

            for (let i = this.beggining.getTime() / 1000; i <= until.getTime() / 1000; i += this.period) {
                if (unused.length > 0 && unused[0].getCreation().getTime() / 1000 == i) {
                    final.push(unused[0]);
                    unused.shift();
                } else {
                    if (this.type == AnalyticType.Revenue) {
                        final.push(new RevenueAnalytic().empty(Util.date(i)));
                    }
                }
            }

            this.list = final;
            return this;

        } else {
            throw new Error("Unknown until date");
        }
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