class SessionRequest extends Core {

    core: Core;
    uuid: string;
    token: string;
    validated: boolean;
    player: Player;
    network: Network;
    type: string;

    constructor(core: Core, uuid: string, token: string, validated: boolean, player: Player, network: Network, type: string) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.token = token;
        this.validated = validated;
        this.player = player;
        this.network = network;
        this.type = type;
    }

    public isValidated() {
        return this.validated;
    }

    public getValidationUrl() {
        return "https://api.purecore.io/link/discord/redirect/?uuid=" + this.uuid + "&hash=" + this.token
    }

    public getToken() {
        return this.token;
    }

    async getSession() {

        var key = this.core.getKey();
        var core = this.core;
        var token = this.token;

        return new Promise(function (resolve, reject) {

            try {
                return fetch("https://api.purecore.io/rest/2/session/hash/token/exchange/?key=" + key + "&token=" + token, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                    } else {
                        resolve(new Session(core).fromArray(jsonresponse))
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