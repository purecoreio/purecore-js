class Core {
    static publicId; // client id
    privateId; // api key
    static userToken; // user jwt token
    constructor(publicId) {
        Core.publicId = publicId;
        if (localStorage) {
            // if an offline token was generated, this will automatically retrieve if from localstorage
            const accessToken = localStorage.getItem(btoa("purecore-access-token"));
            const refreshToken = localStorage.getItem(btoa("purecore-refresh-token"));
            if (accessToken && refreshToken) {
                const accessTokenParsed = JSON.parse(atob(accessToken));
                Core.userToken = new Token(accessTokenParsed.accessToken, new Date(accessTokenParsed.expires), JSON.parse(atob(refreshToken)).refreshToken);
            }
        }
    }
    static async call(endpoint, data, refreshCall = false) {
        let options = {
            method: "GET",
            headers: new Headers({
                'Accept': 'application/json',
            }),
        };
        if (Core.userToken && !refreshCall) {
            const newToken = await Core.userToken.use();
            if (newToken) {
                Core.userToken = newToken;
                Core.saveToken();
            }
            options.headers = new Headers({
                'Accept': 'application/json',
                'Authorization': `Bearer ${Core.userToken.accessToken}`,
            });
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
            };
        }
        const response = await fetch(`https://api.purecore.io${endpoint}`, options);
        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error(await response.text());
        }
    }
    getUser() {
        return new User();
    }
    async login(method, scope = ["offline", "payment/autofill", "profile/list", "profile/link", "defaultScope"], redirectURI, state) {
        if (scope.includes("defaultScope") && Core.publicId && !scope.includes(`network/${Core.publicId}`))
            scope.push(`network/${Core.publicId}`);
        scope = scope.filter(item => item !== "defaultScope");
        const token = await LoginHelper.login(method, scope, redirectURI ? "code" : "token", Core.publicId, redirectURI, state, Core.userToken ? Core.userToken.accessToken : null);
        if (!Core.userToken) {
            // keep the old user token if it was an account link, since it will still be valid
            Core.userToken = token;
            Core.saveToken();
        }
        return this;
    }
    static saveToken() {
        if (Core.userToken.refreshToken) {
            localStorage.setItem(btoa("purecore-access-token"), btoa(JSON.stringify({
                accessToken: Core.userToken.accessToken,
                expires: Core.userToken.expires
            })));
            if (Core.userToken.refreshToken) {
                localStorage.setItem(btoa("purecore-refresh-token"), btoa(JSON.stringify({
                    refreshToken: Core.userToken.refreshToken,
                })));
            }
        }
    }
}
try {
    module.exports = Core;
}
catch (error) {
}
class LoginHelper {
    static activeWindow;
    static login(method, scope, responseType, clientId, redirectURI, state, accessToken) {
        return new Promise((resolve, reject) => {
            if (window != null) {
                try {
                    if (LoginHelper.activeWindow != null)
                        LoginHelper.activeWindow.close();
                    // generates popup
                    let h = 700;
                    let w = 500;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
                    let popup = window.open(`https://api.purecore.io/oauth/authorize/${method}/?scope=${scope.join(" ")}&response_type=${responseType}${clientId != null ? `&client_id=${clientId}` : ""}${redirectURI != null ? `&redirect_uri=${redirectURI}` : ""}${state != null ? `&state=${state}` : ""}${accessToken != null ? `&access_token=${accessToken}` : ""}`, 'Login', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
                    LoginHelper.activeWindow = popup;
                    let listenerActive = true;
                    let res = null;
                    // waits for result
                    window.addEventListener("message", (event) => {
                        if (event.origin !== "https://api.purecore.io") {
                            return;
                        }
                        switch (event.data.message) {
                            case 'login':
                                if (listenerActive) {
                                    res = Token.fromObject(event.data.data);
                                    // close window (result already got)
                                    if (!popup.closed) {
                                        popup.close();
                                        LoginHelper.activeWindow = null;
                                    }
                                    // do not listen for further events (task completed)
                                    listenerActive = false;
                                }
                                resolve(res);
                                break;
                        }
                    }, false);
                    // check if the window gets closed before a result was retrieved
                    let interval = setInterval(() => {
                        if (LoginHelper.activeWindow != null && LoginHelper.activeWindow.closed) {
                            LoginHelper.activeWindow = null;
                        }
                        if (popup.closed && res == null) {
                            // stop listening for events
                            listenerActive = false;
                            // stop the window state checker
                            clearInterval(interval);
                            // throw error
                            reject(new Error("The popup was closed before any session was retrieved"));
                        }
                    }, 50);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                reject(new Error("In order to create a login popup, you must be executing purecore from a Document Object Model"));
            }
        });
    }
}
class Token {
    accessToken;
    refreshToken;
    expires;
    constructor(accessToken, expires, refreshToken) {
        this.accessToken = accessToken;
        this.expires = expires;
        this.refreshToken = refreshToken;
    }
    static fromObject(object) {
        return new Token(object.access_token, new Date(object.expires), object.refresh_token);
    }
    async use() {
        if (new Date().getTime() > this.expires.getTime()) {
            if (this.refreshToken) {
                let body = {
                    grant_type: "refresh_token",
                    refresh_token: this.refreshToken
                };
                if (Core.publicId)
                    body["client_id"] = Core.publicId;
                return Token.fromObject(await Core.call("/oauth/token/", body, true));
            }
            else {
                throw new Error("expired access token");
            }
        }
        else {
            return null;
        }
    }
}
class Profile {
    service;
    id;
    name;
    email;
    constructor(service, id, name, email) {
        this.service = service;
        this.id = id;
        this.name = name;
        this.email = email;
    }
    static fromObject(object) {
        return new Profile(object.service, object.id, object.name, object.email);
    }
}
class User {
    async getProfiles() {
        const profileData = await Core.call("/rest/3/user/profile/list/");
        const profiles = [];
        profileData.forEach(element => {
            profiles.push(Profile.fromObject(element));
        });
        return profiles;
    }
}
