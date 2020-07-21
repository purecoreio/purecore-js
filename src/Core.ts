class Core {
    public key: string;
    public session: Session;
    public dev: boolean;

    public constructor(tool?: any, dev?: boolean) {
        if (dev == null) {
            this.dev = false;
        } else {
            this.dev = dev;
        }
        if (tool != undefined) {
            if (typeof tool == "string") {
                this.key = tool;
            } else if (typeof tool == "object") {
                if (tool instanceof Session) {
                    this.session = tool;
                } else {
                    this.session = new Session(new Core(this.session, this.dev)).fromArray(tool);
                }
            }
        }

        // if not start with fromdiscord or fromtoken
    }

    public getCacheCollection(): CacheCollection {
        return new CacheCollection();
    }

    public async requestGlobalHash(): Promise<Array<ConnectionHashGlobal>> {
        return await new Call(this)
            .commit({}, "session/hash/list/")
            .then(json => json.map(hash => ConnectionHashGlobal.fromJSON(this, hash)));
    }

    public getPlayersFromIds(ids: Array<string>): Array<Player> {
        return ids.map(id => new Player(this, id));
    }

    public async getMachine(hash: string): Promise<Machine> {
        return await new Call(this)
            .commit({ hash: hash }, "machine")
            .then(Machine.fromJSON);
    }

    public async fromToken(googleToken: string): Promise<Session> {
        return await new Call(this)
            .commit({ token: googleToken }, "session/from/google")
            .then(json => {
                const session: Session = Session.fromJSON(new Core(null), json);
                this.session = session;
                return session;
            });
    }

    public asBillingAddress(json: any): BillingAddress {
        return BillingAddress.fromJSON(json);
    }

    public getWorkbench(): Workbench {
        return new Workbench();
    }

    public async pushFCM(token: string) {
        return await new Call(this)
            .commit({ token: token }, "account/push/fcm")
            .then(() => true);
    }

    public getTool(): string | Session {
        if (this.key != null) {
            return this.key;
        } else {
            return this.session;
        }
    }

    public getCoreSession(): Session {
        return this.session;
    }

    public getLegacyKey(): Key {
        return new Key(this, "UNK", null, this.key, null);
    }

    public getKey(): string {
        if (this.key == undefined) {
            return null;
        } else {
            return this.key;
        }
    }

    public getElements(): Elements {
        return new Elements(this);
    }

    public getInstance(instanceId, name?, type?): Instance {
        return new Instance(this, instanceId, name, type);
    }

    public getCore(): Core {
        return this;
    }

    public async fromDiscord(guildId: string, botToken: string, devkey: boolean): Promise<Core> {
        let params: any = {
            guildid: guildId,
            token: botToken
        };

        if (devkey) params.devkey = true;

        return await new Call(this)
            .commit(params, "key/from/discord")
            .then(json => {
                this.key = json.hash;
                return this;
            });
    }
}

try {
    module.exports = Core;
} catch (error) {
    console.log(
        "[corejs] starting plain vanilla instance, as nodejs exports were not available"
    );
}
