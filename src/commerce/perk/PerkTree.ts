import Package from "../Package";
import PerkCategory from "./PerkCategory";
import PerkUsage from "./PerkUsage";

export default class PerkTree {

    public readonly package: Package
    public readonly category: PerkCategory
    public readonly perks: PerkUsage[]

    constructor(pkg: Package, category: PerkCategory, perks: PerkUsage[]) {
        this.package = pkg
        this.category = category
        this.perks = perks
    }

    public static fromObject(obj: any, pkg: Package): PerkTree {
        const category = PerkCategory.fromObject(obj.category, pkg.category.store)
        return new PerkTree(pkg, category, (obj.perks as any).map(perk => PerkUsage.fromObject(perk, pkg, category)))
    }


}