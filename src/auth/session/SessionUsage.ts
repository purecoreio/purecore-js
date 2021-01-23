class SessionUsage {

    private creation: Date;
    private uses: Number;

    public constructor(creation?: Date, uses?: number) {
        this.creation = creation;
        this.uses = uses;
    }

    public asObject(): any {
        let obj = JSON.parse(JSON.stringify(this));
        obj.creation = Util.epoch(this.creation);
        return obj;
    }

    public static fromObject(object: any): SessionUsage {
        let us = new SessionUsage();
        us.creation = Util.date(object.creation);
        us.uses = Number(object.uses);
        return us;
    }

}