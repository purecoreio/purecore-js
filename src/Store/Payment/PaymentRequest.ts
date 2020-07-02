class CorePaymentRequest extends Core {
    public readonly core: Core;
    public uuid: string;
    public store: Store;
    public products: Array<StoreItem>;
    public username: string;
    public player: Player;
    public sessionList: Array<ConnectionHash>;
    public warnings: Array<Warning>;
    public discounts: Array<Discount>;
    public gateways: Array<Gateway>;
    public due: number;
    public currency: string;

    public constructor(core: Core, uuid?: string, store?: Store, products?: Array<StoreItem>, username?: string, player?: Player, sessionList?: Array<ConnectionHash>, warnings?: Array<Warning>, discounts?: Array<Discount>, gateways?: Array<Gateway>, due?: null, currency?: string) {
        super(core.getTool());
        this.core = new Core(core.getTool());
        this.uuid = uuid;
        this.store = store;
        this.products = products == null ? new Array<StoreItem>() : products;
        this.username = username;
        this.sessionList = sessionList == null ? new Array<ConnectionHash>() : sessionList;
        this.warnings = warnings == null ? new Array<Warning>() : warnings;
        this.discounts = discounts == null ? new Array<Discount>() : discounts;
        this.gateways = gateways == null ? new Array<Gateway>() : gateways;
        this.due = due;
        this.currency = currency;
    }

    public async isPaid(): Promise<boolean> {
        return new Call(this.core)
            .commit({request: this.uuid}, "payment/request/isPaid/")
            .then(json => json.paid);
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): CorePaymentRequest {
        this.uuid = array.uuid;
        this.store = Store.fromJSON(this.core, array.store);
        this.products = array.products.map(product => StoreItem.fromJSON(this.core, product));
        this.username = array.username;
        this.player = Player.fromJSON(this.core, array.player);
        this.sessionList = array.sessionList.map(session => ConnectionHash.fromJSON(this.core, session)); //TODO: check implementation as it was a todo previously
        this.warnings = array.warnings.map(Warning.fromJSON);
        this.discounts = array.discounts.map(Discount.fromJSON)
        this.gateways = array.gateways.map(Gateway.fromJSON)
        this.due = array.due;
        this.currency = array.currency;

        return this;
    }

    public static fromJSON(core: Core, json: any): CorePaymentRequest {
        return new CorePaymentRequest(
            core,
            json.uuid,
            Store.fromJSON(core, json.store),
            json.products.map(product => StoreItem.fromJSON(core, product)),
            json.username,
            Player.fromJSON(core, json.player),
            json.sessionList.map(session => ConnectionHash.fromJSON(core, session)),
            json.warnings.map(Warning.fromJSON),
            json.discounts.map(Discount.fromJSON),
            json.gateways.map(Gateway.fromJSON),
            json.due,
            json.currency
        );
    }
}
