class LoginHelper {

    private static activeWindow: Window;
    public autoLogin: boolean;
    public loggedIn: boolean;

    constructor(autoLogin: boolean = true) {
        this.autoLogin = autoLogin;
        this.loggedIn = false;
        if (this.autoLogin) {
            try {
                this.loadSession();
                this.loggedIn = true;
            } catch (error) {
                // ignore
            }
        }
        if (Core.getAuth() instanceof CoreSession) {
            this.loggedIn = true;
        }
    }

    public isLoggedIn(): boolean {
        return this.loggedIn;
    }

    public loadSession(): CoreSession {
        let ses = CoreSession.load();
        Core.addAuth(ses);
        return ses;
    }

    public logout() {

        // removes stored sessions

        if (localStorage.getItem(btoa("purecore-" + window.location.hostname + "l")) != null) {
            localStorage.removeItem(btoa("purecore-" + window.location.hostname + "l"))
        }
        if (localStorage.getItem(btoa("purecore-" + window.location.hostname + "d")) != null) {
            localStorage.removeItem(btoa("purecore-" + window.location.hostname + "d"))
        }
        if (localStorage.getItem(btoa("purecore-" + window.location.hostname + "h")) != null) {
            localStorage.removeItem(btoa("purecore-" + window.location.hostname + "h"))
        }

        // removes current sessions
        Core.getKeychain().removeSessions();

        // updates login status
        this.loggedIn = false;

    }

    public login(method: number | string | Platform): Promise<CoreSession> {
        return new Promise((resolve, reject) => {
            method = Util.platformVal(method);
            if (window != null) {
                try {
                    if (LoginHelper.activeWindow != null) LoginHelper.activeWindow.close();

                    // generates popup

                    let h = 600;
                    let w = 400;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

                    let popup = window.open(this.getURL(method), 'Login', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
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
                                    res = Keychain.getMethod(event.data.data);
                                    Core.addAuth(res);

                                    // close window (result already got)

                                    if (!popup.closed) {
                                        popup.close();
                                        LoginHelper.activeWindow = null;
                                    }

                                    // do not listen for further events (task completed)

                                    listenerActive = false;
                                }

                                if (this.autoLogin) {
                                    if (res instanceof CoreSession) {
                                        res.save();
                                        this.loggedIn = true;
                                    }
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
            } else {
                reject(new Error("In order to create a login popup, you must be executing purecore from a Document Object Model"));
            }
        });

    }

    public getURL(platform: Platform): string {
        let ext = ""
        switch (platform) {
            case Platform.Stadia:
                ext += "google"
                break;
            case Platform.Steam:
                ext += "steam"
                break;
            case Platform.Xbox:
                ext += "microsoft"
                break;
            case Platform.Discord:
                ext += "discord"
                break;
            default:
                throw new Error("Unsupported login method");
        }
        return `https://api.purecore.io/login/${ext}/`;
    }

}