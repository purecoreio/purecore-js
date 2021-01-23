class Discount {

    public id: string;
    public network: Network;
    public systemGenerated: boolean;
    public byItem: StoreItem;
    public code: string;
    public sale: boolean;
    public name: string;
    public activeUntil: Date;
    public activeFrom: Date;
    public creation: Date;
    public amount: number;
    public percentage: number;
    public uses: number;
    public maxUses: number;
    public forItems: Array<StoreItem>;
    public archived: Date;
    public minimum: number;
    public profileLimited: boolean;
    public profiles: Array<PlatformProfile>;

    public static fromObject(object: any): Discount {
        let discount = new Discount();
        discount.id = object.id;
        discount.network = object.network == null ? null : Network.fromObject(object.network);
        discount.systemGenerated = object.systemGenerated;
        discount.byItem = object.byItem == null ? null : StoreItem.fromObject(object.byItem);
        discount.code = object.code;
        discount.sale = object.sale;
        discount.name = object.name;
        discount.activeUntil = Util.date(object.activeUntil);
        discount.activeFrom = Util.date(object.activeFrom);
        discount.creation = Util.date(object.creation);
        discount.amount = object.amount;
        discount.percentage = object.percentage;
        discount.uses = object.uses;
        discount.maxUses = object.maxUses;
        discount.forItems = null;
        if (object.forItems != null) {
            discount.forItems = new Array<StoreItem>();
            for (let i = 0; i < object.forItems.length; i++) {
                const element = object.forItems[i];
                discount.forItems.push(StoreItem.fromObject(element));
            }
        }
        discount.archived = Util.date(object.archived);
        discount.minimum = object.minimum;
        discount.profileLimited = object.profileLimited;
        discount.profiles = null;
        if (object.profiles != null) {
            discount.profiles = new Array<PlatformProfile>();
            for (let i = 0; i < object.profiles.length; i++) {
                const element = object.profiles[i];
                discount.profiles.push(PlatformProfile.fromObject(element));
            }
        }
        return discount;
    }

}