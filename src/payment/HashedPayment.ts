class HashedPayment {

    private activeWindow: Window;

    public payment: Payment;
    public hash: string;
    public stripeClientSecret: string;

    public static fromObject(object: any): HashedPayment {
        let hp = new HashedPayment();
        hp.payment = Payment.fromObject(object.payment);
        hp.hash = object.hash;
        hp.stripeClientSecret = object.stripeClientSecret;
        return hp;
    }

    public getiDEALBanks(): Array<Bank> {
        let banks = new Array<Bank>();
        banks.push(new Bank("ABN AMRO", "https://upload.wikimedia.org/wikipedia/commons/4/4f/ABN-AMRO_Logo_new_colors.svg"));
        banks.push(new Bank("ASN Bank", "https://upload.wikimedia.org/wikipedia/en/4/4b/ASN_Bank_logo.svg"));
        banks.push(new Bank("bunq", "https://upload.wikimedia.org/wikipedia/commons/5/58/Bunq_%28bank%29_company_logo_2017.svg"));
        banks.push(new Bank("ING", "https://upload.wikimedia.org/wikipedia/commons/4/49/ING_Group_N.V._Logo.svg"));
        banks.push(new Bank("Knab", "https://upload.wikimedia.org/wikipedia/en/1/1c/AEGON_%28logo%29.svg"));
        banks.push(new Bank("Moneyou", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Moneyou_logo.svg"));
        banks.push(new Bank("Rabobank", "https://upload.wikimedia.org/wikipedia/de/9/9d/Logo_Rabobank.svg"));
        banks.push(new Bank("RegioBank", "https://upload.wikimedia.org/wikipedia/commons/7/70/Logo_Regiobank.svg"));
        banks.push(new Bank("Revolut", "https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_Revolut.png"));
        banks.push(new Bank("SNS", "https://upload.wikimedia.org/wikipedia/en/d/db/De_Volksbank_logo.svg"));
        banks.push(new Bank("Svenska Handelsbanken", "https://upload.wikimedia.org/wikipedia/commons/e/e8/Handelsbanken.svg"));
        banks.push(new Bank("Triodos Bank", "https://upload.wikimedia.org/wikipedia/en/2/20/Triodos_Bank.svg"));
        banks.push(new Bank("Van Lanschot", "https://dbrt.ch/wp-content/uploads/2016/06/VL-Logo-Transparant-002.png"));
        return banks;
    }

    public getURL(method: PaymentMethod | string, bank: Bank | string = null): string {
        let url = "https://api.purecore.io/rest/3/payment/pay/";
        if (method == PaymentMethod.PayPal || String(method).toLowerCase() == "paypal") {
            url += "paypal/" + "?" + Param.PaymentHash + "=" + this.hash
        } else if (method == PaymentMethod.Bancontact || String(method).toLocaleLowerCase() == "bancontact") {
            url += "stripe/bancontact/" + "?" + Param.PaymentHash + "=" + this.hash
        } else if (method == PaymentMethod.Giropay || String(method).toLocaleLowerCase() == "giropay") {
            url += "stripe/giropay/" + "?" + Param.PaymentHash + "=" + this.hash
        } else if (method == PaymentMethod.iDEAL || String(method).toLocaleLowerCase() == "ideal") {
            url += "stripe/ideal/" + "?" + Param.PaymentHash + "=" + this.hash
            if (bank == null) {
                throw new Error("Bank param required");
            } else if (bank instanceof Bank) {
                url += "&" + Param.Bank + "=" + bank.name.toLocaleLowerCase();
            } else {
                url += "&" + Param.Bank + "=" + bank.toLocaleLowerCase();
            }
        } else {
            throw new Error("Unknown method (or must be processed locally)");

        }
        return url;
    }

    public pay(method: PaymentMethod | string, bank: Bank | string = null): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window != null) {
                try {
                    if (this.activeWindow != null) this.activeWindow.close();

                    // generates popup

                    let h = 600;
                    let w = 400;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

                    let popup = window.open(this.getURL(method, bank), 'Login', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
                    this.activeWindow = popup;
                    let listenerActive = true;
                    let res = null;

                    // waits for result

                    window.addEventListener("message", (event) => {
                        if (listenerActive) {
                            if (event.origin !== "https://api.purecore.io") {
                                return;
                            }
                            switch (event.data.message) {
                                case 'paymentFailure':
                                    reject(event.data.data);
                                    break;
                                case 'paymentSuccess':
                                    resolve();
                                    break;
                            }
                        }
                    }, false);

                    // check if the window gets closed before a result was retrieved

                    let interval = setInterval(() => {
                        if (this.activeWindow != null && this.activeWindow.closed) {
                            this.activeWindow = null;
                        }
                        if (popup.closed && res == null) {

                            // stop listening for events

                            listenerActive = false;

                            // stop the window state checker

                            clearInterval(interval);

                            // throw error

                            reject(new Error("The popup was closed before completing the payment flow"));
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