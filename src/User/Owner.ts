class Owner extends Core {
  core: Core;
  id: string;
  name: string;
  surname: string;
  email: string;

  constructor(
    core: Core,
    id: string,
    name: string,
    surname: string,
    email: string
  ) {
    super(core.getTool());
    this.core = core;
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
  }

  getName() {
    return this.name;
  }

  getSurname() {
    return this.surname;
  }

  getEmail() {
    return this.email;
  }

  getId() {
    return this.id;
  }

  getSession() {
    return this.core.getTool();
  }

  public async stripeSubscribe(
    plan: string,
    billingAddress: BillingAddress,
    pm?
  ): Promise<StripeSubscription> {
    var args = {};
    if (pm == null) {
      args = {
        plan: plan,
        billing: JSON.stringify(billingAddress),
      };
    } else {
      var pmid = null;
      if (typeof pm == "string") {
        pmid = pm;
      } else {
        pmid = pm.paymentMethod.id;
      }
      args = {
        plan: plan,
        billing: JSON.stringify(billingAddress),
        pm: pmid,
      };
    }

    return await new Call(this.core)
      .commit({}, "account/subscribe/stripe/")
      .then(function (jsonresponse) {
        return new StripeSubscription(jsonresponse.id);
      });
  }

  public async paypalSubscribe(
    plan: string,
    billingAddress: BillingAddress
  ): Promise<PayPalSubscription> {
    return await new Call(this.core)
      .commit(
        {
          plan: plan,
          billing: JSON.stringify(billingAddress),
        },
        "account/subscribe/paypal/"
      )
      .then(function (jsonresponse) {
        return new PayPalSubscription(jsonresponse.url, jsonresponse.id);
      });
  }

  public async getBillingAddress(): Promise<BillingAddress> {
    return await new Call(this.core)
      .commit({}, "account/billing/get/")
      .then(function (jsonresponse) {
        return new BillingAddress().fromObject(jsonresponse);
      });
  }

  public async addPaymentMethod(pm): Promise<Object> {
    var pmid = null;
    if (typeof pm == "string") {
      pmid = pm;
    } else {
      pmid = pm.paymentMethod.id;
    }

    return await new Call(this.core)
      .commit(
        {
          pm: pmid,
        },
        "account/card/add/"
      )
      .then(function (jsonresponse) {
        return jsonresponse;
      });
  }

  public async removePaymentMethod(pm): Promise<boolean> {
    var pmid = null;
    if (typeof pm == "string") {
      pmid = pm;
    } else {
      pmid = pm.paymentMethod.id;
    }

    return await new Call(this.core)
      .commit(
        {
          pm: pmid,
        },
        "account/card/remove/"
      )
      .then(function (jsonresponse) {
        return jsonresponse.success;
      });
  }

  public async getPaymentMethods(): Promise<Array<Object>> {
    return await new Call(this.core)
      .commit({}, "account/card/list/")
      .then(function (jsonresponse) {
        // array of https://stripe.com/docs/api/payment_methods/object
        return jsonresponse;
      });
  }

  public async createTemplate(
    supportedImages: [],
    memory: number,
    size: number,
    cores: number,
    price?: number
  ): Promise<HostingTemplate> {
    var core = this.core;

    var args = {};
    if (price == null) {
      args = {
        supportedImages: supportedImages,
        memory: String(memory),
        size: String(size),
        cores: String(cores),
        price: String(price)
      };
    } else {
      args = {
        supportedImages: supportedImages,
        memory: String(memory),
        size: String(size),
        cores: String(cores),
      };
    }

    return await new Call(this.core)
      .commit(args, "hosting/template/create/")
      .then(function (jsonresponse) {
        return new HostingTemplate(core).fromObject(jsonresponse);
      });
  }

  public async createNetwork(
    name: string,
    game: string,
    cname: string,
    ip?: string,
    port?
  ): Promise<Network> {
    var core = this.core;

    var args = {};
    if (ip == null) {
      args = {
        name: name,
        game: game,
        cname: cname,
      };
    } else if (port == null) {
      args = {
        name: name,
        game: game,
        cname: cname,
        ip: ip,
      };
    } else {
      args = {
        name: name,
        game: game,
        cname: cname,
        ip: ip,
        port: port,
      };
    }

    return await new Call(this.core)
      .commit(args, "instance/network/create/")
      .then(function (jsonresponse) {
        var network = new Network(
          core,
          new Instance(core, jsonresponse.uuid, jsonresponse.name, "NTW")
        );
        return network;
      });
  }
}
