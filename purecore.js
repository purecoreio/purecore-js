class Core {

    // KEY INIT

    constructor(key) {
        this.key = key;
    }

    // CHECKOUT ELEMENT

    createCheckoutElement(legacy_username, product_list, target_element) {

        var CoreInstance = this;

        // css and html loading

        var css_props = '<style>@import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700|Material+Icons);.hidden{height:0;overflow:hidden;visibility:hidden;padding:0;margin:0}.packagelist{list-style-image:url(plus.png)}.packagelist li{margin:20px 0;margin-left:20px;font-size:100%}.discountlist{list-style-image:url(less.png)}.discountlist li{margin:20px 0;margin-left:20px;font-size:100%}.errorlist{list-style-image:url(warn.png)}.errorlist li{margin:20px 0;margin-left:20px;font-size:100%}.light_card{background:#fff;border-color:#e2e2e2;border-style:solid;border-width:1px;border-radius:5px;color:#000;padding:16px}.light_warning_card{background:#fff9c4;margin-top:15px;color:#000;border-color:#e2e2e2;border-style:solid;border-width:1px;border-radius:5px;color:#000;padding:16px}.lds-dual-ring{display:inline-block;width:64px;height:64px}.lds-dual-ring:after{content:" ";display:block;width:60px;height:60px;margin:1px;border-radius:50%;border:5px solid #ccc;border-color:#ccc transparent #fff transparent;animation:lds-dual-ring 1.2s linear infinite}@keyframes lds-dual-ring{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes expand-vertical{0%{max-height:0;overflow-y:hidden}99%{max-height:500px;overflow-y:hidden}100%{max-height:auto;overflow-y:inherit}}.expand-vertical{animation:expand-vertical 1s}</style>';
        var html_min = '<div id="checkout_wrapper" style="max-width: 100%; position: relative"><div class="container" style="width: 100%"><div class="light_card" style="position: relative"><div style="position: relative"><div id="preloader" class="valign-wrapper" style="position: absolute; width: 100%; height: 100%; top: 0px;"><div class="valign" style="width: 100%; padding-bottom: 52px"><center><div class="lds-dual-ring"></div></center></div></div><div class="valign-wrapper" style="position: relative; width: 100%; height: 100%; top: 0px;"><div class="valign" style="width: 100%"><center> <img class="animated tdExpandIn" id="user-pic" style="border-radius: 100px" src="https://minotar.net/helm/MHF_Question/50.png"><p id="player-name">...</p></center></div></div></div><div id="content" class="hidden"><div><div class="divider"></div><div id="packagelist" class="packagelist"></div><div id="discountlist" class="discountlist"></div><div id="errorlist" class="errorlist"></div></div><div class="divider"></div><p id="final-price" style="font-weight: 700; font-size: 150%; text-align: center"></p></div> <canvas style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px" id="conf_canvas"></canvas></div><div id="payment_process"><div id="payment_errors" class="hidden"></div><div id="buttons" class="hidden" style="margin-top: 15px"><div id="modern_buttons" class="hidden"><center><p style="color: #ccc">Use Google Pay, Apple Pay, Samsung Pay</p></center><div id="payment-request-button"></div><center><p style="color: #ccc; margin-top: 15px; margin-bottom: 15px">Or...</p></center></div><div id="legacy-button"><div class="light_card"><div id="card-element"></div></div><div style="margin-top: 7px"> <a id="donate-now-button" href="#"><div class="waves-effect z-depth-1" style="background-color: white; width: 100%; padding: 10px; border-radius: 4px; text-align: center; color: black"> Donate Now</div> </a></div></div></div></div></div></div>';

        // external css
        var css_libs = ["https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css", "https://cdn.jsdelivr.net/gh/shakrmedia/tuesday@v1.1.0/build/tuesday.min.css"]
        var final_css_tag = ""
        css_libs.forEach(lib => {
            final_css_tag += '<link rel="stylesheet" type="text/css" href="' + lib + '" />'
        });

        // js external lib loading

        var js_libs = ["https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"];
        var final_js_tag = ""
        js_libs.forEach(lib => {
            final_js_tag += "<script src='" + lib + "'></script>"
        });

        var final_html = final_css_tag + css_props + final_js_tag + html_min;
        target_element.innerHTML = final_html;

        // content loading

        this.getPaymentRequest(legacy_username, product_list, null).then(function (resp) { // get the sessions for the client

            document.getElementById("preloader").classList.add("animated");
            document.getElementById("preloader").classList.add("tdFadeOut");
            document.getElementById("content").classList.remove("hidden");
            document.getElementById("content").classList.add("expand-vertical");

            var products = resp.getProducts()
            var discounts = resp.getDiscounts()
            var warnings = resp.getWarnings()
            var price = resp.getPrice()
            var final_products = ""

            products.forEach(packageinfo => {
                var name = packageinfo.getName()
                var price = packageinfo.getPrice()
                final_products += "<li>" + name + " <span class='right'>+" + parseFloat(price).toFixed(2) + "</span></li>"

            });
            var final_discounts = ""
            discounts.forEach(discount => {
                var name = discount.getName()
                var due = discount.getDue()
                final_discounts += "<li>" + name + " <span class='right'>-" + parseFloat(due).toFixed(2) + "</span></li>"

            });
            var final_warnings = ""
            warnings.forEach(warning => {
                var cause = warning.getCause()
                var msg = warning.getMsg()
                final_warnings += "<li>" + msg + ", Caused by <span style='font-weight:500'>" + cause + "</span></li>"

            });

            var player = resp.getPlayer()
            var name = player.getLegacyUsername()
            var core = player.getCore()

            // html values setting

            document.getElementById('user-pic').src = "https://minotar.net/helm/" + name + "/50.png"
            document.getElementById("player-name").innerHTML = name;
            document.getElementById("final-price").innerHTML = price.getFinal().toFixed(2) + " EUR";

            if (core == null) {
                final_warnings += "<li>We couldn't find this username in our database, therefore, this transaction wont be linked to any accounts. We can process this payment but we can't ensure you'll receive your product</li>"
            }

            document.getElementById("errorlist").innerHTML = final_warnings;
            document.getElementById("discountlist").innerHTML = final_discounts;
            document.getElementById("packagelist").innerHTML = final_products;

            // button processing

            setTimeout(() => {
                var request = resp.getUUID();

                document.getElementById("buttons").classList.add("animated");
                document.getElementById("buttons").classList.add("tdFadeInDown");
                var stripe = Stripe('pk_live_EApGv1EQo2QX4zp4E543Na5Q00JGPBZESa');

                // Create an instance of Elements.
                var elements = stripe.elements();

                // Custom styling can be passed to options when creating an Element.
                // (Note that this demo uses a wider set of styles than the guide below.)
                var style = {
                    base: {
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                };

                // Create an instance of the card Element.
                var card_element = elements.create('card', {
                    style: style
                });

                document.getElementById("donate-now-button").addEventListener("click", function () {
                    document.getElementById("donate-now-button").style.opacity = 0.3
                    stripe.createToken(card_element).then(function (result) {
                        document.getElementById("donate-now-button").style.opacity = 1
                        if (result.error) {
                            document.getElementById("payment_errors").classList.remove("hidden");
                            document.getElementById("payment_errors").classList.add("animated");
                            document.getElementById("payment_errors").classList.add("tdExpandIn");
                            document.getElementById("payment_errors").classList.add("light_warning_card");
                            document.getElementById("payment_errors").innerHTML = result.error.message
                        } else {
                            document.getElementById("payment_errors").classList.add("hidden");
                            document.getElementById("payment_errors").classList.remove("animated");
                            document.getElementById("payment_errors").classList.remove("tdExpandIn");
                            document.getElementById("payment_errors").classList.remove("light_warning_card");
                            CoreInstance.createPayment(request, "Stripe", ev.token.id).then(function (result) {

                                document.getElementById("payment_process").classList.add("animated");
                                document.getElementById("payment_process").classList.add("tdShrinkOut");

                                // result
                                var event = new CustomEvent('successfulPayment');
                                target_element.dispatchEvent(event);

                            }).catch(function (error) {
                                document.getElementById("payment_errors").classList.remove("hidden");
                                document.getElementById("payment_errors").classList.add("animated");
                                document.getElementById("payment_errors").classList.add("tdExpandIn");
                                document.getElementById("payment_errors").classList.add("light_warning_card");
                                document.getElementById("payment_errors").innerHTML = error.message
                            })
                        }
                    });
                });

                var paymentRequest = stripe.paymentRequest({
                    country: 'US',
                    currency: 'eur',
                    total: {
                        label: 'Donation',
                        amount: price.getFinal() * 100,
                    },
                    requestPayerName: false,
                    requestPayerEmail: false,
                });

                var prButton = elements.create('paymentRequestButton', {
                    paymentRequest: paymentRequest,
                    style: {
                        paymentRequestButton: {
                            type: 'donate',
                            theme: 'light',
                            height: '40px',
                        },
                    },
                });

                // Check the availability of the Payment Request API first.
                paymentRequest.canMakePayment().then(function (result) {
                    card_element.mount('#card-element');
                    setTimeout(() => {

                        document.getElementById("buttons").classList.remove("hidden");
                        document.getElementById("buttons").classList.add("animated");
                        document.getElementById("buttons").classList.add("tdFadeInDown");
                        if (result) {
                            prButton.mount('#payment-request-button');
                            document.getElementById("modern_buttons").classList.remove("hidden");
                        } else {
                            document.getElementById('modern_buttons').style.display = 'none';
                        }
                    }, 100);
                });

                paymentRequest.on('token', function (ev) {

                    CoreInstance.createPayment(request, "Stripe", ev.token.id).then(function (result) {
                        document.getElementById("payment_errors").classList.remove("light_warning_card")
                        document.getElementById("payment_errors").classList.add("hidden")
                        ev.complete('success');

                        document.getElementById("payment_process").classList.add("animated")
                        document.getElementById("payment_process").classList.add("tdShrinkOut")

                        // result
                        var event = new CustomEvent('successfulPayment');
                        target_element.dispatchEvent(event);

                    }).catch(function (error) {

                        document.getElementById("payment_errors").classList.remove("hidden")
                        document.getElementById("payment_errors").classList.add("animated")
                        document.getElementById("payment_errors").classList.add("tdExpandIn")
                        document.getElementById("payment_errors").classList.add("light_warning_card")
                        document.getElementById("payment_errors").innerHTML = error.message
                        ev.complete('fail');

                    })

                });
            }, 400);

        });
    }

    // BASKET

    addToBasket(CorePackage) {
        var basket = window.localStorage.getItem("coreBasket")
        if (basket == null) {
            basket = []
        } else {
            basket = JSON.parse(window.localStorage.getItem("coreBasket"))
        }

        if (!basket.includes(CorePackage)) {
            basket.push(CorePackage)
        } else {
            throw new Error("The package was already added to the basket")
        }
        var basket = window.localStorage.setItem("coreBasket", JSON.stringify(basket))
    }

    clearBasket() {
        window.localStorage.setItem("coreBasket", null)
    }

    getBasket() {
        var basket = window.localStorage.getItem("coreBasket")
        if (basket == null) {
            basket = []
        } else {
            basket = JSON.parse(window.localStorage.getItem("coreBasket"))
        }
        return basket
    }

    // AJAX GET SESSIONS

    async getSessions() {
        var finalresponse = []
        var finalkey = this.key;
        try {
            // wait for response
            return await fetch("https://api.purecore.io/rest/1/session/get/?key=" + this.key, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                // looks for errors
                if (jsonresponse.error != null) {
                    throw new Error("PureCore returned an error: " + jsonresponse.error + " -> " + jsonresponse.msg)
                } else {
                    // adds the sessions to the response
                    jsonresponse.forEach(player => {
                        finalresponse.push(new CoreSession(finalkey, player["mojang_username"], player["mojang_uuid"], player["core_id"], player["verified"]))
                    });
                    return finalresponse; // returns undefined
                }
            });
        } catch (e) {
            throw new Error("Error while getting the response for 'https://api.purecore.io/rest/1/session/get/?key=" + this.key + "' -> " + e.message)
        }
    }

    // PACKAGE LOAD

    async getPackages() {
        try {
            // wait for response
            return await fetch("https://api.purecore.io/rest/1/product/list/?key=" + this.key, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                // looks for errors
                if (jsonresponse.error != null) {
                    throw new Error("PureCore returned an error: " + jsonresponse.error + " -> " + jsonresponse.msg)
                } else {
                    // adds the categories with objects to the response

                    var final_product_categories = [];

                    jsonresponse.forEach(category => {

                        var json_packages = category["packages"];
                        var final_packages = [];

                        json_packages.forEach(json_package => {

                            var json_perk_categories = json_package.perks;
                            var final_categories = [];
                            json_perk_categories.forEach(json_category => {

                                var json_perks = json_category.perks;
                                var final_perks = [];
                                json_perks.forEach(perk => {
                                    final_perks.push(new CorePerk(perk.name, perk.description, perk.uuid, perk.quantity))
                                });

                                final_categories.push(new CorePerkCategory(json_category.name, json_category.uuid, final_perks))

                            });

                            final_packages.push(new CorePackage(json_package.name, json_package.description, json_package.price, json_package.currency, final_categories, json_package.uuid))

                        });

                        final_product_categories.push(new CorePackageCategory(category.name, category.description, category.uuid, final_packages))
                    });
                    return final_product_categories; // returns package categories
                }
            });
        } catch (e) {
            throw new Error("Error while getting the response for 'https://api.purecore.io/rest/1/product/list/?key=" + this.key + "' -> " + e.message)
        }
    }

    // PAYMENT PREVIEW

    async getPaymentRequest(username_or_uuid, products, codes) {

        var final_url = ""
        if (username_or_uuid.includes("-")) {
            if (codes == null) {
                final_url = "https://api.purecore.io/rest/1/payment/request/?key=" + this.key + "&uuid=" + username_or_uuid + "&products=" + JSON.stringify(products)
            } else {
                final_url = "https://api.purecore.io/rest/1/payment/request/?key=" + this.key + "&uuid=" + username_or_uuid + "&products=" + JSON.stringify(products) + "&discount_codes=" + JSON.stringify(codes)
            }
        } else {
            if (codes == null) {
                final_url = "https://api.purecore.io/rest/1/payment/request/?key=" + this.key + "&username=" + username_or_uuid + "&products=" + JSON.stringify(products)
            } else {
                final_url = "https://api.purecore.io/rest/1/payment/request/?key=" + this.key + "&username=" + username_or_uuid + "&products=" + JSON.stringify(products) + "&discount_codes=" + JSON.stringify(codes)
            }
        }

        try {
            // wait for response
            return await fetch(final_url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                // looks for errors
                if (jsonresponse.error != null) {
                    throw new Error("PureCore returned an error: " + jsonresponse.error + " -> " + jsonresponse.msg)
                } else {
                    // adds the categories with objects to the response
                    return new CorePaymentRequest(jsonresponse.products, jsonresponse.discounts, jsonresponse.price, jsonresponse.player, jsonresponse.payment)
                }
            });
        } catch (e) {
            throw new Error("Error while getting the response for '" + final_url + "' -> " + e.message)
        }
    }

    // PAYMENT EXECUTE

    async createPayment(request, gateway, token) {

        try {
            // wait for response
            return await fetch("https://api.purecore.io/rest/1/payment/create/?key=" + this.key + "&request=" + request + "&gateway=" + gateway + "&token=" + token, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                console.log(jsonresponse)
                // looks for errors
                if (jsonresponse.error != null) {
                    throw new Error("PureCore returned an error: " + jsonresponse.error + " -> " + jsonresponse.msg)
                } else {
                    // adds the categories with objects to the response
                    return null; // to-do payment object
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    // CSS LOAD

    async loadCSS() {
        return new Promise(function (resolve, reject) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'master.css';
            document.head.appendChild(link);
            link.onload = function () {
                resolve();
            };
        });
    }

    // CSS SESSION CARD ELEMENT

    getSessionCard(CoreSession, isFirst) {
        if (isFirst) {
            return "<div data-core-key='" + CoreSession.getCoreKey() + "' data-core-username='" + CoreSession.getMojangUsername() + "' data-core-uuid='" + CoreSession.getMojangUUID() + "' data-core-verified='" + CoreSession.getCoreVerified() + "' data-core-session='" + CoreSession.getCoreUUID() + "' data-core-isfirst='true' class='purecore-selection-card-session-wrapper'><div class='purecore-selection-card-avatar-wrapper'><img class='purecore-selection-card-avatar-picture' src='https://minotar.net/avatar/" + CoreSession.getUsername() + "'/><div class='purecore-selection-card-avatar-loader'></div></div><p class='purecore-selection-card-tag'>" + CoreSession.getUsername() + "</div>"
        } else {
            return "<div data-core-key='" + CoreSession.getCoreKey() + "' data-core-username='" + CoreSession.getMojangUsername() + "' data-core-uuid='" + CoreSession.getMojangUUID() + "' data-core-verified='" + CoreSession.getCoreVerified() + "' data-core-session='" + CoreSession.getCoreUUID() + "' data-core-isfirst='false' class='purecore-selection-card-session-wrapper'><div class='purecore-selection-card-avatar-wrapper'><img class='purecore-selection-card-avatar-picture' src='https://minotar.net/avatar/" + CoreSession.getUsername() + "'/><div class='purecore-selection-card-avatar-loader'></div></div><p class='purecore-selection-card-tag'>" + CoreSession.getUsername() + "</div>"
        }
    }

    // CSS SESSION CARD WRAPPER ELEMENT SHOW

    showLoginCard(CoreSessionArray) {
        if (CoreSessionArray.length >= 1) {
            var innercards = ""
            var first = true
            CoreSessionArray.forEach(CoreSession => {
                innercards += this.getSessionCard(CoreSession, first)
                first = false
            });


            var loader = '<div id="core-card-progress" class="purecore-selection-card-progress" style="width: 0%;"></div>'
            document.body.innerHTML += "<div id='core-card-selector' onmouseover='new Core(\"" + this.key + "\").cancelAutoLogin()' style='overflow: hidden' class='purecore-selection-card-wrapper'><div class='purecore-selection-card-inner'>" + loader + "" + innercards + "</div></div>"
        }
    }

    // CSS HIDE SELECTION CARD

    hideSelectionCard() {
        document.getElementById("core-card-selector").style.animationName = "coreFadeOutLeft"
        setTimeout(() => {
            document.getElementById("core-card-selector").remove()
        }, 199);
    }

    // CSS AUTOMATIC LOGIN START SELECTING MAIN

    startSelectingMain() {
        var cards = document.getElementsByClassName("purecore-selection-card-session-wrapper");
        var firstCard = null;
        var otherCards = [];
        [].forEach.call(cards, function (el) {
            if (el.dataset.coreIsfirst == "true") {
                firstCard = el
            } else {
                otherCards.push(el)
            }
        });

        otherCards.forEach(el => {
            el.classList.add("purecore-selection-fading");
        });

        var step = 0;
        window.setInterval(function () {
            if (window.localStorage.getItem("coreExecutingAutoload") == "true" && step <= 1250) {
                step += 1;
                var width = (100 / 1250) * step + "%";
                document.getElementById("core-card-progress").style.width = width;
            } else {
                if (document.getElementById("core-card-progress") != null) {
                    document.getElementById("core-card-progress").classList.add("purecore-fade-out");
                    otherCards.forEach(el => {
                        el.classList.remove("purecore-selection-fading")
                    });
                }
            }
        }, 1);

        setTimeout(() => {
            if (window.localStorage.getItem("coreExecutingAutoload") == "true") {
                firstCard.getElementsByClassName("purecore-selection-card-avatar-loader")[0].style.backgroundImage = "url('https://www.icebox.com/assets/public/images/login-load.gif')";
                otherCards.forEach(el => {
                    el.classList.add("purecore-selection-toSlim");
                });

                var key = firstCard.dataset.coreKey
                var username = firstCard.dataset.coreUsername
                var coreuuid = firstCard.dataset.coreSession
                var session = firstCard.dataset.coreUuid
                var verified = firstCard.dataset.coreVerified

                try {

                    setTimeout(() => {
                        this.hideSelectionCard()
                    }, 500);

                    new CoreSession(key, username, coreuuid, session, verified).getOfflineSession().then(function (offlineSession) {
                        if (offlineSession.needsLogin()) {
                            console.log("needs login")
                            // request login
                        } else {
                            console.log("all good chief")
                            // save offline session, no need to verify account
                        }
                    });
                } catch (e) {
                    this.hideSelectionCard()
                    throw new Error("Error while getting an offline session -> " + e.message)
                }

            }
        }, 5000);
    }

    // CSS SELECTS FIRST ACCOUNT FROM THE CARD SELECTOR WRAPPER

    startAutologin() {
        window.localStorage.setItem("coreExecutingAutoload", "true")
        setTimeout(() => {
            if (window.localStorage.getItem("coreExecutingAutoload") == "true") {
                this.startSelectingMain()
            }
        }, 5000);
    }

    // CANCEL AUTO CSS ACCOUNT SELECTION

    cancelAutoLogin() {
        window.localStorage.setItem("coreExecutingAutoload", "false")
    }


}

class CoreSession {
    constructor(key, username, uuid, core_uuid, verified) {
        this.key = key;
        this.username = username;
        this.uuid = uuid;
        this.core_uuid = core_uuid;
        this.verified = verified;
    }

    getCoreKey() {
        return this.key;
    }

    getMojangUsername() {
        return this.username;
    }

    getMojangUUID() {
        return this.uuid;
    }

    getCoreVerified() {
        return this.verified;
    }

    getUsername() {
        return this.username;
    }

    getCoreUUID() {
        return this.core_uuid;
    }

    async getOfflineSession() {
        try {
            // wait for response
            return await fetch("https://api.purecore.io/rest/1/session/get/offline?key=" + this.key + "&session=" + this.uuid, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                // looks for errors
                if (jsonresponse.error != null) {
                    throw new Error("PureCore returned an error while getting an offline session: " + jsonresponse.error + " -> " + jsonresponse.msg)
                } else {
                    return new CoreOfflineSession(player["mojang_username"], player["mojang_uuid"], player["core_id"], player["hash"]), player["needslogin"]; // returns undefined
                }
            });
        } catch (e) {
            throw new Error("Error while getting the response for 'https://api.purecore.io/rest/1/session/get/?key=" + this.key + "' -> " + e.message)
        }
    }
}

class CoreOfflineSession {
    constructor(username, uuid, core_uuid, hash, needslogin) {
        this.username = username;
        this.uuid = uuid;
        this.core_uuid = core_uuid;
        this.hash = hash;
        this.needslogin = needslogin;
    }

    needsLogin() {
        return this.needslogin;
    }

}

class CorePackageCategory {
    constructor(name, description, uuid, packages) {
        this.name = name;
        this.description = description;
        this.uuid = uuid;
        this.packages = packages;
    }

    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }

    getPackages() {
        return this.packages;
    }

}

class CorePerkCategory {
    constructor(name, uuid, perks) {
        this.name = name;
        this.uuid = uuid;
        this.perks = perks;
    }

    getPerks() {
        return this.perks;
    }

    getName() {
        return this.name;
    }

    getUUID() {
        return this.uuid;
    }

}

class CorePerk {
    constructor(name, description, uuid, quantity) {
        this.name = name;
        this.description = description;
        this.uuid = uuid;
        this.quantity = quantity;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    isCountable() {
        if (this.quantity != null) {
            return true;
        } else {
            return false;
        }
    }

    getQuantity() {
        return this.quantity;
    }

}

class CorePackage {
    constructor(name, description, price, currency, perkCategories, uuid) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.perkCategories = perkCategories;
        this.uuid = uuid;
    }

    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }

    getPrice() {
        return this.price
    }

    getCurrency() {
        return this.currency
    }

    getPerkCategories() {
        return this.perkCategories
    }

    getUUID() {
        return this.uuid
    }

}

class CorePaymentRequest {
    constructor(products_info, discounts_info, price_info, player_info, payment_info) {
        this.products_info = products_info;
        this.discounts_info = discounts_info;
        this.price_info = price_info;
        this.player_info = player_info;
        this.payment_info = payment_info;
    }

    getProducts() {
        var final_products = []
        this.products_info.final.forEach(element => {
            var product = new CorePackage(element.name, element.description, element.price, element.currency, null, element.uuid)
            final_products.push(product)
        });
        return final_products
    }

    getDiscounts() {
        var final_discounts = []
        this.discounts_info.final.forEach(element => {
            var discount = new CoreDiscount(element.due, element.type, element.name)
            final_discounts.push(discount)
        });
        return final_discounts
    }

    getProductWarnings() {
        var warnlist = []
        this.products_info.warnings.forEach(warning => {
            warnlist.push(new CoreRequestWarning(warning.caused_by, warning.error))
        });
        return warnlist
    }

    getDiscountWarnings() {
        var warnlist = []
        this.discounts_info.warnings.forEach(warning => {
            warnlist.push(new CoreRequestWarning(warning.caused_by, warning.error))
        });
        return warnlist
    }

    getWarnings() {
        var warnlist = []
        this.products_info.warnings.forEach(warning => {
            warnlist.push(new CoreRequestWarning(warning.caused_by, warning.error))
        });
        this.discounts_info.warnings.codes.forEach(warning => {
            warnlist.push(new CoreRequestWarning(warning.caused_by, warning.error))
        });
        return warnlist
    }

    getPrice() {
        return new CorePrice(this.price_info.original, this.price_info.off, this.price_info.final)
    }

    getPlayer() {
        return new CorePlayerRelate(this.player_info.legacy_username, this.player_info.core, this.player_info.related)
    }

    getUUID() {
        return this.payment_info.request_id
    }
}

class CoreRequestWarning {
    constructor(cause, msg) {
        this.cause = cause;
        this.msg = msg;
    }

    getCause() {
        return this.cause
    }

    getMsg() {
        return this.msg
    }
}

class CoreDiscount {
    constructor(due, type, name) {
        this.due = due;
        this.type = type;
        this.name = name;
    }

    getName() {
        return this.name
    }

    getType() {
        return this.type
    }

    getDue() {
        return this.due
    }
}

class CorePlayerRelate {
    constructor(legacy, core, related) {
        this.legacy = legacy;
        this.core = core;
        this.related = related;
    }

    getCore() {
        if (this.core == null) {
            return null;
        } else {
            return new CoreSession(null, this.core.mojang_username, this.core.mojang_uuid, this.core.core_id, null)
        }
    }

    getLegacyUsername() {
        return this.legacy
    }

    getRelated() {
        return this.related
    }
}

class CorePrice {
    constructor(original, off, final) {
        this.original = original;
        this.off = off;
        this.final = final;
    }

    getOriginal() {
        return this.original
    }

    getOff() {
        return this.off
    }

    getFinal() {
        return this.final
    }
}



