import Network from "./Network";

export default class NetworkOwned {

    public readonly network: Network

    constructor(network: Network) {
        this.network = network
    }

}