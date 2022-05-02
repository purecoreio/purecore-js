import { call } from "../http/Call";
import Network from "../instance/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Package from "./Package";

export default class Category implements NetworkOwned {

    public readonly network: Network
    public readonly id: string
    private _index: number;
    private _name: string;
    private _description?: string
    private _upgradable: boolean
    private _packages: Package[]

    constructor(id: string, network: Network, index: number, name: string, upgradable: boolean, packages: Package[], description?: string) {
        this.id = id
        this.network = network
        this._index = index
        this._name = name
        this._upgradable = upgradable
        this._description = description
        this._packages = packages
    }

    public get index(): number { return this._index }
    public get name(): string { return this._name }
    public get description(): string { return this._description }
    public get upgradable(): boolean { return this._upgradable }
    public get packages(): Package[] { return this._packages }

    public async createPackage(name: string, price: number, description?: string): Promise<Package> {
        return Package.fromObject(await call(`network/${this.network.id}/store/category/${this.id}`, {
            name: name,
            price: price,
            description: description
        }), this)
    }

    public async update(name?: string, description?: string, index?: number, upgradable?: boolean): Promise<Category> {
        await call(`network/${this.network.id}/store/category/${this.id}`, {
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
        // TODO remove from parent
        await call(`network/${this.network.id}/store/category/${this.id}`, undefined, 'DELETE')
    }

    public static fromObject(obj: any, network: Network): Category {
        const category = new Category(obj.id, network, obj.index, obj.name, obj.upgradable, [], obj.description)
        category._packages = (obj.packages as any[]).map(pkg => Package.fromObject(pkg, category))
        return category
    }

}