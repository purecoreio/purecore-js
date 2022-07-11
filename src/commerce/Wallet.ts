
export enum Integration {
    TIGHT = 0,
    LOOSE = 1
}

export default class Wallet {

    service: processor
    eid: string
    id: string
    integration: Integration
    available: boolean

    constructor(service: processor, eid: string, id: string, integration: Integration, available: boolean) {
        this.service = service
        this.eid = eid
        this.id = id
        this.integration = integration
        this.available = available
    }

    public static fromObject(obj: any): Wallet {
        return new Wallet(obj.service, obj.eid, obj.id, obj.integration, obj.available)
    }

}