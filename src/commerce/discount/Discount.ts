import Network from "../../instance/Network"
import NetworkOwned from "../../instance/NetworkOwned"
import Profile from "../../user/Profile"
import Category from "../Category"
import Package from "../Package"
import Store from "../Store"
import AcquisitionRequirement from "./AcquisitionRequirement"
import * as NumericLimitation from "./NumericLimitation"

export enum ReductionType {
    PERCENT = 0,
    ABSOLUTE = 1
}

export default class Discount implements NetworkOwned {

    public readonly store: Store
    public readonly id: string
    private _code: string | null                                         // code to activate (if any)
    private _since: Date | null                                          // since
    private _until: Date | null                                          // until
    private _type: ReductionType                                         // percent or absolute
    private _amount: number                                              // discount amount

    private _useLimit: NumericLimitation.NumericLimitation               // maximum uses (per customer and globally)
    private _amountLimit: NumericLimitation.NumericLimitation            // minimum amount on checkout and maximimun to discount (per customer and globally)
    private _itemLimit: NumericLimitation.NumericLimitation              // minimum item count (per checkout)
    private _previousPurchaseLimit: NumericLimitation.NumericLimitation  // minimum previous purchase count (per customer)
    private _previousAmountLimit: NumericLimitation.NumericLimitation    // minimum previously spent amount (per customer)

    private _packages: Package[]                                         // only elegible for these packages
    private _categories: Category[]                                      // only elegible for these categories
    private _profiles: Profile[]                                         // only elegible for these profiles
    private _announce: boolean                                           // publicly list the discount on the store
    private _suggest: boolean                                            // suggest during checkout ('add one more item to get this disccount blabla')
    private _gifts: boolean                                              // should the discount only work on gift purchases?
    private _discriminative: boolean                                     // should the discount be applied to the elegible packages/categories or the total?

    private _acquisitionRequirements: AcquisitionRequirement[]            // own any of the list, own all of the list, don't own any of the list

    get code(): string { return this._code }
    get since(): Date { return this._since }
    get until(): Date { return this._until }
    get type(): ReductionType { return this._type }
    get amount(): number { return this._amount }
    get useLimit(): NumericLimitation.NumericLimitation { return this._useLimit }
    get amountLimit(): NumericLimitation.NumericLimitation { return this._amountLimit }
    get itemLimit(): NumericLimitation.NumericLimitation { return this._itemLimit }
    get previousPurchaseLimit(): NumericLimitation.NumericLimitation { return this._previousPurchaseLimit }
    get previousAmountLimit(): NumericLimitation.NumericLimitation { return this._previousAmountLimit }
    get packages(): Package[] { return this._packages }
    get categories(): Category[] { return this._categories }
    get profiles(): Profile[] { return this._profiles }
    get announce(): boolean { return this._announce }
    get suggest(): boolean { return this._suggest }
    get gifts(): boolean { return this._gifts }
    get discriminative(): boolean { return this._discriminative }
    get acquisitionRequirements(): AcquisitionRequirement[] { return this._acquisitionRequirements }

    get network(): Network {
        return this.store.network
    }

    constructor(store: Store, id: string, code: string, since: Date | null, until: Date | null, type: ReductionType, amount: number, useLimit: NumericLimitation.NumericLimitation, amountLimit: NumericLimitation.NumericLimitation, itemLimit: NumericLimitation.NumericLimitation, previousPurchaseLimit: NumericLimitation.NumericLimitation, previousAmountLimit: NumericLimitation.NumericLimitation, packages: Package[], categories: Category[], profiles: Profile[], announce: boolean, suggest: boolean, gifts: boolean, discriminative: boolean, acquisitionRequirements: AcquisitionRequirement[]) {
        this.store = store
        this.id = id
        this._code = code
        this._since = since
        this._until = until
        this._type = type
        this._amount = amount
        this._useLimit = useLimit
        this._amountLimit = amountLimit
        this._itemLimit = itemLimit
        this._previousPurchaseLimit = previousPurchaseLimit
        this._previousAmountLimit = previousAmountLimit
        this._packages = packages
        this._categories = categories
        this._profiles = profiles
        this._announce = announce
        this._suggest = suggest
        this._gifts = gifts
        this._discriminative = discriminative
        this._acquisitionRequirements = acquisitionRequirements
    }

    public static fromObject(obj: any, store: Store): Discount {
        let discount: Discount
        discount = new Discount(
            store,
            obj.id,
            obj.code,
            new Date(obj.since),
            new Date(obj.until),
            obj.type,
            obj.amount,
            NumericLimitation.fromObject(obj.useLimit),
            NumericLimitation.fromObject(obj.amountLimit),
            NumericLimitation.fromObject(obj.itemLimit),
            NumericLimitation.fromObject(obj.previousPurchaseLimit),
            NumericLimitation.fromObject(obj.previousAmountLimit),
            obj.packages.map(p => Package.fromObject(p, undefined)),
            obj.categories.map(c => Category.fromObject(c, store)),
            obj.profiles.map(u => Profile.fromObject(u)),
            obj.announce,
            obj.suggest,
            obj.gifts,
            obj.discriminative,
            obj.acquisitionRequirements.map(r => AcquisitionRequirement.fromObject(r, discount))
        )
        return discount
    }

    public async delete(){
        await this.store.removeDiscount(this)
    }

}