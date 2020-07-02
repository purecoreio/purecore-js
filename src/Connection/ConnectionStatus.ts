class ConnectionStatus {
    public openedOn: Date;
    public closedOn: Date;

    public constructor(openedOn?: Date, closedOn?: Date) {
        this.openedOn = openedOn;
        this.closedOn = closedOn;
    }

    public getOpenedOn(): Date {
        return this.openedOn;
    }

    public isActive(): boolean {
        return this.closedOn == undefined;
    }

    public isClosed(): boolean {
        return !this.isActive();
    }

    public getClosedOn(): Date {
        return this.closedOn;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): ConnectionStatus {
        this.openedOn = new Date(array.openedOn * 1000);
        this.closedOn = new Date(array.closedOn * 1000);
        return this;
    }

    public static fromJSON(json: any): ConnectionStatus {
        return new ConnectionStatus(
            new Date(json.openedOn * 1000),
            json.closedOn == null ? null : new Date(json.closedOn * 1000)
        );
    }
}
