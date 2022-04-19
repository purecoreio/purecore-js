import Core from "../Core"
import { Credentials } from "../login/Credentials"

export class Call {

    private static prefix = "/rest/3/"

    public static async commit(endpoint: string, data?: any, method?: 'POST' | 'GET' | 'DELETE' | 'PATCH', refreshCall: boolean = false, skipPrefix: boolean = false) {
        if (!method) {
            if (data) {
                method = 'POST'
            } else {
                method = 'GET'
            }
        }
        let options = {
            method: method,
            headers: new Headers({
                'Accept': 'application/json',
            }),
            body: undefined
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
            options.body = JSON.stringify(data)
            options.headers.set('Content-type', 'application/json')
        }
        const response = await fetch(`${Core.getBase()}${!skipPrefix ? Call.prefix : ''}${endpoint}`, options)
        if (response.ok) {
            const parsedResponse = await response.json()
            if (Object.keys(parsedResponse).length == 1 && 'data' in parsedResponse) return parsedResponse.data
            return parsedResponse
        } else {
            const parsedResponse = await response.json()
            throw new Error(parsedResponse ? parsedResponse.error : undefined)
        }
    }

}