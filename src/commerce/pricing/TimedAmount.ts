export enum Timing {
    INSTANT = 0,
    OFFSET = 1,
    DATE = 2
}

export default interface TimedAmount {

    readonly type: Timing
    readonly timing: number | Date | null
    readonly period: number | null
    readonly amount: number
    readonly currency: string

}

export function fromObject(obj: any): TimedAmount {
    return <TimedAmount>{
        amount: obj.amount,
        currency: obj.currency,
        type: obj.type,
        timing: obj.type == Timing.DATE ? new Date(obj.timing) : obj.timing,
        period: obj.period
    }
}