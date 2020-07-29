class Store extends Network {
  network: Network;

  constructor(network: Network) {
    super(network.core, network.asInstance());
    this.network = network;
  }

  public async getIncomeAnalytics(
    span = 3600 * 24
  ): Promise<Array<IncomeAnalytic>> {
    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          span: span,
        },
        "store/income/analytics/"
      )
      .then((jsonresponse) => {
        var IncomeAnalytics = new Array<IncomeAnalytic>();
        jsonresponse.forEach((IncomeAnalyticJSON) => {
          var IncomeAnalyticD = new IncomeAnalytic().fromObject(
            IncomeAnalyticJSON
          );
          IncomeAnalytics.push(IncomeAnalyticD);
        });
        return IncomeAnalytics;
      });
  }

  public async getItem(id: string): Promise<StoreItem> {
    let core = this.core;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          item: id,
        },
        "store/item/"
      )
      .then((jsonresponse) => {
        return new StoreItem(core).fromObject(jsonresponse);
      });
  }

  public async getPerks(): Promise<Array<Perk>> {
    var core = this.core;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "store/perk/list/"
      )
      .then((jsonresponse) => {
        var perklist = new Array<Perk>();
        jsonresponse.forEach((element) => {
          perklist.push(new Perk(core).fromObject(element));
        });
        return perklist;
      });
  }

  public async getPerkCategories(): Promise<Array<PerkCategory>> {
    var core = this.core;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "store/perk/category/list/"
      )
      .then((jsonresponse) => {
        var perklist = new Array<PerkCategory>();
        jsonresponse.forEach((element) => {
          perklist.push(new PerkCategory(core).fromObject(element));
        });
        return perklist;
      });
  }

  public async getGateways(): Promise<Array<Gateway>> {
    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "store/gateway/list/"
      )
      .then((jsonresponse) => {
        var methods = new Array<Gateway>();
        jsonresponse.forEach((gtw) => {
          var gtf = new Gateway(gtw.name, null, null, null);
          methods.push(gtf);
        });
        return methods;
      });
  }

  public itemIdList(list: Array<StoreItem>): Array<StoreItem> {
    var finalList = new Array<StoreItem>();
    list.forEach((item) => {
      finalList.push(new StoreItem(new Core(), item.uuid));
    });
    return finalList;
  }

  public itemIdListFromJSON(json): Array<StoreItem> {
    var finalList = new Array<StoreItem>();
    json.forEach((item) => {
      finalList.push(new StoreItem(new Core(), item.uuid));
    });
    return finalList;
  }

  getStripeWalletLink() {
    var hash = this.network.core.getCoreSession().getHash();
    var ntwid = this.network.getId();
    return (
      "https://api.purecore.io/link/stripe/wallet/?hash=" +
      hash +
      "&network=" +
      ntwid
    );
  }

  getPayPalWalletLink() {
    var hash = this.network.core.getCoreSession().getHash();
    var ntwid = this.network.getId();
    return (
      "https://api.purecore.io/link/paypal/wallet/?hash=" +
      hash +
      "&network=" +
      ntwid
    );
  }

  public async requestPayment(
    itemList: Array<StoreItem>,
    username: string,
    billingAddress?
  ) {
    if (billingAddress == null) {
      billingAddress = new BillingAddress();
    }

    let core = this.network.core;
    var idList = [];

    itemList.forEach((item) => {
      idList.push(item.uuid);
    });

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          username: username,
          products: escape(JSON.stringify(idList)),
          billing: JSON.stringify(billingAddress),
        },
        "payment/request/"
      )
      .then((jsonresponse) => {
        return new CorePaymentRequest(core).fromObject(jsonresponse);
      });
  }

  getNetwork(): Network {
    return this.network;
  }

  public async getPayments(page?): Promise<Array<Payment>> {
    var core = this.network.core;
    var queryPage = 0;

    if (page != undefined || page != null) {
      queryPage = page;
    }

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          page: page,
        },
        "/payment/list/"
      )
      .then((jsonresponse) => {
        var payments = new Array<Payment>();

        jsonresponse.forEach((paymentJson) => {
          payments.push(new Payment(core).fromObject(paymentJson));
        });

        return payments;
      });
  }

  public async unlinkGateway(gatewayName): Promise<boolean> {
    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          gateway: gatewayName,
        },
        "store/gateway/unlink/"
      )
      .then((jsonresponse) => {
        return jsonresponse.success;
      });
  }

  public async createPerkCategory(name): Promise<PerkCategory> {
    let core = this.core;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          name: name,
        },
        "store/perk/category/create/"
      )
      .then((jsonresponse) => {
        return new PerkCategory(core).fromObject(jsonresponse);
      });
  }

  public async createCategory(name, description): Promise<StoreCategory> {
    var core = this.core;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
          name: name,
          description: description,
        },
        "store/category/create/"
      )
      .then((jsonresponse) => {
        return new StoreCategory(core).fromObject(jsonresponse);
      });
  }

  public async getCategories() {
    return new Promise(function (resolve, reject) {
      try {
        this.getPackages().then(function (nestedItems: Array<NestedItem>) {
          var categories = new Array<StoreCategory>();
          nestedItems.forEach((nestedItem) => {
            categories.push(nestedItem.category);
          });
          resolve(categories);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getPackages(): Promise<Array<NestedItem>> {
    let core = this.network.core;

    return new Call(this.core)
      .commit(
        {
          network: this.uuid,
        },
        "store/item/list/"
      )
      .then((jsonresponse) => {
        var response = new Array<NestedItem>();
        jsonresponse.forEach((nestedData) => {
          response.push(new NestedItem(core).fromObject(nestedData));
        });
        return response;
      });
  }
}
