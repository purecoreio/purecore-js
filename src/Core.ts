class Core {

    key: string;
    session: Session;

    constructor(tool?: any) {
        if (tool != undefined) {
            if (typeof tool == "string") {
                this.key = tool;
            } else if (typeof tool == "object") {

                if (tool instanceof Session) {
                    this.session = tool;
                } else {
                    this.session = new Session(new Core(this.session)).fromArray(tool);
                }

            }
        }

        // if not start with fromdiscord or fromtoken

    }

    public getPlayersFromIds(ids): Array<Player> {
        var playerList = new Array<Player>();
        ids.forEach(id => {
            playerList.push(new Player(this, id));
        });
        return playerList;
    }

    public getMachine(hash) {

        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/machine/?hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    } else {

                        resolve(new Machine().fromArray(jsonresponse));

                    }
                });
            } catch (e) {
                reject(e);
            }

        });

    }

    public fromToken(GoogleToken: string) {

        var obj = this;

        return new Promise(function (resolve, reject) {

            try {

                return fetch("https://api.purecore.io/rest/2/session/from/google/?token=" + GoogleToken, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (response) {

                    if ("error" in response) {

                        throw new Error(response.error + ". " + response.msg);

                    } else {

                        var session = new Session(new Core(null)).fromArray(response)
                        obj.session = session;
                        resolve(obj);

                    }

                }).catch(function (error) {

                    throw error

                })
            } catch (e) {

                reject(e.message)

            }
        });

    }

    public getTool() {
        if (this.key != null && this.key != undefined) {
            return this.key;
        } else {
            return this.session;
        }
    }

    public getCoreSession() {
        return this.session;
    }

    public getKey() {
        return this.key;
    }

    public getElements() {
        return new Elements(this);
    }

    public getInstance(instanceId, name?, type?): Instance {
        return new Instance(this, instanceId, name, type)
    }

    public async fromDiscord(guildId: string, botToken: string, devkey: boolean) {

        var obj = this;

        return new Promise(function (resolve, reject) {

            try {

                var params = ""

                if (devkey == true) {
                    params = "?guildid=" + guildId + "&token=" + botToken + "&devkey=true"
                } else {
                    params = "?guildid=" + guildId + "&token=" + botToken
                }

                return fetch("https://api.purecore.io/rest/2/key/from/discord/?token=" + params, { method: "GET" }).then(function (response) {

                    return response.json();

                }).then(function (response) {

                    if ("error" in response) {

                        throw new Error(response.error + ". " + response.msg)

                    } else {

                        obj.key = response.hash
                        resolve(obj)

                    }

                }).catch(function (error) {

                    throw error

                })
            } catch (e) {

                reject(e.message)

            }
        });
    }

}

try {
    module.exports = Core
} catch (error) {
    console.log("[corejs] starting plain vanilla instance, as nodejs exports were not available")
}
