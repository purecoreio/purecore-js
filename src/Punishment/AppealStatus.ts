class AppealStatus extends Core {
    public status: string;
    public appealId: string;

    public constructor(core: Core, status: string, appealId: string) {
        super(core.getTool());
        this.status = status;
        this.appealId = appealId;
    }

    public getAppeal() {
        //TODO: appeal fetching
    }

    public getStatus(): string {
        return this.status;
    }

    public getAppealId(): string {
        return this.appealId;
    }

    public toString(): string {
        return this.status;
    }

    public static fromJSON(core: Core, json: any): AppealStatus {
        return new AppealStatus(
            core,
            json.status,
            json.appealId
        );
    }
}
