import Call from "./http/Call";
import Credentials from "./login/Credentials";
import LoginHelper from "./login/LoginHelper";
import Token from "./login/Token";
import User from "./user/User";

export default class Core {

    private static test: boolean;

    constructor(publicId?: string, test: boolean = false) {
        Core.test = test
        Credentials.publicId = publicId
        Credentials.attemptLoadFromLocalStorage()
    }

    public static getBase(): string {
        if (Core.test) {
            return "http://localhost:3000"
        } else {
            return "https://api.purecore.io"
        }
    }

    public async getUser(): Promise<User> {
        return User.fromObject(await Call.commit("user/"))
    }

    public async login(method: Method, scope: scope[] = ["offline"], redirectURI?: string, state?: string): Promise<Core> {
        const token: Token = await LoginHelper.login(method, scope, redirectURI ? "code" : "token", Credentials.publicId, redirectURI, state, Credentials.userToken ? Credentials.userToken.accessToken : null)

        if (!Credentials.userToken) {
            // keep the old user token if it was an account link, since it will still be valid
            Credentials.userToken = token
            Credentials.saveUserToken()
        }
        return this
    }

    public logout() {
        Credentials.clear()
    }

}