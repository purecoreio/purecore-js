import Network from "../instance/Network"
import NetworkOwned from "../instance/NetworkOwned"
import Perk from "./Perk"

export default class PerkCategory extends NetworkOwned {

    public readonly id: string

    private _perks: Perk[]

    constructor(id: string, network: Network, perks: Perk[]) {
        super(network)
        this.id = id
        this._perks = perks
    }

    public get perks(): Perk[] { return this._perks }

    public static fromObject(obj: any, network: Network) {
        let category: PerkCategory
        category = new PerkCategory(obj.id, network, obj.perks.map(perk => Perk.fromObject(perk, category)))
        return category
    }

}