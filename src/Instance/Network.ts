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
        try {
            return await fetch("https://api.purecore.io/rest/2/instance/network/setguild/?key=" + this.core.getKey() + "&guildid=" + discordGuildId, { method: "GET" }).then(function (response) {
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
}