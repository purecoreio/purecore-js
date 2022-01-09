class Core {

    private privateId: string | undefined;        // api key

    constructor(publicId?: string) {
        Credentials.publicId = publicId

        if (localStorage) {
            // if an offline token was generated, this will automatically retrieve if from localstorage
            const accessToken = localStorage.getItem(btoa("purecore-access-token"))
            const refreshToken = localStorage.getItem(btoa("purecore-refresh-token"))
            if (accessToken && refreshToken) {
                const accessTokenParsed = JSON.parse(atob(accessToken))
                Credentials.userToken = new Token(accessTokenParsed.accessToken, new Date(accessTokenParsed.expires), JSON.parse(atob(refreshToken)).refreshToken)
            }
        }

    }

    public getUser(): User {
        return new User()
    }

    public async login(method: Method, scope: Scope = ["offline", "payment/autofill", "profile/list", "profile/link", "defaultScope"], redirectURI?: string, state?: string): Promise<Core> {
        if (scope.includes("defaultScope") && Credentials.publicId && !scope.includes(`network/${Credentials.publicId}`)) scope.push(`network/${Credentials.publicId}`)
        scope = scope.filter(item => item !== "defaultScope")
        const token: Token = await LoginHelper.login(method, scope, redirectURI ? "code" : "token", Credentials.publicId, redirectURI, state, Credentials.userToken ? Credentials.userToken.accessToken : null)

        if (!Credentials.userToken) {
            // keep the old user token if it was an account link, since it will still be valid
            Credentials.userToken = token
            Credentials.saveUserToken()
        }
        return this
    }

}

try {
    module.exports = Core;
} catch (error) {

}