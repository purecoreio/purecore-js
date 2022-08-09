import Elements from "./elements/Elements";
import { call } from "./http/Call";
import Network from "./instance/network/Network";
import Credentials from "./login/Credentials";
import LoginHelper from "./login/LoginHelper";
import Token from "./login/Token";
import User from "./user/User";

export default class Core {

    private static test: boolean = false;
    public static readonly credentials: Credentials = new Credentials();

    constructor(publicId?: string, test: boolean = false) {
        Core.test = test
        Core.credentials.publicId = publicId
        Core.credentials.attemptLoadFromLocalStorage()
    }

    public get elements() { return new Elements() }

    public static getElementsREST(): string {
        if (Core.test) {
            return "http://localhost:3002"
        } else {
            return "https://elements.purecore.io"
        }
    }

    public static getBaseREST(): string {
        if (Core.test) {
            return "http://localhost:3000"
        } else {
            return "https://api.purecore.io"
        }
    }

    public getCredentials(): Credentials {
        return Core.credentials
    }

    public async getUser(): Promise<User> {
        return User.fromObject(await call("user/"))
    }

    public async login(method: Method, scope: scope[] = ["offline"], redirectURI?: string, state?: string): Promise<Core> {
        const token: Token = await LoginHelper.login(method, scope, redirectURI ? "code" : "token", Core.credentials.publicId, redirectURI, state, Core.credentials.userToken ? Core.credentials.userToken.accessToken : null)

        if (!Core.credentials.userToken) {
            // keep the old user token if it was an account link, since it will still be valid
            Core.credentials.userToken = token
            Core.credentials.saveUserToken()
        }
        return this
    }

}

export {
    User,
    Network
}