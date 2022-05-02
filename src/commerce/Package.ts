import { call } from "../http/Call";
import Network from "../instance/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Category from "./Category";
import Perk from "./perk/Perk";
import PerkTree from "./perk/PerkTree";
import PerkUsage from "./perk/PerkUsage";

export default class Package implements NetworkOwned {

    public readonly id: string
    private _index: number;
    private _name: string;
    private _description?: string
    private _elastic: boolean
    private _perks: PerkTree[]
    private _category: Category

    constructor(id: string, category: Category, index: number, name: string, elastic: boolean, perks: PerkTree[], description?: string) {
        this.id = id
        this._category = category
        this._index = index
        this._name = name
        this._description = description
        this._elastic = elastic
        this._perks = perks
    }

    public static fromObject(obj: any, category: Category): Package {
        const pkg = new Package(obj.id, category, obj.index, obj.name, obj.elastic, [], obj.description)
        pkg._perks = (obj.perks as any[]).map(tree => PerkTree.fromObject(tree, pkg))
        return pkg
    }

    public get network(): Network {
        return this.category.network
    }

    public get category(): Category { return this._category }
    public get index(): number { return this._index }
    public get name(): string { return this._name }
    public get description(): string { return this._description }
    public get elastic(): boolean { return this._elastic }
    public get perks(): PerkTree[] { return this._perks }

    public async addPerk(perk: Perk, quantity?: number): Promise<Package> {
        this._perks = (await call(`network/${this.network.id}/store/package/${this.id}/perk`, {
            perk: perk.id,
            quantity: quantity,
        }) as any[]).map(tree => PerkTree.fromObject(tree, this))
        return this
    }

    public async updatePerk(perk: Perk, quantity?: number): Promise<Package> {
        this._perks = (await call(`network/${this.network.id}/store/package/${this.id}/perk/${perk.id}`, {
            quantity: quantity,
        }, 'PATCH') as any[]).map(tree => PerkTree.fromObject(tree, this))
        return this
    }

    public async deletePerk(perk: Perk): Promise<Package> {
        this._perks = (await call(`network/${this.network.id}/store/package/${this.id}/perk/${perk.id}`, undefined, 'DELETE') as any[]).map(tree => PerkTree.fromObject(tree, this))
        return this
    }

    public async update(name?: string, description?: string, index?: number, elastic?: boolean): Promise<Package> {
        await call(`network/${this.network.id}/store/package/${this.id}`, {
            name: name,
            description: description,
            index: index,
            elastic: elastic
        }, 'PATCH')
        if (name) this._name = name
        if (description != undefined) this._description = description
        if (index != undefined) this._index = index
        if (elastic != undefined) this._elastic = elastic
        return this
    }

    public async delete(): Promise<void> {
        // TODO remove from parent
        await call(`network/${this.network.id}/store/package/${this.id}`, undefined, 'DELETE')
    }

}