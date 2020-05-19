class Network extends Core {

    core: Core;
    uuid: string;
    name: string;

    constructor(core: Core, instance: Instance) {
        super(core.getTool());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
    }

    getStore(): Store {
        return new Store(this);
    }

    getForum(): Forum {
        return new Forum(this);
    }

    getId() {
        return this.uuid;
    }

    public async getKeyFromId(keyid: string) {
        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/key/from/id/?hash=" + core.getCoreSession().getHash() + "&keyid=" + keyid;
        } else {
            url = "https://api.purecore.io/rest/2/key/from/id/?key=" + core.getKey() + "&keyid=" + keyid;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new Key(core).fromArray(jsonresponse);;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async createServer(name: string) {

        var core = this.core;
        var network = this;
        var url;

        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/server/create/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId() + "&name=" + name;
        } else {
            url = "https://api.purecore.io/rest/2/instance/server/create/?key=" + core.getKey() + "&name=" + name;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    } else {

                        resolve(new Instance(core, jsonresponse.uuid, jsonresponse.name, "SVR"));

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

    async getServers() {

        var core = this.core;
        var network = this;
        var url;

        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/server/list/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId();
        } else {
            url = "https://api.purecore.io/rest/2/instance/server/list/?key=" + core.getKey() + "&network=" + network.getId();
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        var servers = [];

                        jsonresponse.forEach(serverInstance => {
                            servers.push(new Instance(core, serverInstance.uuid, serverInstance.name, "SVR"));
                        });

                        resolve(servers);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

    asInstance() {
        return new Instance(this.core, this.uuid, this.name, "NTW");
    }

    async getVotingAnalytics(span = 3600 * 24) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/network/voting/analytics/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&span=" + span;
        } else {
            url = "https://api.purecore.io/rest/2/instance/network/voting/analytics/?key=" + core.getKey() + "&span=" + span;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    var votingAnalytics = new Array<VoteAnalytic>();
                    jsonresponse.forEach(votingAnalyticJSON => {
                        var votingAnalytic = new VoteAnalytic().fromArray(votingAnalyticJSON);
                        votingAnalytics.push(votingAnalytic);
                    });
                    return votingAnalytics;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getVotingSites() {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
        } else {
            url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/?key=" + core.getKey();
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    var siteArray = new Array<VotingSite>();
                    jsonresponse.forEach(votingSite => {
                        var site = new VotingSite(core).fromArray(votingSite);
                        siteArray.push(site);
                    });
                    return siteArray;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getSetupVotingSites(displaySetup: boolean = true) {

        var core = this.core;
        let main = this;
        var url;

        if (displaySetup) {
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/config/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
            } else if (core.getKey() != null) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/config/?key=" + core.getKey();
            } else {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/config/?network=" + main.getId();
            }
        } else {
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
            } else if (core.getKey() != null) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/?key=" + core.getKey();
            } else {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/?network=" + main.getId();
            }
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    if (displaySetup) {
                        var configArray = new Array<VotingSiteConfig>();
                        jsonresponse.forEach(votingSite => {
                            var siteConfig = new VotingSiteConfig(core).fromArray(votingSite);
                            configArray.push(siteConfig);
                        });
                        return configArray;
                    } else {
                        var siteArray = new Array<VotingSite>();
                        jsonresponse.forEach(votingSite => {
                            var site = new VotingSite(core).fromArray(votingSite);
                            siteArray.push(site);
                        });
                        return siteArray;
                    }
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getGuild() {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/network/discord/get/guild/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
        } else {
            url = "https://api.purecore.io/rest/2/instance/network/discord/get/guild/?key=" + core.getKey();
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new DiscordGuild(main).fromArray(jsonresponse);
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async setGuild(discordGuildId: string) {

        var key = this.core.getKey();

        try {
            return await fetch("https://api.purecore.io/rest/2/instance/network/discord/setguild/?key=" + key + "&guildid=" + discordGuildId, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return true
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async setSessionChannel(channelId: string) {

        var key = this.core.getKey();

        try {
            return await fetch("https://api.purecore.io/rest/2/instance/network/discord/setchannel/session/?key=" + key + "&channelid=" + channelId, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return true
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

    async setDonationChannel(channelId: string) {

        var key = this.core.getKey();

        try {
            return await fetch("https://api.purecore.io/rest/2/instance/network/discord/setchannel/donation/?key=" + key + "&channelid=" + channelId, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return true
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

    async getHashes() {

        var key = this.core.getKey();
        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/session/hash/list/?key=" + key, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var response = new Array();
                        jsonresponse.forEach(hashData => {
                            var hash = new ConnectionHash(new Core(key));
                            response.push(hash.fromArray(hashData))
                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    reject(error);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    async getOffences() {

        var url;
        var core = this.core;

        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/punishment/offence/list/?hash=" + this.core.getCoreSession().getHash() + "&network=" + this.getId();
        } else if (this.core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/punishment/offence/list/?key=" + this.core.getKey();
        } else {
            url = "https://api.purecore.io/rest/2/punishment/offence/list/?network=" + this.getId();
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var response = new Array();
                        jsonresponse.forEach(offenceData => {

                            var offence = new Offence(core);
                            response.push(offence.fromArray(offenceData))
                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    reject(error);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    async getOffenceActions() {

        var url;
        var core = this.core;

        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/punishment/action/list/?hash=" + this.core.getCoreSession().getHash() + "&network=" + this.getId();
        } else {
            url = "https://api.purecore.io/rest/2/punishment/action/list/key=" + this.core.getKey() + "&network=" + this.getId();
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var response = new Array();
                        jsonresponse.forEach(actionData => {

                            var offence = new OffenceAction(core);
                            response.push(offence.fromArray(actionData))
                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    reject(error);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    searchPlayers(username?: string, uuid?: string, coreid?: string) {
        if (username != null) {

            var networkid = this.uuid;
            var core = this.core;
            var url;

            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/player/from/minecraft/username/search/?hash=" + core.getCoreSession().getHash() + "&network=" + networkid + "&username=" + username;
            } else {
                url = "https://api.purecore.io/rest/2/player/from/minecraft/username/search/?key=" + core.getKey() + "&username=" + username;
            }

            return new Promise(function (resolve, reject) {

                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                        } else {

                            var finalPlayerList = new Array<Player>();
                            jsonresponse.forEach(playerData => {
                                var player = new Player(core, playerData.coreid, playerData.username, playerData.uuid, playerData.verified);
                                finalPlayerList.push(player);
                            });
                            resolve(finalPlayerList);

                        }
                    });
                } catch (e) {
                    reject(e);
                }

            });

        } else {
            return new Array<Player>();
        }
    }

    getPlayer(coreid: string) {


        var core = this.core;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/from/core/id/?hash=" + core.getCoreSession().getHash() + "&player=" + coreid;
        } else {
            if (core.getKey() != null) {
                url = "https://api.purecore.io/rest/2/player/from/core/id/?key=" + core.getKey() + "&player=" + coreid;
            } else {
                url = "https://api.purecore.io/rest/2/player/from/core/id/?player=" + coreid;
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

                        var player = new Player(core, jsonresponse.coreid, jsonresponse.username, jsonresponse.uuid, jsonresponse.verified);
                        resolve(player);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

    getPlayers(page?) {

        var core = this.core;
        var instance = this.asInstance();

        var queryPage = 0;
        if (page != undefined && page != null) {
            queryPage = page;
        }

        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/network/list/players/?hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId() + "&page=" + queryPage;
        } else {
            url = "https://api.purecore.io/rest/2/instance/network/list/players/?key=" + core.getKey() + "&page=" + queryPage;
        }

        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        var players = new Array<Player>();

                        jsonresponse.forEach(playerJson => {

                            var player = new Player(core, playerJson.coreid, playerJson.username, playerJson.uuid, playerJson.verified);
                            players.push(player);

                        });

                        resolve(players);

                    }
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    async getPunishments(page = 0) {

        var url;
        var core = this.core;

        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/punishment/list/?hash=" + this.core.getCoreSession().getHash() + "&network=" + this.getId() + "&page=" + page.toString();
        } else {
            url = "https://api.purecore.io/rest/2/punishment/list/key=" + this.core.getKey() + "&network=" + this.getId() + "&page=" + page.toString();
        }

        var key = this.core.getKey();
        return new Promise(function (resolve, reject) {

            try {
                return fetch(url, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg))
                    } else {
                        var response = new Array<Punishment>();
                        jsonresponse.forEach(punishmentData => {

                            var punishment = new Punishment(core);
                            response.push(punishment.fromArray(punishmentData))

                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    reject(error);
                })
            } catch (e) {
                reject(e);
            }
        });
    }
}