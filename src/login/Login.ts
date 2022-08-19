import { startAuthentication } from "@simplewebauthn/browser";
import Core from "../Core";
import { call } from "../http/Call";
import EmailVerification from "./EmailVerification";
import LoginHelper from "./LoginHelper";
import Token from "./Token";

export class Login {

    public async signupChallenge(eid: string): Promise<EmailVerification> {
        return EmailVerification.request(eid)
    }

    public async signinChallenge(): Promise<Token> {
        try {
            const pk = Core.credentials.getStoredPublicKey()
            const request = await call('user/auth/key/request', {
                user: pk.user,
                pkid: pk.pkid
            })
            const credential = await startAuthentication(request)
            const token = Token.fromObject(await call('user/auth/key/verify', {
                user: pk.user,
                credential: credential
            }))
            Core.credentials.saveLogin(token)
            return token
        } catch (error) {
            Core.credentials.clearStoredPublicKey()
            throw error
        }
    }

    public async oauth(method: Method, scope: scope[] = ["offline"], redirectURI?: string, state?: string): Promise<Token> {
        let token: Token
        switch (method) {
            case 'email':
                throw new Error("if you want to login using the email method, you should use a login flow allowing credential challenges")
            default:
                token = await LoginHelper.login(method, scope, redirectURI ? "code" : "token", Core.credentials.publicId, redirectURI, state, Core.credentials.userToken ? Core.credentials.userToken.accessToken : null)
                break;
        }
        Core.credentials.saveLogin(token)
        return token
    }

}