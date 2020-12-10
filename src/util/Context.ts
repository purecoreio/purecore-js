class Context {

    private network: Network; // provides a network context

    public getNetwork(): Network {
        return this.network;
    }

    public setNetwork(network: string | Network): void {
        if (typeof network == 'string') {
            let main = this;
            Core.getNetwork(network).then((network) => {
                main.network = network;
            })
        } else {
            this.network = network;
        }
    }

}