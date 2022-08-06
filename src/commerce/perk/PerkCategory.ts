import { call } from "../../http/Call"
import Network from "../../instance/network/Network"
import NetworkOwned from "../../instance/NetworkOwned"
import Package from "../Package"
import Store from "../Store"
import Perk from "./Perk"

export default class PerkCategory implements NetworkOwned {

    public readonly store: Store
    public readonly id: string

    private _index: number
    private _name: string
    private _description?: string
    private _perks: Perk[]

    constructor(id: string, store: Store, perks: Perk[], name: string, index: number, description?: string) {
        this.store = store
        this.id = id
        this._perks = perks
        this._name = name
        this._index = index
        this._description = description
    }

    public get network(): Network { return this.store.network }
    public get perks(): Perk[] { return this._perks }
    public get name(): string { return this._name }
    public get index(): number { return this._index }
    public get description(): string { return this._description }

    public static fromObject(obj: any, store: Store) {
        const category: PerkCategory = new PerkCategory(obj.id, store, [], obj.name, obj.index, obj.description)
        category._perks = obj.perks ? obj.perks.map(perk => Perk.fromObject(perk, category)) : undefined
        return category
    }

    public async createPerk(pkg: Package, name: string, quantity?: number, description?: string): Promise<Perk> {
        const perk = Perk.fromObject(await this.network.call(`store/category/perk/${this.id}`, {
            name: name,
            description: description,
            package: pkg.id,
            quantity: quantity
        }), this)
        this.perks.push(perk)
        return perk
    }

    public async deletePerk(perk: Perk): Promise<void> {
        await this.network.call(`store/perk/${perk.id}`, undefined, 'DELETE')
        this._perks = this.perks.filter(p => p.id != perk.id)
    }

    public async update(name?: string, description?: string, index?: number): Promise<PerkCategory> {
        await this.network.call(`store/category/perk/${this.id}`, {
            name: name,
            description: description,
            index: index
        }, 'PATCH')
        if (name) this._name = name
        if (description != undefined) this._description = description
        if (index != undefined) this._index = index
        return this
    }

    public async delete(): Promise<void> {
        return this.store.removePerkCategory(this)
    }


}