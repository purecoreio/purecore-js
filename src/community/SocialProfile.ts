import Network from "../instance/network/Network"
import NetworkOwned from "../instance/NetworkOwned"

export enum MediaPlatform {
    DISCORD = 0,    // discord server
    TWITTER = 1,    // acc
    REDDIT = 2,     // subreddit
    YOUTUBE = 3,    // acc
    STEAM = 4,      // steam group
    TWITCH = 5      // acc
}

export default class SocialProfile implements NetworkOwned {

    public readonly network: Network
    public readonly id: string
    public readonly platform: MediaPlatform
    public readonly eid: string
    public readonly name: string

    constructor(network: Network, id: string, platform: MediaPlatform, eid: string, name: string) {
        this.network = network
        this.id = id
        this.platform = platform
        this.eid = eid
        this.name = name
    }

    public static fromObject(network: Network, obj: any): SocialProfile {
        return new SocialProfile(
            network,
            obj.id,
            obj.platform,
            obj.eid,
            obj.name
        )
    }

}