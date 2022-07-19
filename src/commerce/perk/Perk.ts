
import { call } from "../../http/Call"
import Network from "../../instance/Network"
import NetworkOwned from "../../instance/NetworkOwned"
import PerkCategory from "./PerkCategory"

export default class Perk implements NetworkOwned {

    public readonly id: string

    private _index: number
    private _name: string
    private _description?: string
    private _category: PerkCategory

    constructor(id: string, category: PerkCategory, name: string, index: number, description?: string) {
        this.id = id
        this._name = name
        this._index = index
        this._description = description
        this._category = category
    }

    public get category(): PerkCategory { return this._category }
    public get name(): string { return this._name }
    public get description(): string { return this._description }
    public get index(): number { return this._index }

    public get network(): Network {
        return this.category.network
    }

    public static fromObject(obj: any, category?: PerkCategory): Perk {
        return new Perk(obj.id, category, obj.name, obj.index, obj.description)
    }

    public async update(name?: string, description?: string, index?: number): Promise<Perk> {
        await this.network.call(`store/perk/${this.id}`, {
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
        return this.category.deletePerk(this)
    }

}