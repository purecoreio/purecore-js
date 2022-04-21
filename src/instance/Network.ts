import { call } from "../http/Call";

export default class Network {
    public readonly id: string;
    public readonly name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static fromObject(object: any): Network {
        return new Network(object.id, object.name)
    }

    public async update(name?: string, cname?: string): Promise<Network> {
        const obj: any = {}
        if (name) obj.name = name
        if (cname) obj.cname = cname
        return await call(`network/${this.id}`, obj, 'PATCH') as Network
    }

    public async delete(): Promise<void> {
        return await call(`network/${this.id}`, undefined, 'DELETE')
    }

}