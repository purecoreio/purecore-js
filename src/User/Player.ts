class Player extends Core {

    core: Core;
    id: string;
    username: string;
    uuid: string;
    verified;

    constructor(core: Core, id: string, username?: string, uuid?: string, verified?) {
        super(core.getKey())
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }

    getPunishments(network?: Network, page?) {

        var id = this.id;
        var core = this.core;
        var queryPage = 0;

        if (page != undefined || page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {
            if (network == null || network == undefined) {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?hash=" + core.getCoreSession().getHash() + "&page=" + queryPage + "&player=" + id;
            } else {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId() + "&page=" + queryPage + "&player=" + id;
            }
        } else {
            if (network == null || network == undefined) {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?key=" + core.getKey() + "&page=" + queryPage + "&player=" + id;;
            } else {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?key=" + core.getKey() + "&network=" + network.getId() + "&page=" + queryPage + "&player=" + id;;
            }
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        var punishments = new Array<Punishment>();

                        jsonresponse.forEach(punishmentJson => {

                            punishments.push(new Punishment(core).fromArray(punishmentJson));

                        });

                        resolve(punishments);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getPayments(store: Store, page?) {

        var id = this.id;
        var core = this.core;
        var queryPage = 0;

        if (page != undefined || page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/payment/list/?hash=" + core.getCoreSession().getHash() + "&network=" + store.getNetwork().getId() + "&page=" + queryPage + "&player=" + id;
        } else {
            url = "https://api.purecore.io/rest/2/player/payment/list/?key=" + core.getKey() + "&network=" + store.getNetwork().getId() + "&page=" + queryPage + "&player=" + id;;
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

    getDiscordId() {

        var url = "";
        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/get/discord/id/?hash=" + this.core.getCoreSession().getHash();
        } else {
            throw new Error("only sessions are supported in this call");
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {
                        resolve(jsonresponse.id);
                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getConnections(instance: Instance, page?) {

        var id = this.id;
        var core = this.core;
        var queryPage = 0;

        if (page != undefined || page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {

            if (instance == null) {
                url = "https://api.purecore.io/rest/2/player/connection/list/?hash=" + core.getCoreSession().getHash() + "&page=" + queryPage + "&player=" + id;
            } else {
                url = "https://api.purecore.io/rest/2/player/connection/list/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id;
            }

        } else {
            if (instance == null) {
                url = "https://api.purecore.io/rest/2/player/connection/list/?key=" + core.getKey() + "&page=" + queryPage + "&player=" + id;;
            } else {
                url = "https://api.purecore.io/rest/2/player/connection/list/?key=" + core.getKey() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id;;
            }
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        var connections = new Array<Connection>();

                        jsonresponse.forEach(connectionJson => {

                            connections.push(new Connection(core).fromArray(connectionJson));

                        });

                        resolve(connections);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getMatchingConnections(instance: Instance, page?, playerList?: Array<Player>) {

        var id = this.id;
        var core = this.core;
        var queryPage = 0;
        var playerListIds = [];
        playerList.forEach(player => {
            playerListIds.push(player.getId());
        });

        if (page != undefined || page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/connection/list/match/players/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id + "&players=" + JSON.stringify(playerListIds);
        } else {
            url = "https://api.purecore.io/rest/2/player/connection/list/match/players/?key=" + core.getKey() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id + "&players=" + JSON.stringify(playerListIds);
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        var activityMatch = new Array<ActivityMatch>();

                        jsonresponse.forEach(activity => {

                            var matchingRanges = new Array<MatchingRange>();
                            activity.matchList.forEach(matchingRangeJson => {
                                var matchingRange = new MatchingRange(new Date(matchingRangeJson.startedOn * 1000), new Date(matchingRangeJson.finishedOn * 1000), matchingRangeJson.matchWith)
                                matchingRanges.push(matchingRange);
                            });

                            activityMatch.push(new ActivityMatch(new Date(activity.startedOn * 1000), new Date(activity.finishedOn * 1000), activity.activity, matchingRanges));

                        });

                        resolve(activityMatch);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    getId() {
        return this.id;
    }

    getUuid() {
        return this.uuid;
    }

    getUsername() {
        return this.username;
    }

}