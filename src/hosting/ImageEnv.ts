import { call } from "../http/Call"
import HostingImage from "./HostingImage"

export default class ImageEnv {

    public readonly id: string
    public readonly image: HostingImage
    public readonly key: string
    private _adjustable: boolean
    private _description: string | null
    private _reference: string | null
    private _values: string[] | null
    private _regex: RegExp | null
    private _mandatory: boolean
    private _default: string | null
    private _requirements: Map<string, RegExp>

    public get adjustable(): boolean { return this._adjustable }
    public get description(): string | null { return this._description }
    public get reference(): string | null { return this._reference }
    public get values(): string[] | null { return this._values }
    public get regex(): RegExp | null { return this._regex }
    public get mandatory(): boolean { return this._mandatory }
    public get default(): string | null { return this._default }
    public get requirements(): Map<string, RegExp> { return this._requirements }

    constructor(id: string, image: HostingImage, key: string, adjustable: boolean, description: string | null, reference: string | null, values: string[] | null, regex: RegExp | null, mandatory: boolean, defo: string | null, requirements: Map<string, RegExp>) {
        this.id = id
        this.image = image
        this.key = key
        this._adjustable = adjustable
        this._description = description
        this._reference = reference
        this._values = values
        this._regex = regex
        this._mandatory = mandatory
        this._default = defo
        this._requirements = requirements
    }

    private static parseRegExString(regexStr: string): RegExp {
        return new RegExp(regexStr.substring(1, regexStr.length - 1))
    }

    static sanitizeRegEx(regex: RegExp): string {
        const str = regex.toString()
        return str.substring(1, str.length - 1)
    }

    public static fromObject(obj: any, image: HostingImage): ImageEnv {
        return new ImageEnv(
            obj.id,
            image,
            obj.key,
            obj.adjustable,
            obj.description,
            obj.reference,
            obj.values,
            obj.regex ? ImageEnv.parseRegExString(obj.regex) : null,
            obj.mandatory,
            obj.default,
            new Map<string, RegExp>(Object.entries(obj.requirements).map(e => [e[0], ImageEnv.parseRegExString(<string>e[1])]))
        )
    }

    public async delete(): Promise<void> {
        return this.image.deleteEnv(this)
    }

    public async update(defo?: string | null, mandatory?: boolean, filter?: RegExp | string[], reference?: string | null, description?: string | null, adjustable?: boolean, requirements?: Map<string, RegExp>): Promise<ImageEnv> {
        let obj: any = {
            default: defo,
            mandatory: mandatory,
            reference: reference,
            description: description,
            adjustable: adjustable,
            requirements: requirements ? Object.fromEntries(Array.from(requirements, ([k, v]) => {
                const regStr = v.toString()
                return [k, regStr.substring(1, regStr.length - 1)]
            })) : undefined
        }
        if (filter != undefined) {
            if (filter == null) {
                obj = {
                    ...obj,
                    regex: null,
                    values: null,
                }
            } else if (Array.isArray(filter)) {
                obj = {
                    ...obj,
                    regex: null,
                    values: filter,
                }
            } else {
                obj = {
                    ...obj,
                    regex: ImageEnv.sanitizeRegEx(filter),
                    values: null,
                }
            }
        }
        await call(`user/hosting/image/${this.image.id}/env/${this.id}`, obj, 'PATCH')
        if (defo != undefined) this._default = defo
        if (mandatory != undefined) this._mandatory = mandatory
        if (filter != undefined) {
            if (Array.isArray(filter)) {
                this._values = filter
                this._regex = null
            } else if (filter == null) {
                this._values = null
                this._regex = null
            } else {
                this._values = null
                this._regex = filter
            }
        }
        if (reference != undefined) this._reference = reference
        if (description != undefined) this._description = description
        if (adjustable != undefined) this._adjustable = adjustable
        if (requirements != undefined) this._requirements = requirements
        return this
    }

}