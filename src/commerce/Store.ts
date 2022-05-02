import { call } from "../http/Call";
import Network from "../instance/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Category from "./Category";
import PerkCategory from "./perk/PerkCategory";

export default class Store implements NetworkOwned {

    public readonly network: Network

    private _categories: Category[]
    private _perks: PerkCategory[]

    constructor(network: Network, currency?: string, categories?: Category[], perks?: PerkCategory[]) {
        this.network = network
        // TODO preload
    }

    public get categories(): Category[] { return this._categories }
    public get perks(): PerkCategory[] { return this._perks }

    public async getCategories(): Promise<Category[]> {
        if (this.categories) return this.categories
        this._categories = (await call(`network/${this.network.id}/store/category`) as any[]).map(category => Category.fromObject(category, this.network))
        return this.categories
    }

    public async getPerks(): Promise<PerkCategory[]> {
        if (this.perks) return this.perks
        this._perks = (await call(`network/${this.network.id}/store/category/perk`) as any[]).map(category => PerkCategory.fromObject(category, this.network))
        return this.perks
    }

    public async createCategory(name: string, description?: string) {
        return Category.fromObject(await call(`network/${this.network.id}/store/category`, {
            name: name,
            description: description // TODO check: may cause problems if undefined
        }), this.network)
    }

    public async createPerkCategory(name: string, description?: string) {
        return Category.fromObject(await call(`network/${this.network.id}/store/category/perk`, {
            name: name,
            description: description // TODO check: may cause problems if undefined
        }), this.network)
    }

}