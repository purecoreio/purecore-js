import { call } from "../http/Call"
import { startRegistration } from "@simplewebauthn/browser"
import { PublicKeyCredentialCreationOptionsJSON, RegistrationCredentialJSON } from "@simplewebauthn/typescript-types"
import Core from "../Core"
import Token from "./Token"

export default class EmailVerification {

    public readonly email: string
    public readonly challenge: PublicKeyCredentialCreationOptionsJSON
    private _code: string | null
    private _credential: RegistrationCredentialJSON | null

    public get code(): string | null { return this._code }
    public get credential(): RegistrationCredentialJSON | null { return this._credential }
    public set code(code: string) {
        if (code.length != 6) throw new Error("invalid verification code")
        this._code = code
    }

    constructor(email: string, challenge: PublicKeyCredentialCreationOptionsJSON) {
        this.email = email
        this.challenge = challenge
        this._code = null
        this._credential = null
    }

    public static async request(email: string): Promise<EmailVerification> {
        // check biometric (platform) authentication availability
        if (!window.PublicKeyCredential) throw new Error("no authentication mechanism available")
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if (!available) throw new Error("no biometric authentication available")

        // actually request a login challenge
        const challenge = await call('user/auth/email/request', {
            email: email
        })
        return new EmailVerification(email, challenge)
    }

    public async fulfillCredential(): Promise<void> {
        this._credential = await startRegistration(this.challenge)
    }

    public async submit(code?: string): Promise<void> {
        if (code) this.code = code
        if (!this.code) throw new Error("missing email verification code")
        if (!this.credential) throw new Error("missing biometric authentication credential")

        const token = await call('user/auth/email/verify', {
            credential: this.credential,
            email: this.email,
            code: this.code
        })

        Core.credentials.storePublicKey(this.credential.id, this.challenge.user.id)
        Core.credentials.saveLogin(Token.fromObject(token))
    }

}