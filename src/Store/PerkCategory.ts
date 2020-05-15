class PerkCategory extends Core {


    core: Core;
    uuid: string;
    name: string;
    network: Network;


    constructor(core: Core, uuid?: string, name?: string, network?: Network) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }

    fromArray(array): PerkCategory {

        this.uuid = array.uuid;
        this.name = array.name;
        try {
            this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        } catch (error) {
            this.network = null;
        }

        return this;

    }


    public async createPerk(name: string, description: string, type: string) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/perk/create/?hash=" + core.getCoreSession().getHash() + "&network=" + main.network.uuid + "&name=" + name + "&description=" + description + "&type=" + type.toUpperCase() + "&category=" + main.uuid;
        } else {
            url = "https://api.purecore.io/rest/2/store/perk/create/?key=" + core.getKey() + "&network=" + main.network.uuid + "&name=" + name + "&description=" + description + "&type=" + type.toUpperCase() + "&category=" + main.uuid;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new Perk(core).fromArray(jsonresponse);;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

}