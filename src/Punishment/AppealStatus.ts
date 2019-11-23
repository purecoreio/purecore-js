class AppealStatus extends Core {

    public status: string;
    public appealId: string;

    public constructor(core: Core, status: string, appealId: string) {
        super(core.getKey());
        this.status = status;
        this.appealId = appealId;
    }

    public getAppeal() {
        // to-do
    }

    public toString() {
        return this.status;
    }

}