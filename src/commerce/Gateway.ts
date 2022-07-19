import Network from "../instance/Network"
import NetworkOwned from "../instance/NetworkOwned"
import Wallet from "../user/Wallet"
import Store from "./Store"

export default class Gateway implements NetworkOwned {

    public readonly store: Store
    public readonly id: string
    public readonly wallet: Wallet

    constructor(id: string, wallet: Wallet, store: Store) {
        this.id = id
        this.wallet = wallet
        this.store = store
    }
    
    get network(): Network {
        throw this.store.network
    }

    public static fromObject(obj: any, store: Store): Gateway {
        return new Gateway(obj.id, Wallet.fromObject(obj.wallet), store)
    }

}