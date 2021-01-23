class Context {

    private network: Network; // provides a network context
    private subscriptionStatus: SubscriptionStatus; // provides subscription status

    public getNetwork(): Network {
        return this.network;
    }
    public getSubscriptionStatus(): SubscriptionStatus {
        return this.subscriptionStatus;
    }

    public updateSubscriptionStatus(): void {
        let main = this;
        Core.getCopy().getPlayer().getBilling().getSubscriptionStatus().then((status) => {
            main.subscriptionStatus = status;
        })
    }

    public setSubscriptionStatus(status: SubscriptionStatus): void {
        this.subscriptionStatus = status;
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