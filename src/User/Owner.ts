class Owner extends Core {
    public core: Core;
    public id: string;
    public name: string;
    public surname: string;
    public email: string;

    public constructor(core: Core, id: string, name: string, surname: string, email: string) {
        super(core.getTool());

        this.core = core;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    public getName(): string {
        return this.name;
    }

    public getSurname(): string {
        return this.surname;
    }

    public getEmail(): string {
        return this.email;
    }

    public getId(): string {
        return this.id;
    }

    public getSession() {
        return this.core.getTool();
    }

    public async stripeSubscribe(plan: string, billingAddress: BillingAddress, pm?): Promise<StripeSubscription> {
        let args: {};
        if (pm == null) {
            args = {
                plan: plan,
                billing: JSON.stringify(billingAddress),
            };
        } else {
            let pmid;
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
            .commit(args, "account/subscribe/stripe/")
            .then(json => StripeSubscription.fromJSON(json));
    }

    public async paypalSubscribe(plan: string, billingAddress: BillingAddress): Promise<PayPalSubscription> {
        return await new Call(this.core)
            .commit(
                {
                    plan: plan,
                    billing: JSON.stringify(billingAddress),
                },
                "account/subscribe/paypal/"
            )
            .then(json => PayPalSubscription.fromJSON(json));
    }

    public async getBillingAddress(): Promise<BillingAddress> {
        return await new Call(this.core)
            .commit({}, "account/billing/get/")
            .then(BillingAddress.fromJSON);
    }

    //TODO: add types
    public async addPaymentMethod(pm: string | any): Promise<Object> {
        let pmid;
        if (typeof pm == "string") {
            pmid = pm;
        } else {
            pmid = pm.paymentMethod.id;
        }

        return await new Call(this.core)
            .commit({pm: pmid}, "account/card/add/")
            .then(json => json);
    }

    //TODO: add types
    public async removePaymentMethod(pm: string | any): Promise<boolean> {
        let pmid = null;
        if (typeof pm == "string") {
            pmid = pm;
        } else {
            pmid = pm.paymentMethod.id;
        }

        return await new Call(this.core)
            .commit({pm: pmid}, "account/card/remove/")
            .then(json => json.success);
    }

    /**
     * @see https://stripe.com/docs/api/payment_methods/object
     */
    public async getPaymentMethods(): Promise<Array<StripePaymentMethodObject>> {
        return await new Call(this.core)
            .commit({}, "account/card/list/")
            .then(json => json);
    }

    public async createNetwork(name: string, game: string, cname: string, ip?: string, port?: number): Promise<Network> {
        let args: any = {
            name: name,
            game: game,
            cname: cname,
        };

        if (ip != undefined) args.id = ip;
        if (port != undefined) args.port = port;

        return await new Call(this.core)
            .commit(args, "instance/network/create/")
            .then(json => Network.fromJSON(this.core, json));
    }

    public static fromJSON(core: Core, json: any): Owner {
        return new Owner(
            core,
            json.id,
            json.name,
            json.surname,
            json.email
        );
    }
}
