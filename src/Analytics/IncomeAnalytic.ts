class IncomeAnalytic {
  public uuid;
  public store;
  public finalIncome;
  public payments;
  public potentialIncome;
  public paymentRequests;
  public timestamp;

  public constructor(
    uuid: string = null,
    store: Store = null,
    finalIncome = 0,
    payments = 0,
    potentialIncome = 0,
    paymentRequests = 0,
    timestamp = 0
  ) {
    this.uuid = uuid;
    this.store = store;
    this.finalIncome = finalIncome;
    this.payments = payments;
    this.potentialIncome = potentialIncome;
    this.paymentRequests = paymentRequests;
    this.timestamp = timestamp * 1000;
  }

  public getLegacy(): Analytic {
    return new Analytic(this.timestamp, this, this.getFields());
  }

  public fromObject(array): IncomeAnalytic {
    this.uuid = array.uuid;
    this.store = null;
    this.finalIncome = array.finalIncome;
    this.payments = array.payments;
    this.potentialIncome = array.potentialIncome;
    this.paymentRequests = array.paymentRequests;
    this.timestamp = array.timestamp * 1000;
    return this;
  }

  public getFields(): Array<AnalyticField> {
    var result = new Array<AnalyticField>();
    result.push(new AnalyticField(this.finalIncome, "Income", "income"));
    result.push(
      new AnalyticField(this.payments, "Payment Count", "paymentCount")
    );
    result.push(
      new AnalyticField(
        this.potentialIncome,
        "Potential Income",
        "potentialIncome"
      )
    );
    result.push(
      new AnalyticField(
        this.paymentRequests,
        "Potential Payment Count",
        "potentialPaymentCount"
      )
    );
    return result;
  }
}
