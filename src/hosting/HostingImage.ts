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

    public async deleteEnv(env: ImageEnv): Promise<void> {
        await call(`user/hosting/image/${this.id}/env/${env.id}`, undefined, 'DELETE')
        this._envs = this.envs.filter(e => e.id != env.id)
    }

    public async addEnv(key: string, filter: string[] | RegExp, mandatory: boolean, defo?: string): Promise<ImageEnv> {
        let obj: any = {
            key: key,
            mandatory: mandatory,
            default: defo,
        }
        if (filter) {
            if (Array.isArray(filter)) {
                obj = { ...obj, values: filter }
            } else {
                obj = { ...obj, regex: ImageEnv.sanitizeRegEx(filter) }
            }
        }
        const env = ImageEnv.fromObject(await call(`user/hosting/image/${this.id}/env`, obj, 'POST'), this)
        this.envs.push(env)
        return env
    }

}