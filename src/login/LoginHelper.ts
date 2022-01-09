class LoginHelper {

    private static activeWindow: Window;

    public static login(method: Method, scope: Scope, responseType: oAuthResponseType, clientId?: string, redirectURI?: string, state?: string, accessToken?: string): Promise<Token> {

        return new Promise((resolve, reject) => {
            if (window != null) {
                try {
                    if (LoginHelper.activeWindow != null) LoginHelper.activeWindow.close();

                    // generates popup

                    let h = 700;
                    let w = 500;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

                    let popup = window.open(`https://api.purecore.io/oauth/authorize/${method}/?scope=${scope.join(" ")}&response_type=${responseType}${clientId != null ? `&client_id=${clientId}` : ""}${redirectURI != null ? `&redirect_uri=${redirectURI}` : ""}${state != null ? `&state=${state}` : ""}${accessToken != null ? `&access_token=${accessToken}` : ""}`, 'Login', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
                    LoginHelper.activeWindow = popup;
                    let listenerActive = true;
                    let res: Token = null;

                    // waits for result

                    window.addEventListener("message", (event) => {
                        if (event.origin !== "https://api.purecore.io") {
                            return;
                        }
                        switch (event.data.message) {
                            case 'login':
                                if (listenerActive) {
                                    res = Token.fromObject(event.data.data)

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
            } else {
                reject(new Error("In order to create a login popup, you must be executing purecore from a Document Object Model"));
            }
        });
    }

}