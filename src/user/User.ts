import Popup from "../dom/Popup"
import Call from "../http/Call"
import Network from "../instance/Network"
import Credentials from "../login/Credentials"

export default class User {

    public readonly id: string

    constructor(id: string) {
        this.id = id
    }

    public async createNetwork(name: string, cname: string): Promise<Network> {
        const network = await Call.commit("network", {
            name: name,
            cname: cname
        })
        return Network.fromObject(network)
    }

    public async getNetworks(): Promise<Network[]> {
        const networks: any[] = await Call.commit("network")
        return networks.map(o => Network.fromObject(o))
    }

    public async getProfiles(): Promise<Profile[]> {
        const profileData = await Call.commit("user/profiles")
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
        return await Popup.openPopup(`/oauth/link/${processor}/?access_token=${Credentials.userToken.accessToken}`, 'wallet')
    }

}