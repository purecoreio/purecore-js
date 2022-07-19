import { Value } from "./Value"

export class Amount {

    original: Value
    local?: Value

    constructor(original: Value, local?: Value) {
        this.original = original
        this.local = local
    }

    static fromObject(obj: any): Amount {
        return new Amount(Value.fromObject(obj.original), obj.local ? Value.fromObject(obj.local) : undefined)
    }

}