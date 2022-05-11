interface Range {
    min?: number,
    max?: number
}

export interface NumericLimitation {

    global?: Range
    individual?: Range

}

function rangeFromObject(obj: any): Range {
    return {
        min: obj.min,
        max: obj.max
    } as Range
}

export function fromObject(obj: any): NumericLimitation {
    return {
        global: obj.global != null ? rangeFromObject(obj.global) : undefined,
        individual: obj.individual != null ? rangeFromObject(obj.individual) : undefined,
    }
}