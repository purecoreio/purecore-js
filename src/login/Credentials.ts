import Token from "./Token";

export default class Credentials extends EventTarget {

    publicId: string | undefined;
    userToken: Token | undefined;

    saveUserToken() {

        if (this.userToken.refreshToken) {

            localStorage.setItem(btoa("purecore-access-token"), btoa(JSON.stringify({
                accessToken: this.userToken.accessToken,
                expires: this.userToken.expires
            })))

            if (this.userToken.refreshToken) {
                localStorage.setItem(btoa("purecore-refresh-token"), btoa(JSON.stringify({
                    refreshToken: this.userToken.refreshToken,
                })))
            }
        }

        this.dispatchEvent(new Event('loaded'));
    }

    public get authenticated(): boolean {
        return this.userToken && this.userToken.accessToken != null
    }

    attemptLoadFromLocalStorage() {
        if (localStorage) {
            // if an offline token was generated, this will automatically retrieve if from localstorage
            const accessToken = localStorage.getItem(btoa("purecore-access-token"))
            const refreshToken = localStorage.getItem(btoa("purecore-refresh-token"))
            if (accessToken || refreshToken) {
                const accessTokenParsed = JSON.parse(atob(accessToken))
                this.userToken = new Token(accessTokenParsed.accessToken, new Date(accessTokenParsed.expires), JSON.parse(atob(refreshToken)).refreshToken)
            }
        }
        this.dispatchEvent(new Event('loaded'));
    }

    clear() {

        this.dispatchEvent(new Event('cleared'));

        this.publicId = undefined
        this.userToken = undefined
        localStorage.removeItem(btoa("purecore-access-token"))
        localStorage.removeItem(btoa("purecore-refresh-token"))
    }

}