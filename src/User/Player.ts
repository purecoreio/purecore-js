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

    public static fromObject(object: any): Player {

        let ply = new Player();

        if ('id' in object) {
            ply.id = String(object.id);
        }
        if ('creation' in object) {
            ply.creation = Util.date(object.creation)
        }
        if ('username' in object) {
            ply.username = String(object.username);
        }
        if ('lastLogin' in object) {
            ply.lastLogin = Util.date(object.lastLogin);
        }
        if ('lastUpdated' in object) {
            ply.lastUpdated = Util.date(object.lastUpdated);
        }
        if ('bio' in object) {
            ply.bio = String(object.bio);
        }
        if ('birthdate' in object) {
            ply.birthdate = Util.date(object.birthdate);
        }

        return ply;
    }

    public asOwner(): Owner {
        return new Owner()
        //return new Owner(this.id, this.creation, this.username, this.lastLogin, this.lastUpdated, this.bio, this.birthdate)
    }


}