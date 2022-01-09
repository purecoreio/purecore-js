class Core {

    public static publicId: string | undefined; // client id
    private privateId: string | undefined;        // api key
    private static userToken: Token | undefined;         // user jwt token

    constructor(publicId?: string) {
        Core.publicId = publicId

        if (localStorage) {
            // if an offline token was generated, this will automatically retrieve if from localstorage
            const accessToken = localStorage.getItem(btoa("purecore-access-token"))
            const refreshToken = localStorage.getItem(btoa("purecore-refresh-token"))
            if (accessToken && refreshToken) {
                const accessTokenParsed = JSON.parse(atob(accessToken))
                Core.userToken = new Token(accessTokenParsed.accessToken, new Date(accessTokenParsed.expires), JSON.parse(atob(refreshToken)).refreshToken)
            }
        }

    }

    public static async call(endpoint: string, data?: any, refreshCall: boolean = false) {
        let options: any = {
            method: "GET",
            headers: new Headers({
                'Accept': 'application/json',
            }),
        }
        if (Core.userToken && !refreshCall) {
            const newToken = await Core.userToken.use()
            if (newToken) {
                Core.userToken = newToken
                Core.saveToken()
            }
            options.headers = new Headers({
                'Accept': 'application/json',
                'Authorization': `Bearer ${Core.userToken.accessToken}`,
            })
        }
        if (data) {
            options = {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${Core.userToken.accessToken}`,
                }),
                body: JSON.stringify(data)
            }
        }
        const response = await fetch(`https://api.purecore.io${endpoint}`, options)
        if (response.ok) {
            return await response.json()
        } else {
            throw new Error(await response.text())
        }
    }

    public getUser(): User {
        return new User()
    }

    public async login(method: Method, scope: Scope = ["offline", "payment/autofill", "profile/list", "profile/link", "defaultScope"], redirectURI?: string, state?: string): Promise<Core> {
        if (scope.includes("defaultScope") && Core.publicId && !scope.includes(`network/${Core.publicId}`)) scope.push(`network/${Core.publicId}`)
        scope = scope.filter(item => item !== "defaultScope")
        const token: Token = await LoginHelper.login(method, scope, redirectURI ? "code" : "token", Core.publicId, redirectURI, state, Core.userToken ? Core.userToken.accessToken : null)

        if (!Core.userToken) {
            // keep the old user token if it was an account link, since it will still be valid
            Core.userToken = token
            Core.saveToken()
        }
        return this
    }

    private static saveToken() {
        if (Core.userToken.refreshToken) {
            localStorage.setItem(btoa("purecore-access-token"), btoa(JSON.stringify({
                accessToken: Core.userToken.accessToken,
                expires: Core.userToken.expires
            })))

            if (Core.userToken.refreshToken) {
                localStorage.setItem(btoa("purecore-refresh-token"), btoa(JSON.stringify({
                    refreshToken: Core.userToken.refreshToken,
                })))
            }
        }
    }

}

try {
    module.exports = Core;
} catch (error) {

}