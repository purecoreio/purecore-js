class Perk extends Core {

    core: Core;
    uuid: string;
    network: Network;
    name: string;
    description: string;
    type: string;
    category: PerkCategory;
    commands: Array<StoreCommand>;

    constructor(core: Core, uuid?: string, network?: Network, name?: string, description?: string, type?: string, category?: PerkCategory, commands?: Array<StoreCommand>) {

        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
        this.commands = commands;
    }

    fromArray(array): Perk {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = new PerkCategory(this.core).fromArray(array.category);

        var commands = new Array<StoreCommand>();
        array.commands.forEach(cmd => {
            commands.push(new StoreCommand(this.core).fromArray(cmd))
        });

        this.commands = commands;

        return this;
    }


    public async addCmd(cmd: string, needsOnline: boolean, executeOn: Array<Instance>) {

        var core = this.core;
        let main = this;
        var url;

        var ids = [];
        executeOn.forEach(instance => {
            ids.push(instance.uuid);
        });

        var needsOnlineStr = "false";
        if (needsOnline) {
            needsOnlineStr = "true";
        }

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/perk/cmd/add/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&perk=" + main.uuid + "&cmd=" + cmd + "&needsOnline=" + needsOnlineStr + "&instances=" + JSON.stringify(ids);
        } else {
            url = "https://api.purecore.io/rest/2/store/perk/cmd/add/?key=" + core.getKey() + "&network=" + main.uuid + "&perk=" + main.uuid + "&cmd=" + cmd + "&needsOnline=" + needsOnlineStr + "&instances=" + JSON.stringify(ids);
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    var commands = new Array<StoreCommand>();
                    jsonresponse.forEach(cmd => {
                        commands.push(new StoreCommand(core).fromArray(cmd));
                    });
                    return commands;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }

    }

}