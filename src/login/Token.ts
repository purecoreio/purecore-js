import { Call } from "../http/Call"
import { Credentials } from "./Credentials"

export class Token {

    public readonly accessToken: string
    public readonly refreshToken: string | null
    public readonly expires: Date

    constructor(accessToken: string, expires: Date, refreshToken?: string | null) {
        this.accessToken = accessToken
        this.expires = expires
        this.refreshToken = refreshToken
    }

    public static fromObject(object: any): Token {
        return new Token(object.access_token, new Date(new Date().getTime() + object.expires_in * 1000), object.refresh_token)
    }

    public async use(): Promise<Token | null> {
        if (new Date().getTime() > this.expires.getTime()) {
            if (this.refreshToken) {
                let body: any = {
                    grant_type: "refresh_token",
                    refresh_token: this.refreshToken
                }
                if (Credentials.publicId) body["client_id"] = Credentials.publicId
                return Token.fromObject(await Call.commit("/oauth/token", body, 'POST', true, true))
            } else {
                throw new Error("expired access token")
            }
        } else {
            return null
        }
    }

}