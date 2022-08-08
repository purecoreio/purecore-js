import Popup from "../dom/Popup";
import Network from "../instance/network/Network";
import NetworkOwned from "../instance/NetworkOwned";
import SocialProfile, { MediaPlatform } from "./SocialProfile";

export default class Media implements NetworkOwned {

    public readonly network: Network

    private _discord: SocialProfile | null
    private _twitter: SocialProfile | null
    private _reddit: SocialProfile | null
    private _youtube: SocialProfile | null
    private _steam: SocialProfile | null
    private _twitch: SocialProfile | null

    public get discord(): SocialProfile | null { return this._discord }
    public get twitter(): SocialProfile | null { return this._twitter }
    public get reddit(): SocialProfile | null { return this._reddit }
    public get youtube(): SocialProfile | null { return this._youtube }
    public get steam(): SocialProfile | null { return this._steam }
    public get twitch(): SocialProfile | null { return this._twitch }

    constructor(network: Network, discord: SocialProfile = null, twitter: SocialProfile = null, reddit: SocialProfile = null, youtube: SocialProfile = null, steam: SocialProfile = null) {
        this.network = network
        this._discord = discord
        this._twitter = twitter
        this._reddit = reddit
        this._youtube = youtube
        this._steam = steam
    }

    public static fromObject(network: Network, obj: any): Media {
        return new Media(
            network,
            obj.discord ? SocialProfile.fromObject(network, obj.discord) : null,
            obj.twitter ? SocialProfile.fromObject(network, obj.twitter) : null,
            obj.reddit ? SocialProfile.fromObject(network, obj.reddit) : null,
            obj.youtube ? SocialProfile.fromObject(network, obj.youtube) : null,
            obj.steam ? SocialProfile.fromObject(network, obj.steam) : null,
        )
    }

    public async link(media: MediaPlatform, url?: string) {
        switch (media) {
            case MediaPlatform.DISCORD:
                await Popup.openPopup(`/rest/3/network/${this.network.id}/community/media/discord/invite`)
                break;

            default:
                throw new Error("not yet implemented")
        }
    }

    public async refresh(): Promise<Media> {
        // TODO actually call, not endpoint yet
        const media = Media.fromObject(this.network, /*await this.network.call('community/media')*/ {})

        this._discord = media.discord
        this._twitter = media.twitter
        this._reddit = media.reddit
        this._youtube = media.youtube
        this._steam = media.steam

        return this
    }

}