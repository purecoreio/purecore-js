import { call } from "../http/Call";
import Network from "../instance/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Category from "./Category";
import Discount, { ReductionType } from "./discount/Discount";
import PerkCategory from "./perk/PerkCategory";

export default class Store implements NetworkOwned {

    public readonly network: Network

    private _categories: Category[]
    private _perks: PerkCategory[]
    private _discounts: Discount[]

    constructor(network: Network, currency?: string, categories?: Category[], perks?: PerkCategory[]) {
        this.network = network
        // TODO preload
    }

    public get categories(): Category[] { return this._categories }
    public get perks(): PerkCategory[] { return this._perks }
    public get discounts(): Discount[] { return this._discounts }

    async removeCategory(category: Category) {
        await call(`network/${this.network.id}/store/category/${category.id}`, undefined, 'DELETE')
        this._categories = this.categories.filter(cat => cat.id != category.id)
    }

    async removePerkCategory(category: PerkCategory) {
        await call(`network/${this.network.id}/store/category/perk/${category.id}`, undefined, 'DELETE')
        this._perks = this.perks.filter(cat => cat.id != category.id)
    }

    async removeDiscount(discount: Discount) {
        await call(`network/${this.network.id}/store/discount/${discount.id}`, undefined, 'DELETE')
        this._discounts = this.discounts.filter(d => d.id != discount.id)
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

    public async getDiscounts(): Promise<Discount[]> {
        this._discounts = (await call(`network/${this.network.id}/store/discount`) as any[]).map(discount => Discount.fromObject(discount, this))
        return this._discounts
    }

    public async createCategory(name: string, description?: string): Promise<Category> {
        const category = Category.fromObject(await call(`network/${this.network.id}/store/category`, {
            name: name,
            description: description
        }), this)
        this._categories.push(category)
        return category
    }

    public async createPerkCategory(name: string, description?: string): Promise<PerkCategory> {
        const category = PerkCategory.fromObject(await call(`network/${this.network.id}/store/category/perk`, {
            name: name,
            description: description
        }), this)
        this._perks.push(category)
        return category
    }

    public async createDiscount(amount: number, type: ReductionType): Promise<Discount> {
        const discount = Discount.fromObject(await call(`network/${this.network.id}/store/discount`, {
            amount: amount,
            type: Number(type)
        }), this)
        this._discounts.push(discount)
        return discount
    }

}