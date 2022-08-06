import { processor } from "../commerce/processor"
import Core from "../Core"
import Popup from "../dom/Popup"
import { call } from "../http/Call"
import Network from "../instance/network/Network"
import Profile from "./Profile"
import Wallet from "./Wallet"

export default class User {

    public readonly id: string

    constructor(id: string) {
        this.id = id
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