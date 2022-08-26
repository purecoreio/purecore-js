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

    public get adjustable(): boolean { return this._adjustable }
    public get description(): string | null { return this._description }
    public get reference(): string | null { return this._reference }
    public get values(): string[] | null { return this._values }
    public get regex(): RegExp | null { return this._regex }
    public get mandatory(): boolean { return this._mandatory }
    public get default(): string | null { return this._default }

    constructor(id: string, image: HostingImage, adjustable: boolean, description: string | null, reference: string | null, values: string[] | null, regex: RegExp | null, mandatory: boolean, defo: string | null) {
        this.id = id
        this.image = image
        this._adjustable = adjustable
        this._description = description
        this._reference = reference
        this._values = values
        this._regex = regex
        this._mandatory = mandatory
        this._default = defo
    }

    public static fromObject(obj: any, image: HostingImage): ImageEnv {
        return new ImageEnv(
            obj.id,
            image,
            obj.adjustable,
            obj.description,
            obj.reference,
            obj.values,
            obj.regex ? new RegExp(obj.regex) : null,
            obj.mandatory,
            obj.default
        )
    }

    public async delete(): Promise<void> {
        await call(`user/hosting/image/${this.image.id}/env/${this.id}`, undefined, 'DELETE')
    }

    public async update(defo?: string | null, mandatory?: boolean, filter?: RegExp | string[], reference?: string | null, description?: string | null, adjustable?: boolean): Promise<ImageEnv> {
        await call(`user/hosting/image/${this.image.id}/env/${this.id}`, {
            default: defo,
            mandatory: mandatory,
            values: filter ? (Array.isArray(filter) ? filter : null) : undefined,
            regex: filter ? (Array.isArray(filter) ? null : filter) : undefined,
            reference: reference,
            description: description,
            adjustable: adjustable,
        }, 'PATCH')
        if (defo != undefined) this._default = defo
        if (mandatory != undefined) this._mandatory = mandatory
        if (filter != undefined) {
            if (Array.isArray(filter)) {
                this._values = filter
                this._regex = null
            } else {
                this._values = null
                this._regex = filter
            }
        }
        if (reference != undefined) this._reference = reference
        if (description != undefined) this._description = description
        if (adjustable != undefined) this._adjustable = adjustable
        return this
    }

}