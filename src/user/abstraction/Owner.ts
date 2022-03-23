class Owner extends User {

    constructor(id: string) {
        super(id)
    }

    public async createNetwork(name: string, cname: string): Promise<Network> {
        const network = await Call.commit("network/create", {
            name: name,
            cname: cname
        })
        return Network.fromObject(network)
    }

    public async getNetworks(): Promise<Network[]> {
        const networks: any[] = await Call.commit("network/list")
        return networks.map(o => Network.fromObject(o))
    }

}