class VotingSiteConfig extends Core {

    public core: Core;
    public network: Network;
    public votingSite: VotingSite;
    public url: string;

    public constructor(core: Core, network?: Network, votingSite?: VotingSite, url?: string) {
        super(core.getTool());
        this.core = core;
        this.network = network;
        this.votingSite = votingSite;
        this.url = url;
    }

    public fromArray(array): VotingSiteConfig {
        this.votingSite = new VotingSite(this.core).fromArray(array.votingSite);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.url = array.url;
        return this;
    }

    public async setURL(url: string) {

        var core = this.core;
        let main = this;

        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/network/voting/site/setup/?hash=" + core.getCoreSession().getHash() + "&network=" + main.network.getId() + "&url=" + url + "&site=" + main.votingSite.uuid;
        } else {
            url = "https://api.purecore.io/rest/2/instance/network/voting/site/setup/?key=" + core.getKey() + "&url=" + url + "&site=" + main.votingSite.uuid;
        }

        try {
            return await fetch(url, { method: "GET" }).then(function (response) {
                return response.json();
            }).then(function (jsonresponse) {
                if ("error" in jsonresponse) {
                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg)
                } else {
                    main.url = jsonresponse.url;
                    return this;
                }
            });
        } catch (e) {
            throw new Error(e.message)
        }
    }

}