import Package from "./Package"
import Perk from "./Perk"

export default class PerkUsage {

    public readonly id: string
    public readonly package: Package
    private _quantity?: number
    private _perk: Perk

    constructor(id: string, pkg: Package, perk: Perk, quantity?: number) {
        this.id = id
        this.package = pkg
        this._perk = perk
        this._quantity = quantity
    }

    public get quantity(): number { return this._quantity }
    public get perk(): Perk { return this._perk }

}