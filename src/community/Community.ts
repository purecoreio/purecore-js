import Network from "../instance/network/Network";
import NetworkOwned from "../instance/NetworkOwned";
import Media from "./Media";

export default class Community implements NetworkOwned {

    public readonly network: Network

    constructor(network: Network) {
        this.network = network
    }

    public async getMedia(): Promise<Media> {
        return new Media(this.network).refresh()
    }

}