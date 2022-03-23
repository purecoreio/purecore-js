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
    constructor(publicId, test = false) {
        Core.test = test;
        Credentials.publicId = publicId;
        Credentials.attemptLoadFromLocalStorage();
    }
    static getBase() {
        if (Core.test) {
            return "http://localhost:3000";
        }
        else {
            return "https://api.purecore.io";
        }
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return User.fromObject(yield Call.commit("user/"));
        });
    }
    login(method, scope = ["offline", "payment/autofill", "profile/list", "profile/link"], redirectURI, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield LoginHelper.login(method, scope, redirectURI ? "code" : "token", Credentials.publicId, redirectURI, state, Credentials.userToken ? Credentials.userToken.accessToken : null);
            if (!Credentials.userToken) {
                // keep the old user token if it was an account link, since it will still be valid
                Credentials.userToken = token;
                Credentials.saveUserToken();
            }
            return this;
        });
    }
    logout() {
        Credentials.clear();
    }
}
try {
    module.exports = Core;
}
catch (error) {
}
class Popup {
    static openPopup(url, expectedMessage, domain = Core.getBase()) {
        return new Promise((resolve, reject) => {
            if (window != null) {
                try {
                    if (Popup.activePopup != null)
                        Popup.activePopup.close();
                    // generates popup
                    let h = 700;
                    let w = 500;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
                    let popup = window.open(`${domain !== null && domain !== void 0 ? domain : ''}${url}`, 'purecore.io', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
                    Popup.activePopup = popup;
                    let listenerActive = true;
                    // waits for result
                    window.addEventListener("message", (event) => {
                        if (event.origin !== Core.getBase()) {
                            return;
                        }
                        if (event.data.message == expectedMessage && listenerActive) {
                            // close window (result already got)
                            if (!popup.closed) {
                                popup.close();
                                Popup.activePopup = null;
                            }
                            // do not listen for further events (task completed)
                            listenerActive = false;
                            // resolve data
                            resolve(event.data.data);
                        }
                    }, false);
                    // check if the window gets closed before a result was retrieved
                    let interval = setInterval(() => {
                        if (Popup.activePopup != null && Popup.activePopup.closed) {
                            Popup.activePopup = null;
                        }
                        if (popup.closed && listenerActive) {
                            // stop listening for events
                            listenerActive = false;
                            // stop the window state checker
                            clearInterval(interval);
                            // throw error
                            reject(new Error("The popup was closed"));
                        }
                    }, 50);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                reject(new Error("In order to create a popup, you must be executing purecore from a Document Object Model"));
            }
        });
    }
}
class Call {
    static commit(endpoint, data, refreshCall = false, skipPrefix = false) {
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
            const response = yield fetch(`${Core.getBase()}${!skipPrefix ? Call.prefix : ''}${endpoint}`, options);
            if (response.ok) {
                const parsedResponse = yield response.json();
                if (Object.keys(parsedResponse).length == 1 && 'data' in parsedResponse)
                    return parsedResponse.data;
                return parsedResponse;
            }
            else {
                throw new Error(yield response.text());
            }
        });
    }
}
Call.prefix = "/rest/3/";
class Network {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static fromObject(object) {
        return new Network(object.id, object.name);
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
    static attemptLoadFromLocalStorage() {
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
    static clear() {
        Credentials.publicId = undefined;
        Credentials.userToken = undefined;
        localStorage.removeItem(btoa("purecore-access-token"));
        localStorage.removeItem(btoa("purecore-refresh-token"));
    }
}
class LoginHelper {
    static login(method, scope, responseType, clientId, redirectURI, state, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return Token.fromObject(yield Popup.openPopup(`/oauth/authorize/${method}/?scope=${scope.join(" ")}&response_type=${responseType}${clientId != null ? `&client_id=${clientId}` : ""}${redirectURI != null ? `&redirect_uri=${redirectURI}` : ""}${state != null ? `&state=${state}` : ""}${accessToken != null ? `&access_token=${accessToken}` : ""}`, "login"));
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
                    return Token.fromObject(yield Call.commit("/oauth/token/", body, true, true));
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
    constructor(service, id, externalId, externalName, externalEmail) {
        this.service = service;
        this.id = id;
        this.externalId = externalId;
        this.externalId = externalId;
        this.externalName = externalName;
        this.externalEmail = externalEmail;
    }
    static fromObject(object) {
        return new Profile(object.service, object.id, object.externalId, object.externalName, object.externalEmail);
    }
}
class User {
    constructor(id) {
        this.id = id;
    }
    getProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const profileData = yield Call.commit("user/profile/list/");
            const profiles = [];
            profileData.forEach(element => {
                profiles.push(Profile.fromObject(element));
            });
            return profiles;
        });
    }
    static fromObject(object) {
        return new User(object.id);
    }
    asOwner() {
        return new Owner(this.id);
    }
    linkWallet(processor) {
        return __awaiter(this, void 0, void 0, function* () {
            return Popup.openPopup(yield Call.commit(`user/wallet/link/${processor}`), "success", null);
        });
    }
}
class Owner extends User {
    constructor(id) {
        super(id);
    }
    createNetwork(name, cname) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = yield Call.commit("network/create", {
                name: name,
                cname: cname
            });
            return Network.fromObject(network);
        });
    }
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const networks = yield Call.commit("network/list");
            return networks.map(o => Network.fromObject(o));
        });
    }
}
