class CoreSession implements AuthMethod {

    private owner: Player;
    private location: SessionLocation;
    private device: SessionDevice;
    private usage: SessionUsage;
    private id: string;
    private hash: string;
    private network: Network;

    public constructor(owner?: Player, location?: SessionLocation, device?: SessionDevice, usage?: SessionUsage, id?: string, hash?: string, network?: Network) {
        this.owner = owner;
        this.location = location;
        this.device = device;
        this.usage = usage;
        this.id = id;
        this.hash = hash;
        this.network = network;
    }

    public getCredentials(): string {
        return this.hash;
    }

    public getParam(): string {
        return Param.Hash;
    }

    public static fromObject(object: any): CoreSession {
        let ses = new CoreSession();
        if ('owner' in object) {
            ses.owner = Player.fromObject(object.owner);
        }
        if ('location' in object) {
            ses.location = SessionLocation.fromObject(object.location);
        }
        if ('device' in object) {
            ses.device = SessionDevice.fromObject(object.device);
        }
        if ('usage' in object) {
            ses.usage = SessionUsage.fromObject(object.usage);
        }
        if ('id' in object) {
            ses.id = String(object.id);
        }
        if ('hash' in object) {
            ses.hash = String(object.hash);
        }
        if ('network' in object) {
            if (object.network != null) {
                ses.network = Network.fromObject(object.network);
            } else {
                ses.network = null;
            }
        }
        return ses;
    }

    public getPlayer(): Player {
        return this.owner;
    }


}