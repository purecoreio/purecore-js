class RevenueAnalytic implements Analytic {

    public creation: Date;
    public distinctCustomers: number;
    public totalRequests: number;
    public totalPayments: number;
    public totalRequested: number;
    public totalPaid: number;
    public totalDiscounted: number;
    public totalPotentialDiscount: number;
    public totalTaxes: number;
    public totalDisputed: number;
    public totalRefunded: number;
    public totalNet: number;
    public totalGross: number;
    public currency: string;

    public static fromObject(object: any): RevenueAnalytic {
        let revenue = new RevenueAnalytic();
        revenue.creation = Util.date(object.creation);
        revenue.distinctCustomers = Number(object.distinctCustomers)
        revenue.totalRequests = Number(object.totalRequests);
        revenue.totalPayments = Number(object.totalPayments);
        revenue.totalRequested = Number(object.totalRequested);
        revenue.totalPaid = Number(object.totalPaid);
        revenue.totalDiscounted = Number(object.totalDiscounted);
        revenue.totalPotentialDiscount = Number(object.totalPotentialDiscount);
        revenue.totalTaxes = Number(object.totalTaxes);
        revenue.totalDisputed = Number(object.totalDisputed);
        revenue.totalRefunded = Number(object.totalRefunded);
        revenue.totalNet = Number(object.totalNet);
        revenue.totalGross = Number(object.totalGross);
        revenue.currency = String(object.currency);
        return revenue;
    }
    empty(date: Date): RevenueAnalytic {
        this.creation = date;

        this.distinctCustomers = 0;
        this.totalRequests = 0;
        this.totalPayments = 0;
        this.totalRequested = 0;
        this.totalPaid = 0;
        this.totalDiscounted = 0;
        this.totalPotentialDiscount = 0;
        this.totalTaxes = 0;
        this.totalDisputed = 0;
        this.totalRefunded = 0;
        this.totalNet = 0;
        this.totalGross = 0;
        this.currency = null;

        return this;
    }

    asObject(): any {
        return JSON.parse(JSON.stringify(this));
    }

    getCreation(): Date {
        return this.creation;
    }

    getBase(): string {
        return this.currency;
    }

}