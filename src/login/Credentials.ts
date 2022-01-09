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
    
}