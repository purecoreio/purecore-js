class CorePaymentRequest extends Core {
  public core: Core;
  public uuid: string;
  public store: Store;
  public products: Array<StoreItem>;
  public username: string;
  public player: Player;
  public sessionList: Array<ConnectionHash>;
  public warnings: Array<Warning>;
  public discounts: Array<Discount>;
  public gateways: Array<Gateway>;
  public due;
  public currency: string;

  constructor(core: Core) {
    super(core.getTool());
    this.core = new Core(core.getTool());
    this.products = new Array<StoreItem>();
    this.sessionList = new Array<ConnectionHash>();
    this.warnings = new Array<Warning>();
    this.discounts = new Array<Discount>();
    this.gateways = new Array<Gateway>();
  }

  public async isPaid(): Promise<boolean> {
    return new Call(this.core)
      .commit(
        {
          request: this.uuid,
        },
        "payment/request/isPaid/"
      )
      .then((jsonresponse) => {
        return jsonresponse.paid;
      });
  }

  fromObject(array): CorePaymentRequest {
    this.uuid = array.uuid;
    this.store = new Store(
      new Network(
        this.core,
        new Instance(
          this.core,
          array.store.network.uuid,
          array.store.network.name,
          "NTW"
        )
      )
    );

    array.products.forEach((product) => {
      this.products.push(new StoreItem(this.core).fromObject(product));
    });

    this.username = array.username;

    try {
      this.player = new Player(
        this.core,
        array.player.coreid,
        array.player.username,
        array.player.uuid,
        array.player.verified
      );
    } catch (error) {
      this.player = null;
    }

    if (array.sessionList != null) {
      array.sessionList.forEach((session) => {
        // TODO
      });
    }

    if (array.warnings != null) {
      array.warnings.forEach((warning) => {
        try {
          this.warnings.push(new Warning(warning.cause, warning.text));
        } catch (error) {
          // ignore
        }
      });
    }

    if (array.discounts != null) {
      array.discounts.forEach((discount) => {
        try {
          this.discounts.push(
            new Discount(
              discount.type,
              discount.id,
              discount.description,
              discount.amount
            )
          );
        } catch (error) {
          // ignore
        }
      });
    }

    if (array.gateways != null) {
      array.gateways.forEach((gateway) => {
        this.gateways.push(
          new Gateway(gateway.name, gateway.url, gateway.color, gateway.logo)
        );
      });
    }

    this.due = array.due;
    this.currency = array.currency;

    return this;
  }
}
