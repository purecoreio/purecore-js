class Call {

    public static async commit(endpoint: string, data?: any, refreshCall: boolean = false) {
        let options: any = {
            method: "GET",
            headers: new Headers({
                'Accept': 'application/json',
            }),
        }
        if (Credentials.userToken && !refreshCall) {
            const newToken = await Credentials.userToken.use()
            if (newToken) {
                Credentials.userToken = newToken
                Credentials.saveUserToken()
            }
            options.headers = new Headers({
                'Accept': 'application/json',
                'Authorization': `Bearer ${Credentials.userToken.accessToken}`,
            })
        }
        if (data) {
            options = {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${Credentials.userToken.accessToken}`,
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
    
}