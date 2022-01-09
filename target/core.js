var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Core {
    constructor(publicId) {
        Credentials.publicId = publicId;
        if (localStorage) {
            // if an offline token was generated, this will automatically retrieve if from localstorage
            const accessToken = localStorage.getItem(btoa("purecore-access-token"));
            const refreshToken = localStorage.getItem(btoa("purecore-refresh-token"));
            if (accessToken && refreshToken) {
                const accessTokenParsed = JSON.parse(atob(accessToken));
                Credentials.userToken = new Token(accessTokenParsed.accessToken, new Date(accessTokenParsed.expires), JSON.parse(atob(refreshToken)).refreshToken);
            }
        }
    }
    getUser() {
        return new User();
    }
    login(method, scope = ["offline", "payment/autofill", "profile/list", "profile/link", "defaultScope"], redirectURI, state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (scope.includes("defaultScope") && Credentials.publicId && !scope.includes(`network/${Credentials.publicId}`))
                scope.push(`network/${Credentials.publicId}`);
            scope = scope.filter(item => item !== "defaultScope");
            const token = yield LoginHelper.login(method, scope, redirectURI ? "code" : "token", Credentials.publicId, redirectURI, state, Credentials.userToken ? Credentials.userToken.accessToken : null);
            if (!Credentials.userToken) {
                // keep the old user token if it was an account link, since it will still be valid
                Credentials.userToken = token;
                Credentials.saveUserToken();
            }
            return this;
        });
    }
}
try {
    module.exports = Core;
}
catch (error) {
}
class Call {
    static commit(endpoint, data, refreshCall = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json',
                }),
            };
            if (Credentials.userToken && !refreshCall) {
                const newToken = yield Credentials.userToken.use();
                if (newToken) {
                    Credentials.userToken = newToken;
                    Credentials.saveUserToken();
                }
                options.headers = new Headers({
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${Credentials.userToken.accessToken}`,
                });
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
                };
            }
            const response = yield fetch(`https://api.purecore.io${endpoint}`, options);
            if (response.ok) {
                return yield response.json();
            }
            else {
                throw new Error(yield response.text());
            }
        });
    }
}
class Credentials {
    static saveUserToken() {
        if (Credentials.userToken.refreshToken) {
            localStorage.setItem(btoa("purecore-access-token"), btoa(JSON.stringify({
                accessToken: Credentials.userToken.accessToken,
                expires: Credentials.userToken.expires
            })));
            if (Credentials.userToken.refreshToken) {
                localStorage.setItem(btoa("purecore-refresh-token"), btoa(JSON.stringify({
                    refreshToken: Credentials.userToken.refreshToken,
                })));
            }
        }
    }
}
class LoginHelper {
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
    constructor(accessToken, expires, refreshToken) {
        this.accessToken = accessToken;
        this.expires = expires;
        this.refreshToken = refreshToken;
    }
    static fromObject(object) {
        return new Token(object.access_token, new Date(object.expires), object.refresh_token);
    }
    use() {
        return __awaiter(this, void 0, void 0, function* () {
            if (new Date().getTime() > this.expires.getTime()) {
                if (this.refreshToken) {
                    let body = {
                        grant_type: "refresh_token",
                        refresh_token: this.refreshToken
                    };
                    if (Credentials.publicId)
                        body["client_id"] = Credentials.publicId;
                    return Token.fromObject(yield Call.commit("/oauth/token/", body, true));
                }
                else {
                    throw new Error("expired access token");
                }
            }
            else {
                return null;
            }
        });
    }
}
class Profile {
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
    getProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const profileData = yield Call.commit("/rest/3/user/profile/list/");
            const profiles = [];
            profileData.forEach(element => {
                profiles.push(Profile.fromObject(element));
            });
            return profiles;
        });
    }
}
