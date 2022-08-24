export type processor = 'stripe' | 'paypal' | 'coinbase' | 'mollie'

export function fromNumber(n: number): processor {
    switch (n) {
        case 0:
            return 'paypal'
        case 1:
            return 'stripe'
        case 2:
            return 'mollie'
        case 3:
            return 'coinbase'
        default:
            throw new Error("unknown service")
    }
}

export function asNumber(processor: processor): number {
    switch (processor) {
        case 'paypal':
            return 0
        case 'stripe':
            return 1
        case 'mollie':
            return 2
        case 'coinbase':
            return 3
        default:
            throw new Error("unknown service");

    }
}