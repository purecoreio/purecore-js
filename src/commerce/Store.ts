import Network from "../instance/network/Network";
import NetworkOwned from "../instance/NetworkOwned";
import User from "../user/User";
import Wallet from "../user/Wallet";
import Category from "./Category";
import Discount, { ReductionType } from "./discount/Discount";
import Gateway from "./Gateway";
import Package from "./Package";
import PerkCategory from "./perk/PerkCategory";
import * as processor from "./processor";

export default class Store implements NetworkOwned {

    public readonly network: Network

    private _categories: Category[]
    private _perks: PerkCategory[]
    private _discounts: Discount[]
    private _gateways: Gateway[]

    constructor(network: Network, currency?: string, categories?: Category[], perks?: PerkCategory[]) {
        this.network = network
        // TODO preload
    }

    public get categories(): Category[] { return this._categories }
    public get perks(): PerkCategory[] { return this._perks }
    public get discounts(): Discount[] { return this._discounts }

    async getCreditFallback(): Promise<processor.processor[]> {
        return (await this.network.call('store/credit')).map(s => processor.fromNumber(s))
    }

    async setCreditFallback(modifiedProcessor: processor.processor, fallback: boolean): Promise<processor.processor[]> {
        return (await this.network.call('store/credit', {
            service: processor.asNumber(modifiedProcessor),
            fallback: fallback
        }, 'PATCH')).map(s => processor.fromNumber(s))
    }

    async getCurrency(): Promise<string> {
        return (await this.network.call('store/currency')).result
    }

    async setCurrency(currency: string): Promise<void> {
        await this.network.call('store/currency', {
            currency: currency
        }, 'PATCH')
    }

    async getRecommendedCurrencies(): Promise<string[]> {
        return await this.network.call('store/currency/recommended')
    }

    async removeCategory(category: Category) {
        await this.network.call(`store/category/${category.id}`, undefined, 'DELETE')
        if (this.categories) this._categories = this.categories.filter(cat => cat.id != category.id)
    }

    async removePerkCategory(category: PerkCategory) {
        await this.network.call(`store/category/perk/${category.id}`, undefined, 'DELETE')
        if (this.perks) this._perks = this.perks.filter(cat => cat.id != category.id)
    }

    async removeDiscount(discount: Discount) {
        await this.network.call(`store/discount/${discount.id}`, undefined, 'DELETE')
        if (this.discounts) this._discounts = this.discounts.filter(d => d.id != discount.id)
    }

    public async getCategories(): Promise<Category[]> {
        this._categories = (await this.network.call(`store/category`) as any[]).map(category => Category.fromObject(category, this))
        return this.categories
    }

    public async getCategory(id: string): Promise<Category> {
        return Category.fromObject(await this.network.call(`store/category/${id}`) as any, this)
    }

    public async getDiscount(id: string): Promise<Discount> {
        return Discount.fromObject(await this.network.call(`store/discount/${id}`) as any, this)
    }

    public async getPerks(): Promise<PerkCategory[]> {
        this._perks = (await this.network.call(`store/category/perk`) as any[]).map(category => PerkCategory.fromObject(category, this))
        return this.perks
    }

    public async getDiscounts(): Promise<Discount[]> {
        this._discounts = (await this.network.call(`store/discount`) as any[]).map(discount => Discount.fromObject(discount, this))
        return this._discounts
    }

    public async getGateways(): Promise<Gateway[]> {
        this._gateways = (await this.network.call(`store/gateway`) as any[]).map(gateway => Gateway.fromObject(gateway, this))
        return this._gateways
    }

    public async createCategory(name: string, description?: string): Promise<Category> {
        const category = Category.fromObject(await this.network.call(`store/category`, {
            name: name,
            description: description
        }), this)
        if (this.categories) this._categories.push(category)
        return category
    }

    public async createPerkCategory(name: string, description?: string): Promise<PerkCategory> {
        const category = PerkCategory.fromObject(await this.network.call(`store/category/perk`, {
            name: name,
            description: description
        }), this)
        if (this.perks) this._perks.push(category)
        return category
    }

    public async createDiscount(name: string, amount: number, type: ReductionType): Promise<Discount> {
        const discount = Discount.fromObject(await this.network.call(`store/discount`, {
            amount: amount,
            name: name,
            type: Number(type)
        }), this)
        if (this.discounts) this._discounts.unshift(discount)
        return discount
    }

    /**
     * ! returns an invalid gateway id.
     * syn for User.linkWallet(processor,<this>,privateKey,publicKey)
     */
    public async linkGateway(processor: processor.processor, privateKey?: string, publicKey?: string): Promise<void> {
        const user = new User('')
        await user.linkWallet(processor, this.network, privateKey, publicKey)
    }

    public async createGateway(wallet: Wallet): Promise<Gateway> {
        return Gateway.fromObject(await this.network.call('store/gateway', {
            wallet: wallet.id
        }), this)
    }

    public async getCheckout(items: string[] | Package[]): Promise<any> {
        return this.network.call('store/checkout', {
            items: items.map(i => 'id' in i ? i.id : i)
        })
    }

}