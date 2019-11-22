class Network extends Core {

    core: Core;
    uuid: string;
    name: string;

    constructor(core: Core, instance: Instance) {
        super(core.getKey());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
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
}