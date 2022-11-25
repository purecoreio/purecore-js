import { processor } from "../commerce/processor"
import Core from "../Core"
import Popup from "../dom/Popup"
import { call } from "../http/Call"
import Network from "../instance/network/Network"
import Profile from "./Profile"
import Wallet from "./Wallet"
import { Address } from "@stripe/stripe-js"
import Machine from "../hosting/Machine"
import HostingImage from "../hosting/HostingImage"
import ResourceTemplate from "../hosting/ResourceTemplate"

export enum Plan {
    FREE = 0,
    PLUS = 1
}

export default class User {

    public readonly id: string

    constructor(id: string) {
        this.id = id
    }

    public async getAddress(): Promise<Address> {
        return (await call('user/address')) as Address
    }

    public async setAddress(address: Address): Promise<void> {
        await call('user/address', address, 'PATCH')
    }

    public async getPlan(): Promise<Plan> {
        return (await call('user/plan')).plan
    }

    public async createMachine(): Promise<Machine> {
        return Machine.fromObject(await call('user/hosting/machine', undefined, 'POST'))
    }

    public async getMachines(): Promise<Machine[]> {
        return (await call('user/hosting/machine')).map(m => Machine.fromObject(m))
    }

    public async createResourceTemplate(images: HostingImage[], cores: number, memory: number, storage?: number): Promise<ResourceTemplate> {
        return ResourceTemplate.fromObject(await call('user/hosting/template', {
            images: images.map(i => i.id),
            cores: cores,
            memory: memory,
            storage: storage
        }))
    }

    public async getResourceTemplates(): Promise<ResourceTemplate[]> {
        return (await call('user/hosting/template')).map(t => ResourceTemplate.fromObject(t))
    }

    public async getResourceTemplate(id: string): Promise<ResourceTemplate> {
        return ResourceTemplate.fromObject(await call(`user/hosting/template/${id}`))
    }

    public async createHostingImage(image: string, tags: string[] | null = null): Promise<HostingImage> {
        return HostingImage.fromObject(await call('user/hosting/image', {
            image: image,
            tags: tags
        }))
    }

    public async getHostingImages(): Promise<HostingImage[]> {
        return (await call('user/hosting/image')).map(m => HostingImage.fromObject(m))
    }

    public async getHostingImage(id: string): Promise<HostingImage> {
        return HostingImage.fromObject(await call(`user/hosting/image/${id}`))
    }

    public async createNetwork(name: string, cname: string): Promise<Network> {
        const network = await call("network", {
            name: name,
            cname: cname
        })
        return Network.fromObject(network)
    }

    public async getNetworks(): Promise<Network[]> {
        const networks: any[] = await call("network")
        return networks.map(o => Network.fromObject(o))
    }

    public async getNetwork(id): Promise<Network> {
        return new Network(id, '', '').refresh()
    }

    public async getProfiles(): Promise<Profile[]> {
        const profiles = await call("user/profiles") as Array<any>
        return profiles.map((p) => Profile.fromObject(p))
    }

    public async getWallets(): Promise<Wallet[]> {
        const wallets = await call("user/wallets") as Array<any>
        return wallets.map((w) => Wallet.fromObject(w))
    }

    public static fromObject(object: any): User {
        return new User(object.id)
    }

    public async linkWallet(processor: processor, network?: Network, privateKey?: string, publicKey?: string): Promise<void> {
        if (processor == 'coinbase') {
            // public+private key
            if (!privateKey) throw new Error("missing private key")
            await call(`/user/wallets/link/${processor}`, {
                privateKey: privateKey,
                publicKey: publicKey ?? null
            }, 'POST', true, true)
        } else {
            await Popup.openPopup(`/rest/3/user/wallets/link/${processor}?access_token=${Core.credentials.userToken.accessToken}` + (network ? `&network=${network.id}` : ''), "callback")
        }
    }

    public async logout() {
        // TODO token
        Core.credentials.clear()
    }

}