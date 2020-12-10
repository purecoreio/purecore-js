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

    public asObject(): any {
        let obj = {
            owner: this.owner.asObject(),
            location: this.location.asObject(),
            device: this.device.asObject(),
            usage: this.usage.asObject(),
            id: this.id,
            hash: this.hash,
            network: (this.network == null ? null : this.network.asObject())
        }
        return obj;
    }

    public save(): void {
        if (localStorage) {
            let gibberishLength = Math.floor(Math.random() * 128);
            let finalStr = btoa(Util.generateGibberish(256 + gibberishLength) + this.hash + Util.generateGibberish(256 + gibberishLength));
            let encodedLength = Util.shortLengthToLong(gibberishLength);

            /* please, keep in mind this encryption is just trash. it is only used
            in order to mask values when people are streaming or debugging live    */

            let sessionNonSensitive = this.asObject();
            delete sessionNonSensitive.hash;
            localStorage.setItem(btoa("purecore-" + window.location.hostname + "h"), finalStr)
            localStorage.setItem(btoa("purecore-" + window.location.hostname + "d"), btoa(JSON.stringify(sessionNonSensitive)))
            localStorage.setItem(btoa("purecore-" + window.location.hostname + "l"), encodedLength)
        } else {
            throw new Error("Local storage unavailable");
        }
    }

    public static load(): CoreSession {
        let hash = localStorage.getItem(btoa("purecore-" + window.location.hostname + "h"))
        let nonSensitive = localStorage.getItem(btoa("purecore-" + window.location.hostname + "d"))
        let len = localStorage.getItem(btoa("purecore-" + window.location.hostname + "l"))
        if (hash != null) {
            if (len != null) {
                if (nonSensitive != null) {
                    let decodedLen = Util.longLengthToShort(len);
                    let decodedHash = atob(hash);
                    let finalHash = decodedHash.substr(256 + decodedLen, decodedHash.length - ((256 + decodedLen) * 2))
                    let decodedNonSensitive = JSON.parse(atob(nonSensitive));
                    decodedNonSensitive.hash = finalHash; // now sensitive
                    return CoreSession.fromObject(Keychain.getMethod(decodedNonSensitive)); // removes entity, reconverts it
                } else {
                    localStorage.removeItem(btoa("purecore-" + window.location.hostname + "h"))
                    localStorage.removeItem(btoa("purecore-" + window.location.hostname + "l"))
                    throw new Error("Missing non-sensitive data");
                }
            } else {
                localStorage.removeItem(btoa("purecore-" + window.location.hostname + "h"))
                throw new Error("No hash length found");
            }
        } else {
            if (len != null) {
                localStorage.removeItem(btoa("purecore-" + window.location.hostname + "l"))
            }
            if (nonSensitive != null) {
                localStorage.removeItem(btoa("purecore-" + window.location.hostname + "d"))
            }
            throw new Error("No hash found");
        }
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