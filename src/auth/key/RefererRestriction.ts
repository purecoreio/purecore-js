class RefererRestriction {

    private index;
    private domain;
    private ip;

    public constructor(index?: number, domain?: string, ip?: string) {
        this.index = index;
        this.domain = domain;
        this.ip = ip;
    }

    public static fromObject(object: any): RefererRestriction {
        let ref = new RefererRestriction();
        ref.index = Number(object.index);
        ref.domain = String(object.domain);
        ref.ip = String(object.ip)
        return ref;
    }

}