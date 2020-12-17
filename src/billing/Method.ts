class Method {

    public creation: Date;
    public type: string;
    public brand: string;
    public wallet: string;
    public id: string;
    public visibleId: string;
    public default: boolean;

    public static fromObject(object: any): Method {
        let method = new Method();
        method.creation = Util.date(object.creation);
        method.type = object.type == null ? null : String(object.type);
        method.brand = object.brand == null ? null : String(object.brand);
        method.wallet = object.wallet == null ? null : String(object.wallet);
        method.id = object.id == null ? null : String(object.id);
        method.visibleId = object.type == null ? null : String(object.visibleId);
        method.default = object.default === true ? true : false;
        return method;
    }

    public getId(): string {
        return this.id;
    }

    public getVisibleId(): string {
        return this.visibleId;
    }

    public isDefault(): boolean {
        return this.default;
    }

}