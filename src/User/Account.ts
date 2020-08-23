class Account extends Core {

    public core: Core;
    public uuid: string;

    public constructor(core: Core, uuid?: string) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
    }

    public fromObject(object: any): Account {
        this.uuid = object.uuid;
        return this;
    }

    public async getPendingNotifications(): Promise<Array<AccountNotification>> {
        let main = this;
        return await new Call(this.core)
            .commit({}, "account/notification/pending/list/")
            .then(function (jsonresponse) {
                let notifications = new Array<AccountNotification>();
                jsonresponse.forEach(jsonelement => {
                    notifications.push(new AccountNotification(main.core).fromObject(jsonelement))
                });
                return notifications;
            });
    }

}