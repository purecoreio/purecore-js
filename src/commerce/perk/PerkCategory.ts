import { call } from "../../http/Call"
import Network from "../../instance/Network"
import NetworkOwned from "../../instance/NetworkOwned"
import Perk from "./Perk"

export default class PerkCategory implements NetworkOwned {

    public readonly network: Network
    public readonly id: string

    private _index: number
    private _name: string
    private _description?: string
    private _perks: Perk[]

    constructor(id: string, network: Network, perks: Perk[], name: string, index: number, description?: string) {
        this.network = network
        this.id = id
        this._perks = perks
        this._name = name
        this._index = index
        this._description = description
    }

    public get perks(): Perk[] { return this._perks }
    public get name(): string { return this._name }
    public get index(): number { return this._index }
    public get description(): string { return this._description }

    public static fromObject(obj: any, network: Network) {
        const category: PerkCategory = new PerkCategory(obj.id, network, [], obj.name, obj.index, obj.description)
        category._perks = obj.perks.map(perk => Perk.fromObject(perk, category))
        return category
    }

    public async createPerk(name: string, description?: string): Promise<Perk> {
        return Perk.fromObject(await call(`network/${this.network.id}/store/category/perk/${this.id}`, {
            name: name,
            description: description
        }), this)
    }

    public async update(name?: string, description?: string, index?: number): Promise<PerkCategory> {
        await call(`network/${this.network.id}/store/category/perk/${this.id}`, {
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
        // TODO remove from parent
        await call(`network/${this.network.id}/store/category/perk/${this.id}`, undefined, 'DELETE')
    }


}