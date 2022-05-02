import Store from "../commerce/Store";
import { call } from "../http/Call";
import Instance from "./Instance";

export default class Network {

    public readonly id: string;
    private _name: string;
    private _cname: string;

    constructor(id: string, name: string, cname: string) {
        this.id = id;
        this._name = name;
        this._cname = cname;
    }

    public get name(): string { return this._name }
    public get cname(): string { return this._cname }

    public static fromObject(object: any): Network {
        return new Network(object.id, object.name, object.cname)
    }

    public async getStore(): Promise<Store> {
        return new Store(this)
    }

    public async update(name?: string, cname?: string): Promise<Network> {
        const obj: any = {}
        if (name) obj.name = name
        if (cname) obj.cname = cname
        const result = await call(`network/${this.id}`, obj, 'PATCH') as Network
        this._cname = result.cname;
        this._name = result.name;
        return this
    }

    public async delete(): Promise<void> {
        return await call(`network/${this.id}`, undefined, 'DELETE')
    }

    public async createInstance(path: string): Promise<Instance> {
        return Instance.fromObject(this, await call(`network/${this.id}/instance`, {
            path: path
        }))
    }

    public async getInstances(): Promise<Instance[]> {
        const instances: any[] = await call(`network/${this.id}/instance`)
        return instances.map(o => Instance.fromObject(this, o))
    }

    public async getInstance(id: string): Promise<Instance> {
        return Instance.fromObject(this, await call(`network/${this.id}/instance/${id}`))
    }

}