import PerkUsage from "./PerkUsage";

export default class Package {

    public readonly id: string
    private _index: number;
    private _name: string;
    private _description?: string
    private _elastic: boolean
    private _perks: PerkUsage[]

    constructor(id: string, index: number, name: string, elastic: boolean, perks: PerkUsage[], description?: string) {
        this.id = id
        this._index = index
        this._name = name
        this._description = description
        this._elastic = elastic
        this._perks = perks
    }

    public get index(): number { return this._index }
    public get name(): string { return this._name }
    public get description(): string { return this._description }
    public get elastic(): boolean { return this._elastic }
    public get perks(): PerkUsage[] { return this._perks }

}