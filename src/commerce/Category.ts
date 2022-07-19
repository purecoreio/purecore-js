import { call } from "../http/Call";
import Network from "../instance/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Package from "./Package";
import Store from "./Store";

export default class Category implements NetworkOwned {

    public readonly store: Store
    public readonly id: string
    private _index: number;
    private _name: string;
    private _description?: string
    private _upgradable: boolean
    private _packages: Package[]

    constructor(id: string, store: Store, index: number, name: string, upgradable: boolean, packages: Package[], description?: string) {
        this.id = id
        this.store = store
        this._index = index
        this._name = name
        this._upgradable = upgradable
        this._description = description
        this._packages = packages
    }

    public get network(): Network { return this.store.network }
    public get index(): number { return this._index }
    public get name(): string { return this._name }
    public get description(): string { return this._description }
    public get upgradable(): boolean { return this._upgradable }
    public get packages(): Package[] { return this._packages }

    public async getPackage(id: string): Promise<Package> {
        return Package.fromObject(await this.network.call(`store/package/${id}`), this)
    }

    public async createPackage(name: string, price: number, description?: string): Promise<Package> {
        return Package.fromObject(await this.network.call(`store/category/${this.id}`, {
            name: name,
            price: price,
            description: description
        }), this)
    }

    public async update(name?: string, description?: string, index?: number, upgradable?: boolean): Promise<Category> {
        await this.network.call(`store/category/${this.id}`, {
            name: name,
            description: description,
            index: index,
            upgradable: upgradable
        }, 'PATCH')
        if (name) this._name = name
        if (description != undefined) this._description = description
        if (index != undefined) this._index = index
        if (upgradable != undefined) this._upgradable = upgradable
        return this
    }

    public async delete(): Promise<void> {
        await this.store.removeCategory(this)
    }

    public static fromObject(obj: any, store: Store): Category {
        const category = new Category(obj.id, store, obj.index, obj.name, obj.upgradable, [], obj.description)
        category._packages = (obj.packages as any[]).map(pkg => Package.fromObject(pkg, category))
        return category
    }

}