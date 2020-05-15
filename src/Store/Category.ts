class StoreCategory extends Core {

    core: Core;
    uuid: string;
    name: string;
    description: string;
    network: Network;
    upgradable: boolean;

    constructor(core: Core, uuid?: string, name?: string, description?: string, network?: Network, upgradable?: boolean) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }

    fromArray(array): StoreCategory {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.upgradable = array.upgradable;
        return this;
    }

    getId() {
        return this.uuid;
    }

    public async createItem(name: string, description: string, price) {

        var core = this.core;
        let main = this;
        var url;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/item/create/?hash=" + core.getCoreSession().getHash() + "&network=" + main.network.uuid + "&name=" + name + "&description=" + description + "&category=" + main.uuid + "&price=" + price;
        } else {
            url = "https://api.purecore.io/rest/2/store/item/create/?key=" + core.getKey() + "&network=" + main.network.uuid + "&name=" + name + "&description=" + description + "&category=" + main.uuid + "&price=" + price;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    return new StoreItem(core).fromArray(jsonresponse);;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

}