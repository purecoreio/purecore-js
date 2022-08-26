import { call } from "../http/Call"
import ImageEnv from "./ImageEnv"

export default class HostingImage {

    public readonly id: string
    public readonly image: string
    private _tags: string[]
    private _envs: ImageEnv[]
    private _support: URL[]
    private _credits: Map<string, URL>

    public get tags(): string[] { return this._tags }
    public get envs(): ImageEnv[] { return this._envs }
    public get support(): URL[] { return this._support }
    public get creduts(): Map<string, URL> { return this._credits }

    constructor(id: string, image: string, tags: string[], envs: ImageEnv[], support: URL[], credits: Map<string, URL>) {
        this.id = id
        this.image = image
        this._tags = tags
        this._envs = envs
        this._support = support
        this._credits = credits
    }

    public static fromObject(obj: any): HostingImage {
        const image = new HostingImage(
            obj.id,
            obj.image,
            obj.tags,
            [],
            obj.support.map(p => new URL(p)),
            new Map(Object.entries(obj.credits))
        )
        image._envs = obj.envs.map(e => ImageEnv.fromObject(e, image))
        return image
    }

    public async delete(): Promise<void> {
        await call(`user/hosting/image/${this.id}`, undefined, 'DELETE')
    }

    public async addEnv(key: string, filter: string[] | RegExp, defo?: string): Promise<ImageEnv> {
        return ImageEnv.fromObject(await call(`user/hosting/image/${this.id}/env`, {
            key: key,
            default: defo,
            regex: Array.isArray(filter) ? undefined : filter,
            values: Array.isArray(filter) ? filter : undefined
        }, 'POST'), this)
    }

}