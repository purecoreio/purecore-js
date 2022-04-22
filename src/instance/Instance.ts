import { call } from "../http/Call";
import Network from "./Network";
import NetworkOwned from "./NetworkOwned";

export default class Instance extends NetworkOwned {

    public readonly id: string
    private path: string

    constructor(network: Network, id: string, path: string) {
        super(network)
        this.id = id
        this.path = path
    }

    public static fromObject(network: Network, object: any): Instance {
        return new Instance(network, object.id, object.path)
    }

    public get getPath(): string {
        return this.path
    }

    public async update(path: string): Promise<Instance> {
        await call(`network/${this.network.id}/instance/${this.id}`, {
            path: path
        }, 'PATCH')
        this.path = path
        return this
    }

    public async delete(): Promise<void> {
        await call(`network/${this.network.id}/instance/${this.id}`, undefined, 'DELETE')
    }

}