class Payment {

    public id: string;
    public network: Network;
    public customer: string;
    public relatedProfiles: Array<PlatformProfile>;
    public country: string;
    public region: string;
    public amount: number;
    public amountOriginal: number;
    public currency: string;
    public presentedCurrency: string;
    public presentedExchange: number;
    public presentedAmount: number;
    public taxRate: number;
    public taxIncluded: boolean;
    public discounts: Array<Discount>;
    public items: Array<StoreItem>;
    public test: boolean;
    public profile: PlatformProfile;
    public creation: Date;
    public paid: Date;
    public cancelled: Date;
    public refunded: Date;
    public refundable: Date;
    public dispute: Date;
    public disputeClosed: Date;
    public availableGateways: Array<Gateway>;
    public availableMethods: Array<PaymentMethod>;
    public stripePaymentIntent: string;
    public stripeCharge: string;
    public paypalOrder: string;
    public paypalCharge: string;
    public gateway: Gateway;
    public method: PaymentMethod;

    public static fromObject(object: any): Payment {
        let payment = new Payment();
        payment.id = object.id;
        payment.network = Network.fromObject(object.network);
        payment.customer = object.customer;
        payment.relatedProfiles = new Array<PlatformProfile>();
        if (object.relatedProfiles != null) {
            for (let i = 0; i < object.relatedProfiles.length; i++) {
                const element = object.relatedProfiles[i];
                payment.relatedProfiles.push(PlatformProfile.fromObject(element))
            }
        }
        payment.country = object.country;
        payment.region = object.region;
        payment.amount = object.amount;
        payment.amountOriginal = object.amountOriginal;
        payment.currency = object.currency;
        payment.presentedCurrency = object.presentedCurrency;
        payment.presentedExchange = object.presentedExchange;
        payment.presentedAmount = object.presentedAmount;
        payment.taxRate = object.taxRate;
        payment.taxIncluded = object.taxIncluded;
        payment.discounts = new Array<Discount>();
        for (let i = 0; i < object.discounts.length; i++) {
            const element = object.discounts[i];
            payment.discounts.push(Discount.fromObject(element));
        }
        payment.items = new Array<StoreItem>();
        for (let i = 0; i < object.items.length; i++) {
            const element = object.items[i];
            payment.items.push(StoreItem.fromObject(element));
        }
        payment.test = object.test;
        payment.profile = PlatformProfile.fromObject(object.profile);
        payment.creation = Util.date(object.creation);
        payment.paid = Util.date(object.creation);
        payment.cancelled = Util.date(object.creation);
        payment.refunded = Util.date(object.creation);
        payment.refundable = Util.date(object.creation);
        payment.dispute = Util.date(object.creation);
        payment.disputeClosed = Util.date(object.creation);
        payment.availableGateways = new Array<Gateway>();
        for (let i = 0; i < object.availableGateways.length; i++) {
            const element = object.availableGateways[i];
            switch (element) {
                case 0:
                    payment.availableGateways.push(Gateway.Stripe)
                    break;
                case 1:
                    payment.availableGateways.push(Gateway.PayPal)
                    break;
                case 2:
                    payment.availableGateways.push(Gateway.mollie)
                    break;
            }
        }
        payment.availableMethods = new Array<PaymentMethod>();
        for (let i = 0; i < object.availableMethods.length; i++) {
            const element = object.availableMethods[i];
            switch (element) {
                case 0:
                    payment.availableMethods.push(PaymentMethod.Card)
                    break;
                case 1:
                    payment.availableMethods.push(PaymentMethod.PayPal)
                    break;
                case 2:
                    payment.availableMethods.push(PaymentMethod.Bancontact)
                    break;
                case 3:
                    payment.availableMethods.push(PaymentMethod.Giropay)
                    break;
                case 4:
                    payment.availableMethods.push(PaymentMethod.iDEAL)
                    break;
            }
        }
        payment.stripePaymentIntent = object.stripePaymentIntent;
        payment.stripeCharge = object.stripeCharge;
        payment.paypalOrder = object.paypalOrder;
        payment.paypalCharge = object.paypalCharge;
        if (object.gateway != null) {
            switch (object.gateway) {
                case 0:
                    payment.gateway = Gateway.Stripe;
                    break;
                case 1:
                    payment.gateway = Gateway.PayPal;
                    break;
                case 2:
                    payment.gateway = Gateway.mollie;
                    break;

                default:
                    payment.gateway = Gateway.Unknown;
                    break;
            }
        } else {
            payment.gateway = null;
        }
        if (object.method != null) {
            switch (object.method) {
                case 0:
                    payment.method = PaymentMethod.Card
                    break;
                case 1:
                    payment.method = PaymentMethod.PayPal
                    break;
                case 2:
                    payment.method = PaymentMethod.Bancontact
                    break;
                case 3:
                    payment.method = PaymentMethod.Giropay
                    break;
                case 4:
                    payment.method = PaymentMethod.iDEAL
                    break;
                default:
                    payment.method = PaymentMethod.Unknown;
                    break;
            }
        } else {
            payment.method = null;
        }
        return payment;
    }

}