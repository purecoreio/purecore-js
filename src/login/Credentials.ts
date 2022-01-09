class Credentials {

    static publicId: string | undefined;
    static userToken: Token | undefined;

    static saveUserToken() {
        if (Credentials.userToken.refreshToken) {
            localStorage.setItem(btoa("purecore-access-token"), btoa(JSON.stringify({
                accessToken: Credentials.userToken.accessToken,
                expires: Credentials.userToken.expires
            })))

            if (Credentials.userToken.refreshToken) {
                localStorage.setItem(btoa("purecore-refresh-token"), btoa(JSON.stringify({
                    refreshToken: Credentials.userToken.refreshToken,
                })))
            }
        }
    }

    static attemptLoadFromLocalStorage() {
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

    static clear() {
        Credentials.publicId = undefined
        Credentials.userToken = undefined
        localStorage.removeItem(btoa("purecore-access-token"))
        localStorage.removeItem(btoa("purecore-refresh-token"))
    }

}