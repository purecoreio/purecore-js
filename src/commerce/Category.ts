import Package from "./Package";

export default class Category {

    public readonly id: string
    private _index: number;
    private _name: string;
    private _description?: string
    private _upgradable: boolean
    private _packages: Package[]

    constructor(id: string, index: number, name: string, upgradable: boolean, packages: Package[], description?: string) {
        this.id = id
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

}