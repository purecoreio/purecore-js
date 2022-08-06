import { call } from "../http/Call";
import Network from "./network/Network";
import NetworkOwned from "./NetworkOwned";

export default class Instance implements NetworkOwned {

    public readonly network: Network
    public readonly id: string
    private _path: string

    constructor(network: Network, id: string, path: string) {
        this.network = network
        this.id = id
        this._path = path
    }

    public static fromObject(network: Network, object: any): Instance {
        return new Instance(network, object.id, object.path)
    }

    public get path(): string {
        return this._path
    }

    public async update(path: string): Promise<Instance> {
        await this.network.call(`instance/${this.id}`, {
            path: path
        }, 'PATCH')
        this._path = path
        return this
    }

    public async delete(): Promise<void> {
        await this.network.call(`instance/${this.id}`, undefined, 'DELETE')
    }

}