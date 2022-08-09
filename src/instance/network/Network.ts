import Store from "../../commerce/Store";
import Community from "../../community/Community";
import { call, method } from "../../http/Call";
import Instance from "../Instance";
import Branding from "./Branding";
import * as SetupSteps from "./SetupSteps";

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

    public async refresh(): Promise<Network> {
        const network = await this.call()
        this._name = network.name
        this._cname = network.cname
        return this
    }

    public async getSetupSteps(): Promise<SetupSteps.SetupSteps> {
        return SetupSteps.fromObject(await this.call('setup'))
    }

    public async getMissingSetupSteps(): Promise<SetupSteps.SetupFlag[]> {
        const steps = await this.getSetupSteps()
        let missing = []
        steps.forEach((value, step) => {
            if (!value) missing.push(step)
        });
        return missing
    }

    public async getBranding(): Promise<Branding> {
        return Branding.fromObject(this, await this.call('branding'))
    }

    public async setSetupStep(step: SetupSteps.SetupFlag, value: boolean): Promise<void> {
        await this.call('setup', {
            step: step,
            value: value
        }, 'PATCH')
    }

    public get store() { return new Store(this) }

    public async call(path: string = '', data?: any, method?: method): Promise<any> {
        return call(`network/${this.id}/${path}`, data, method)
    }

    public async update(name?: string, cname?: string): Promise<Network> {
        const obj: any = {}
        if (name) obj.name = name
        if (cname) obj.cname = cname
        const result = await this.call('', obj, 'PATCH')
        this._cname = result.cname;
        this._name = result.name;
        return this
    }

    public get community(): Community { return new Community(this) }

    public async delete(): Promise<void> {
        return await call(`network/${this.id}`, undefined, 'DELETE')
    }

    public async createInstance(path: string): Promise<Instance> {
        return Instance.fromObject(this, await this.call(`instance`, {
            path: path
        }))
    }

    public async getInstances(): Promise<Instance[]> {
        const instances: any[] = await this.call(`instance`)
        return instances.map(o => Instance.fromObject(this, o))
    }

    public async getInstance(id: string): Promise<Instance> {
        return Instance.fromObject(this, await this.call(`instance/${id}`))
    }

}