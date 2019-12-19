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

    getId() {
        return this.uuid;
    }

    async getServers() {

        var core = this.core;
        var network = this;
        var url;

        if(this.core.getTool() instanceof Session){
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

    async asInstance() {
        return new Instance(this.core,this.uuid,this.name,"NTW");
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
                    throw new Error(error)
                })
            } catch (e) {
                throw new Error(e.message)
            }
        });
    }

    async getOffences() {

        var key = this.core.getKey();
        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/punishment/offence/list/?key=" + key, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var response = new Array();
                        jsonresponse.forEach(offenceData => {

                            var offence = new Offence(new Core(key));
                            response.push(offence.fromArray(offenceData))
                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    throw new Error(error)
                })
            } catch (e) {
                throw new Error(e.message)
            }
        });
    }

    async getOffenceActions() {

        var key = this.core.getKey();
        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/punishment/action/list/?key=" + key, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var response = new Array();
                        jsonresponse.forEach(actionData => {

                            var offence = new OffenceAction(new Core(key));
                            response.push(offence.fromArray(actionData))
                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    throw new Error(error)
                })
            } catch (e) {
                throw new Error(e.message)
            }
        });
    }

    async getPunishments() {

        var key = this.core.getKey();
        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/punishment/list/?key=" + key, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        var response = new Array<Punishment>();
                        jsonresponse.forEach(punishmentData => {

                            var punishment = new Punishment(new Core(key));
                            response.push(punishment.fromArray(punishmentData))

                        });
                        resolve(response)
                    }
                }).catch(function (error) {
                    throw new Error(error)
                })
            } catch (e) {
                throw new Error(e.message)
            }
        });
    }
}