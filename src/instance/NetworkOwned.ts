import Network from "./Network";

export default interface NetworkOwned {

    get network(): Network | Promise<Network>

}