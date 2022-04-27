
import PerkCategory from "./PerkCategory"

export default class Perk {

    public readonly id: string
    private _category: PerkCategory

    constructor(id: string, category: PerkCategory) {
        this.id = id
        this._category = category
    }

    public get category(): PerkCategory { return this._category }

    public static fromObject(obj: any, category?: PerkCategory): Perk {
        return new Perk(obj.id, category)
    }

}