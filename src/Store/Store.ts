class Store extends Network {
    public readonly network: Network;

    public constructor(network: Network) {
        super(network.core, network.asInstance());
        this.network = network;
    }

    public async getIncomeAnalytics(span = 3600 * 24): Promise<Array<IncomeAnalytic>> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    span: span,
                },
                "store/income/analytics/"
            )
            .then(json => json.map(new IncomeAnalytic().fromArray));
    }

    public async getItem(id: string): Promise<StoreItem> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    item: id,
                },
                "store/item/"
            )
            .then(item => StoreItem.fromJSON(this.core, item));
    }

    public async getPerks(): Promise<Array<Perk>> {
        let args: any = {
            network: this.uuid
        };

        if (this.core.getTool() instanceof Session) {
            args.hash = this.core.getCoreSession().getHash();
        }

        return new Call(this.core)
            .commit(args, "perk/list/")
            .then(json => json.map(perk => Perk.fromJSON(this.core, perk)));
    }

    public async getPerkCategories(): Promise<Array<PerkCategory>> {
        let args: any = {
            network: this.uuid
        };

        if (this.core.getTool() instanceof Session) {
            args.hash = this.core.getCoreSession().getHash();
        }

        return new Call(this.core)
            .commit(args, "store/perk/category/list/")
            .then(json => json.map(perk => PerkCategory.fromJSON(this.core, perk)));
    }

    public async getGateways(): Promise<Array<Gateway>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "store/gateway/list/")
            .then(json => json.map(gateway => new Gateway(gateway.name, null, null, null)));
    }

    public itemIdList(array: Array<StoreItem>): Array<StoreItem> {
        return array.map(item => new StoreItem(new Core(), item.getId()));
    }

    public itemIdListFromJSON(json: any): Array<StoreItem> {
        return json.map(item => new StoreItem(new Core(), item.uuid));
    }

    public getStripeWalletLink(): string {
        return `https://api.purecore.io/link/stripe/wallet/?hash=
        ${this.network.core.getCoreSession().getHash()}&network=${this.network.getId()}`
    }

    public getPayPalWalletLink(): string {
        return `https://api.purecore.io/link/paypal/wallet/?hash=
        ${this.network.core.getCoreSession().getHash()}&network=${this.network.getId()}`
    }

    public async requestPayment(itemList: Array<StoreItem>, username: string, billingAddress: BillingAddress) {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    username: username,
                    products: escape(JSON.stringify(itemList.map(item => item.getId()))),
                    billing: JSON.stringify(billingAddress),
                },
                "payment/request/"
            )
            .then(json => CorePaymentRequest.fromJSON(this.core, json));
    }

    public getNetwork(): Network {
        return this.network;
    }

    public async getPayments(page?: number): Promise<Array<Payment>> {
        if (page == undefined) page = 0;

        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    page: page,
                },
                "/payment/list/"
            )
            .then(json => json.map(payment => Payment.fromJSON(this.core, payment)));
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
            .then(json => json.success);
    }

    public async createPerkCategory(name: string): Promise<PerkCategory> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    name: name,
                },
                "store/perk/category/create/"
            )
            .then(json => PerkCategory.fromJSON(this.core, json));
    }

    public async createCategory(name, description): Promise<StoreCategory> {
        return new Call(this.core)
            .commit(
                {
                    network: this.uuid,
                    name: name,
                    description: description,
                },
                "store/category/create/"
            )
            .then(json => StoreCategory.fromJSON(this.core, json));
    }

    //TODO: return type
    public async getCategories() {
        return new Promise((resolve, reject) => {
            this.getPackages()
                .then((nestedItems: Array<NestedItem>) => resolve(nestedItems.map(item => item.getCategory())))
                .catch(reject);
        });
    }

    public async getPackages(): Promise<Array<NestedItem>> {
        return new Call(this.core)
            .commit({network: this.uuid}, "store/item/list/")
            .then(json => json.map(item => NestedItem.fromJSON(this.core, item)));
    }

    public static fromJSON(core: Core, json: any): Store {
        return new Store(Network.fromJSON(core, json.network));
    }
}
