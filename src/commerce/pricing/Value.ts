export class Value {

    amount: number
    currency: string

    constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
    }

    static fromObject(obj: any): Value {
        return new Value(obj.amount,obj.currency)
    }

}