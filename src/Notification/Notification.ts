class AccountNotification extends Core {

    public core:Core;
    public uuid: string;
    public seen: boolean;
    public title: string;
    public message: string;
    public action: string;
    public account: Account;
    public creation: Date;

    public constructor(core:Core, uuid?: string, seen?: boolean, title?: string, message?: string, action?: string, account?: Account, creation?: Date) {
        super(core.getTool(),core.dev);
        this.core=core;
        this.uuid = uuid;
        this.seen = seen;
        this.title = title;
        this.message = message;
        this.action = action;
        this.account = account;
        this.creation = creation;
    }

    public fromObject(object: any): AccountNotification {
        this.uuid = object.uuid;
        this.seen = object.seen;
        this.title = object.title;
        this.message = object.message;
        this.action = object.action;
        this.account = new Account(this.core).fromObject(object.account);
        this.creation = new Date(object.creation*1000);
        return this;
    }

}