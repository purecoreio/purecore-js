class Store extends Network {

    network: Network;

    constructor(network: Network) {

        super(network.core, network.asInstance());
        this.network = network;

    }

    async getIncomeAnalytics(span = 3600 * 24) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/income/analytics/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&span=" + span;
        } else {
            url = "https://api.purecore.io/rest/2/store/income/analytics/?key=" + core.getKey() + "&span=" + span;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    var IncomeAnalytics = new Array<IncomeAnalytic>();
                    jsonresponse.forEach(IncomeAnalyticJSON => {
                        var IncomeAnalyticD = new IncomeAnalytic().fromArray(IncomeAnalyticJSON);
                        IncomeAnalytics.push(IncomeAnalyticD);
                    });
                    return IncomeAnalytics;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    public async getItem(id: string) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/item/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&item=" + id;
        } else {
            url = "https://api.purecore.io/rest/2/store/item/?key=" + core.getKey() + "&item=" + id;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new StoreItem(core).fromArray(jsonresponse);
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

    public async getPerks() {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/perk/list/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
        } else {
            url = "https://api.purecore.io/rest/2/store/perk/list/?key=" + core.getKey();
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    var perklist = new Array<Perk>();
                    jsonresponse.forEach(element => {
                        perklist.push(new Perk(core).fromArray(element))
                    });
                    return perklist;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

    public async getPerkCategories() {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/perk/category/list/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
        } else {
            url = "https://api.purecore.io/rest/2/store/perk/category/list/?key=" + core.getKey();
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    var perklist = new Array<PerkCategory>();
                    jsonresponse.forEach(element => {
                        perklist.push(new PerkCategory(core).fromArray(element))
                    });
                    return perklist;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

    public getGateways() {

        let hash = this.network.core.getCoreSession().getHash();
        let ntwid = this.network.getId();

        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/store/gateway/list/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: "hash=" + hash + "&network=" + ntwid
                }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        var methods = []
                        jsonresponse.forEach(gtw => {
                            var gtf = new Gateway(gtw.name, null, null, null)
                            methods.push(gtf);
                        });
                        resolve(methods);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    public itemIdList(list: Array<StoreItem>): Array<StoreItem> {
        var finalList = new Array<StoreItem>();
        list.forEach(item => {
            finalList.push(new StoreItem(new Core(), item.uuid));
        });
        return finalList;
    }

    public itemIdListFromJSON(json): Array<StoreItem> {
        var finalList = new Array<StoreItem>();
        json.forEach(item => {
            finalList.push(new StoreItem(new Core(), item.uuid));
        });
        return finalList;
    }

    getStripeWalletLink() {
        var hash = this.network.core.getCoreSession().getHash();
        var ntwid = this.network.getId();
        return "https://api.purecore.io/link/stripe/wallet/?hash=" + hash + "&network=" + ntwid
    }

    getPayPalWalletLink() {
        var hash = this.network.core.getCoreSession().getHash();
        var ntwid = this.network.getId();
        return "https://api.purecore.io/link/paypal/wallet/?hash=" + hash + "&network=" + ntwid
    }

    requestPayment(itemList: Array<StoreItem>, username: string, billingAddress?) {

        if (billingAddress == null) {
            billingAddress = new BillingAddress();
        }

        var core = this.network.core;
        var instance = this.network.asInstance();
        var idList = [];

        itemList.forEach(item => {
            idList.push(item.uuid);
        });

        var body = "";
        if (core.getTool() instanceof Session) {
            body = "hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId() + "&products=" + escape(JSON.stringify(idList)) + "&username=" + username + "&billing=" + JSON.stringify(billingAddress);
        } else if (core.getKey() != null) {
            body = "key=" + core.getKey() + "&products=" + escape(JSON.stringify(idList)) + "&username=" + username + "&billing=" + JSON.stringify(billingAddress);
        } else {
            body = "network=" + instance.getId() + "&products=" + escape(JSON.stringify(idList)) + "&username=" + username + "&billing=" + JSON.stringify(billingAddress);
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/payment/request/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: body
                }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {
                        var paymentRequest = new CorePaymentRequest(core).fromArray(jsonresponse);
                        resolve(paymentRequest);
                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getNetwork(): Network {
        return this.network;
    }

    getPayments(page?) {

        var core = this.network.core;
        var instance = this.network.asInstance();

        var queryPage = 0;

        if (page != undefined || page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/payment/list/?hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId() + "&page=" + page;
        } else {
            url = "https://api.purecore.io/rest/2/payment/list/?key=" + core.getKey() + "&network=" + instance.getId() + "&page=" + page;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        var payments = new Array<Payment>();

                        jsonresponse.forEach(paymentJson => {

                            payments.push(new Payment(core).fromArray(paymentJson));

                        });

                        resolve(payments);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    public async createPerkCategory(name) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/perk/category/create/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&name=" + name;
        } else {
            url = "https://api.purecore.io/rest/2/store/perk/category/create/?key=" + core.getKey() + "&network=" + main.uuid + "&name=" + name;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new PerkCategory(core).fromArray(jsonresponse);;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
        
    }

    public async createCategory(name, description) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/category/create/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&name=" + name + "&description=" + description;
        } else {
            url = "https://api.purecore.io/rest/2/store/category/create/?key=" + core.getKey() + "&network=" + main.uuid + "&name=" + name + "&description=" + description;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new StoreCategory(core).fromArray(jsonresponse);;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

    public async getCategories() {
        return new Promise(function (resolve, reject) {
            try {
                this.getPackages().then(function (nestedItems: Array<NestedItem>) {
                    var categories = new Array<StoreCategory>();
                    nestedItems.forEach(nestedItem => {
                        categories.push(nestedItem.category);
                    });
                    resolve(categories);
                })
            } catch (e) {
                reject(e);
            }
        });
    }


    getPackages() {

        var core = this.network.core;
        var instance = this.network.asInstance();

        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/item/list/?hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId();
        } else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/store/item/list/?key=" + core.getKey() + "&network=" + instance.getId();
        } else {
            url = "https://api.purecore.io/rest/2/store/item/list/?network=" + instance.getId();
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error)
                    } else {

                        var response = new Array<NestedItem>();

                        jsonresponse.forEach(nestedData => {

                            response.push(new NestedItem(core).fromArray(nestedData));

                        });

                        resolve(response);

                    }
                }).catch(function (err) {
                    reject(err);
                });
            } catch (e) {
                reject(e);
            }

        });
    }

}