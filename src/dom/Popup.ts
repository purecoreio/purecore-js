class Popup {

    public static activePopup;

    public static openPopup(url: string, expectedMessage: string, domain: string | null = Core.getBase()) {
        return new Promise((resolve, reject) => {
            if (window != null) {
                try {
                    if (Popup.activePopup != null) Popup.activePopup.close();

                    // generates popup

                    let h = 700;
                    let w = 500;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

                    let popup = window.open(`${domain ?? ''}${url}`, 'purecore.io', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
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
            } else {
                reject(new Error("In order to create a popup, you must be executing purecore from a Document Object Model"));
            }
        });
    }
}