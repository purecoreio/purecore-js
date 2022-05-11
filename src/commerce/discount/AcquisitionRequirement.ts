import Network from "../../instance/Network";
import NetworkOwned from "../../instance/NetworkOwned";
import Category from "../Category";
import Package from "../Package";
import Discount from "./Discount";

export enum RequirementType {
    ANY = 0,
    ALL = 1,
    NONE = 2
}

export default class AcquisitionRequirement implements NetworkOwned {

    public readonly discount: Discount
    public readonly id: string
    private type: RequirementType
    private packages: Package[]
    private categories: Category[]

    get network(): Network {
        return this.discount.network
    }

    constructor(discount: Discount, id: string, type: RequirementType, packages: Package[], categories: Category[]) {
        this.discount = discount
        this.id = id
        this.type = type
        this.packages = packages
        this.categories = categories
    }

    public static fromObject(obj: any, discount: Discount): AcquisitionRequirement {
        return new AcquisitionRequirement(
            discount,
            obj.id,
            obj.type,
            obj.packages.map(p => Package.fromObject(p, undefined)),
            obj.categories.map(c => Category.fromObject(c, discount.store)),
        )
    }

}