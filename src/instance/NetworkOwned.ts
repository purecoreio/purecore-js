import Network from "./network/Network";

export default interface NetworkOwned {

    get network(): Network | Promise<Network>

}