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

    async removeCategory(category: Category) {
        await call(`network/${this.network.id}/store/category/${category.id}`, undefined, 'DELETE')
        this._categories = this.categories.filter(cat => cat.id != category.id)
    }

    async removePerkCategory(category: PerkCategory) {
        await call(`network/${this.network.id}/store/category/perk/${category.id}`, undefined, 'DELETE')
        this._perks = this.perks.filter(cat => cat.id != category.id)
    }

    public async getCategories(): Promise<Category[]> {
        this._categories = (await call(`network/${this.network.id}/store/category`) as any[]).map(category => Category.fromObject(category, this))
        return this.categories
    }

    public async getCategory(id: string): Promise<Category> {
        return Category.fromObject(await call(`network/${this.network.id}/store/category/${id}`) as any, this)
    }

    public async getPerks(): Promise<PerkCategory[]> {
        this._perks = (await call(`network/${this.network.id}/store/category/perk`) as any[]).map(category => PerkCategory.fromObject(category, this))
        return this.perks
    }

    public async createCategory(name: string, description?: string) {
        const category = Category.fromObject(await call(`network/${this.network.id}/store/category`, {
            name: name,
            description: description // TODO check: may cause problems if undefined
        }), this)
        this._categories.push(category)
        return category
    }

    public async createPerkCategory(name: string, description?: string) {
        const category = PerkCategory.fromObject(await call(`network/${this.network.id}/store/category/perk`, {
            name: name,
            description: description // TODO check: may cause problems if undefined
        }), this)
        this._perks.push(category)
        return category
    }

}