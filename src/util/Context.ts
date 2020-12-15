class Context {

    private network: Network; // provides a network context

    public getNetwork(): Network {
        return this.network;
    }

    public setNetwork(network: string | Network): void {
        if (typeof network == 'string') {
            let main = this;
            main.network = new Network(String(network), null, null, null);
            Core.getCopy().getNetwork(network).then((network) => {
                main.network = network;
            })
        } else {
            this.network = network;
        }
    }

}