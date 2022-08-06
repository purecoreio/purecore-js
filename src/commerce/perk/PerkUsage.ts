import Network from "../../instance/network/Network"
import NetworkOwned from "../../instance/NetworkOwned"
import Package from "../Package"
import Perk from "./Perk"
import PerkCategory from "./PerkCategory"

export default class PerkUsage implements NetworkOwned {

    public readonly package: Package
    private _quantity?: number
    private _perk: Perk

    constructor(pkg: Package, perk: Perk, quantity?: number) {
        this.package = pkg
        this._perk = perk
        this._quantity = quantity
    }

    public static fromObject(obj: any, pkg: Package, category: PerkCategory): PerkUsage {
        return new PerkUsage(pkg, Perk.fromObject(obj.perk, category), obj.quantity)
    }

    public get network(): Network {
        return this.perk.category.network
    }

    public get quantity(): number { return this._quantity }
    public get perk(): Perk { return this._perk }

}