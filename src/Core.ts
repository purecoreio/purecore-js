class Core {

    key: string;

    constructor(key: string) {
        this.key = key;
    }

    public getKey() {
        return this.key;
    }

    public getElements() {
        return new Elements(this);
    }

    public getInstance(instanceId, name, type): Instance {
        return new Instance(this, instanceId, name, type)
    }

    
    public async fromDiscord(guildId: string, botToken: string) {

        var obj = this;
        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/key/from/discord/?guildid=" + guildId + "&token=" + botToken, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        obj.key = jsonresponse.hash
                        resolve(obj)
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

module.exports = Core
