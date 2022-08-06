import Network from "../instance/network/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Category from "./Category";
import Perk from "./perk/Perk";
import PerkTree from "./perk/PerkTree";
import { TimedAmount } from "./pricing/TimedAmount";

export default class Package implements NetworkOwned {

    public readonly id: string
    private _index: number;
    private _price: TimedAmount;
    private _name: string;
    private _description?: string
    private _elastic: boolean
    private _perks: PerkTree[]
    private _category: Category

    constructor(id: string, price: TimedAmount, category: Category, index: number, name: string, elastic: boolean, perks: PerkTree[], description?: string) {
        this.id = id
        this._price = price
        this._category = category
        this._index = index
        this._name = name
        this._description = description
        this._elastic = elastic
        this._perks = perks
    }

    public static fromObject(obj: any, category: Category): Package {
        const pkg = new Package(obj.id, TimedAmount.fromObject(obj.price), category, obj.index, obj.name, obj.elastic, [], obj.description)
        pkg._perks = (obj.perks as any[]).map(tree => PerkTree.fromObject(tree, pkg))
        return pkg
    }

    public get network(): Network {
        return this.category.network
    }

    public get price(): TimedAmount { return this._price }
    public get category(): Category { return this._category }
    public get index(): number { return this._index }
    public get name(): string { return this._name }
    public get description(): string { return this._description }
    public get elastic(): boolean { return this._elastic }
    public get perks(): PerkTree[] { return this._perks }

    public async addPerk(perk: Perk, quantity?: number): Promise<Package> {
        this._perks = (await this.network.call(`store/package/${this.id}/perk`, {
            perk: perk.id,
            quantity: quantity,
        }) as any[]).map(tree => PerkTree.fromObject(tree, this))
        return this
    }

    public async updatePerk(perk: Perk, quantity?: number): Promise<Package> {
        this._perks = (await this.network.call(`store/package/${this.id}/perk/${perk.id}`, {
            quantity: quantity,
        }, 'PATCH') as any[]).map(tree => PerkTree.fromObject(tree, this))
        return this
    }

    public async deletePerk(perk: Perk): Promise<Package> {
        this._perks = (await this.network.call(`store/package/${this.id}/perk/${perk.id}`, undefined, 'DELETE') as any[]).map(tree => PerkTree.fromObject(tree, this))
        return this
    }

    public async update(name?: string, description?: string, index?: number, elastic?: boolean, price?: number): Promise<Package> {
        await this.network.call(`store/package/${this.id}`, {
            name: name,
            description: description,
            index: index,
            elastic: elastic,
            price: price
        }, 'PATCH')
        if (price != undefined) this._price.amount.original.amount = price
        if (name) this._name = name
        if (description != undefined) this._description = description
        if (index != undefined) {
            const oldIndex = this.index
            this._index = index
            // todo update parent
        }
        if (elastic != undefined) this._elastic = elastic
        return this
    }

    public async delete(): Promise<void> {
        await this.network.call(`store/package/${this.id}`, undefined, 'DELETE')
    }

}