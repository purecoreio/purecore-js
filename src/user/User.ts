import Core from "../Core"
import Popup from "../dom/Popup"
import { call } from "../http/Call"
import Network from "../instance/Network"
import Profile from "./Profile"

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
        return Network.fromObject(await call(`network/${id}`))
    }

    public async getProfiles(): Promise<Profile[]> {
        const profileData = await call("user/profiles")
        const profiles: Profile[] = []
        profileData.forEach(element => {
            profiles.push(Profile.fromObject(element))
        });
        return profiles
    }

    public static fromObject(object: any): User {
        return new User(object.id)
    }

    public async linkWallet(processor: processor): Promise<any> {
        return await Popup.openPopup(`/oauth/link/${processor}/?access_token=${Core.credentials.userToken.accessToken}`, 'wallet')
    }

}