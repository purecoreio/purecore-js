import { Amount } from "./Amount";

export enum Timing {
    INSTANT = 0,
    OFFSET = 1,
    DATE = 2
}

export class TimedAmount {

    amount: Amount
    type: Timing
    timing: number | null
    period: number | null

    constructor(amount: Amount, type: Timing, timing: number | null, period: number | null) {
        this.amount = amount
        this.type = type
        this.timing = timing
        this.period = period
    }

    public static fromObject(obj: any): TimedAmount {
        return new TimedAmount(Amount.fromObject(obj), obj.type, obj.timing, obj.period)
    }

}