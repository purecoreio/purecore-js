import { fromNumber, processor } from "../commerce/processor"


export default class Wallet {

    service: processor
    eid: string
    id: string
    available: boolean
    created: Date
    updated: Date

    constructor(service: processor, eid: string, id: string, available: boolean, created: Date, updated: Date) {
        this.service = service
        this.eid = eid
        this.id = id
        this.available = available
        this.created = created
        this.updated = updated
    }

    public static fromObject(obj: any): Wallet {
        return new Wallet(fromNumber(obj.service), obj.eid, obj.id, obj.available, new Date(obj.created), new Date(obj.updated))
    }

    public get limitsURL(): string {
        switch (this.service) {
            case 'stripe':
                return 'https://dashboard.stripe.com/settings/update'
            case 'paypal':
                return 'https://www.paypal.com/disputes/'
            case 'mollie':
                return 'https://my.mollie.com/dashboard'
            case 'coinbase':
                return 'https://beta.commerce.coinbase.com/'
            default:
                throw new Error("unknown URL")
        }
    }

}