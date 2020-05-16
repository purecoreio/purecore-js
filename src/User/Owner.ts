class Owner extends Core {

    core: Core;
    id: string;
    name: string;
    surname: string;
    email: string;

    constructor(core: Core, id: string, name: string, surname: string, email: string) {
        super(core.getTool())
        this.core = core;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }

    getEmail() {
        return this.email;
    }

    getId() {
        return this.id;
    }

    getSession() {
        return this.core.getTool()
    }

    public async stripeSubscribe(plan: string, billingAddress: BillingAddress) {
        // purecore, purecore_plus (auto-trial), purecore_plus_v

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {

            if (this.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/account/subscribe/stripe/?hash=" + core.getCoreSession().getHash() + "&plan=" + plan + "&billing=" + JSON.stringify(billingAddress);
            }

            try {
                return await fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        return new StripeSubscription(jsonresponse.id);
                    }
                });
            } catch (e) {
                throw new Error(e.message)
            }

        } else {
            throw new Error("invalid account");
        }

    }

    public async paypalSubscribe(plan: string, billingAddress: BillingAddress) {
        // purecore, purecore_plus (auto-trial), purecore_plus_v

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {

            if (this.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/account/subscribe/paypal/?hash=" + core.getCoreSession().getHash() + "&plan=" + plan + "&billing=" + JSON.stringify(billingAddress);
            }

            try {
                return await fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        return new PayPalSubscription(jsonresponse.url, jsonresponse.id);
                    }
                });
            } catch (e) {
                throw new Error(e.message)
            }

        } else {
            throw new Error("invalid account");
        }

    }

    public async getBillingAddress() {

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {

            if (this.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/account/billing/get/?hash=" + core.getCoreSession().getHash();
            }

            try {
                return await fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        return new BillingAddress().fromArray(jsonresponse);
                    }
                });
            } catch (e) {
                throw new Error(e.message)
            }

        } else {
            throw new Error("invalid account");
        }

    }

    public async addPaymentMethod(pm) {

        var core = this.core;
        var url;

        var pmid = null;
        if (typeof pm == "string") {
            pmid = pm;
        } else {
            pmid = pm.paymentMethod.id;
        }

        if (core.getTool() instanceof Session) {

            if (this.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/account/card/add/?hash=" + core.getCoreSession().getHash() + "&pm=" + pmid;
            }

            try {
                return await fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        // single obj https://stripe.com/docs/api/payment_methods/object
                        return jsonresponse;
                    }
                });
            } catch (e) {
                throw new Error(e.message)
            }

        } else {
            throw new Error("invalid account");
        }

    }

    public async removePaymentMethod(pm) {

        var core = this.core;
        var url;

        var pmid = null;
        if (typeof pm == "string") {
            pmid = pm;
        } else {
            pmid = pm.paymentMethod.id;
        }

        if (core.getTool() instanceof Session) {

            if (this.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/account/card/remove/?hash=" + core.getCoreSession().getHash() + "&pm=" + pmid;
            }

            try {
                return await fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        // bool
                        return jsonresponse.success;
                    }
                });
            } catch (e) {
                throw new Error(e.message)
            }

        } else {
            throw new Error("invalid account");
        }

    }

    public async getPaymentMethods() {

        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {

            if (this.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/account/card/list/?hash=" + core.getCoreSession().getHash();
            }

            try {
                return await fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        // array of https://stripe.com/docs/api/payment_methods/object
                        return jsonresponse;
                    }
                });
            } catch (e) {
                throw new Error(e.message)
            }

        } else {
            throw new Error("invalid account");
        }

    }

    createNetwork(name: string, game: string, cname: string, ip?: string, port?) {
        if (this.core.getTool() instanceof Session) {

            var core = this.core;
            var url;

            if (ip == null) {
                url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname;
            } else {
                if (port == null) {
                    url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname + "&ip=" + ip;
                } else {
                    url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname + "&ip=" + ip + "&port=" + port;
                }
            }

            return new Promise(function (resolve, reject) {

                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error));
                        } else {

                            var network = new Network(core, new Instance(core, jsonresponse.uuid, jsonresponse.name, "NTW"));
                            resolve(network);

                        }
                    });
                } catch (e) {
                    reject(e);
                }

            });

        } else {
            throw new Error("Invalid tool type, got: " + core.getTool())
        }
    }

}