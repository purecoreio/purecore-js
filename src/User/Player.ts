class Player {

    private id: string;
    private creation: Date;
    private username: string;
    private lastLogin: Date;
    private lastUpdated: Date;
    private bio: string;
    private birthdate: Date;

    /*private msa;
    private dca;
    private ga;
    private sa;*/

    public constructor(id?: string, creation?: Date, username?: string, lastLogin?: Date, lastUpdated?: Date, bio?: string, birthdate?: Date) {
        this.id = id;
        this.creation = creation;
        this.username = username;
        this.lastLogin = lastLogin;
        this.lastUpdated = lastUpdated;
        this.bio = bio;
        this.birthdate = birthdate;
    }

    public asObject(): any {
        let obj = JSON.parse(JSON.stringify(this));
        obj.lastUpdated = Util.epoch(this.getLastUpdated())
        obj.lastLogin = Util.epoch(this.getLastLogin())
        obj.birthdate = Util.epoch(this.getBirthdate())
        obj.creation = Util.epoch(this.getCreation())
        return obj;
    }

    public async getBillingAddress(): Promise<Address> {
        return await new Call()
            .commit('player/billing/address/get/').then((res) => {
                return Address.fromObject(res);
            })
    }

    public async setBillingAddress(address: any): Promise<Address> {
        if (!(address instanceof Address)) {
            address = Address.fromObject(address);
        }
        return await new Call()
            .addParam(Param.Address, address.asQuery())
            .commit('player/billing/address/set/').then((res) => {
                return Address.fromObject(res);
            })
    }

    public getLastUpdated(): Date {
        return this.lastUpdated;
    }

    public getLastLogin(): Date {
        return this.lastLogin;
    }

    public getBirthdate(): Date {
        return this.birthdate;
    }

    public getCreation(): Date {
        return this.creation;
    }

    public static fromObject(object: any): Player {

        let ply = new Player();

        if ('id' in object) {
            ply.id = String(object.id);
        }
        if ('creation' in object) {
            ply.creation = Util.date(object.creation)
        }
        if ('username' in object) {
            ply.username = object.username == null ? null : String(object.username);
        }
        if ('lastLogin' in object) {
            ply.lastLogin = Util.date(object.lastLogin);
        }
        if ('lastUpdated' in object) {
            ply.lastUpdated = Util.date(object.lastUpdated);
        }
        if ('bio' in object) {
            ply.bio = (object.bio == null ? null : String(object.bio));
        }
        if ('birthdate' in object) {
            ply.birthdate = Util.date(object.birthdate);
        }

        return ply;
    }

    public asOwner(): Owner {
        return new Owner(this.id, this.creation, this.username, this.lastLogin, this.lastUpdated, this.bio, this.birthdate)
    }


}