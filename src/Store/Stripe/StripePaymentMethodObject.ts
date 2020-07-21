///<reference path="StripePaymentMethodType.ts"/>
interface StripePaymentMethodObject {
    id: string,
    billing_details: {
        address: {
            city: string,
            country: string,
            line1: string,
            line2: string,
            postal_code: string,
            state: string
        }
        email: string,
        name: string,
        phone: string
    },
    customer: string,
    metadata: any,
    type: StripePaymentMethodType,
    au_becs_debit?: {
        bsb_number: string,
        fingerprint: string,
        last4: string
    },
    bacs_debit?: {
        fingerprint: string,
        last4: string,
        short_code: string
    },
    card?: {
        brand: StripeCardBrand,
        checks: {
            address_line1_check: StripeCheckType,
            address_postal_code: StripeCheckType,
            cvc_check: StripeCheckType
        },
        country: string,
        exp_month: number,
        exp_year: number,
        fingerprint: string,
        funding: string,
        generated_from: any,
        last4: string,
        networks: {
            available: Array<string>,
            preferred: string
        },
        three_d_secure_usage: {
            supported: boolean
        },
        wallet: any,
    },
    card_present?: any,
    created: number,
    eps: any,
    fpx: any,
    giropay: any,
    ideal: any,
    interac_present: any,
    livemode: boolean,
    p24: any,
    sepa_debit: any
}
