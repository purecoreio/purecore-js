import Core from "../Core"

const prefix = "/rest/3/"

export async function call(endpoint: string, data?: any, method?: 'POST' | 'GET' | 'DELETE' | 'PATCH', refreshCall: boolean = false, skipPrefix: boolean = false) {
    // automatic method if none specified
    if (!method) {
        if (data) {
            method = 'POST'
        } else {
            method = 'GET'
        }
    }

    // default request object
    let options = {
        method: method,
        headers: new Headers({
            'Accept': 'application/json',
        }),
        body: undefined
    }

    // token refreshing (if necessary)
    if (Core.credentials.userToken && !refreshCall) {
        try {
            const newToken = await Core.credentials.userToken.use()
            if (newToken) {
                Core.credentials.userToken = newToken
                Core.credentials.saveUserToken()
            }
        } catch (error) {
            Core.credentials.clear()
            throw error
        }
        options.headers = new Headers({
            'Accept': 'application/json',
            'Authorization': `Bearer ${Core.credentials.userToken.accessToken}`,
        })
    }

    // payload loading
    if (data) {
        options.body = JSON.stringify(data)
        options.headers.set('Content-type', 'application/json')
    }

    // actual request
    const response = await fetch(`${Core.getBase()}${!skipPrefix ? prefix : ''}${endpoint}`, options)
    if (response.ok) {
        const parsedResponse = await response.json()
        if (Object.keys(parsedResponse).length == 1 && 'data' in parsedResponse) return parsedResponse.data
        return parsedResponse
    } else {
        const parsedResponse = await response.json()
        throw new Error(parsedResponse ? parsedResponse.error : undefined)
    }
}