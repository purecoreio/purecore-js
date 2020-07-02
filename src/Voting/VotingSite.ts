class VotingSite extends Core {
    public readonly core: Core;
    public uuid: string;
    public supervisor: Owner;
    public resetTimes; //TODO: type
    public timezone: string;
    public name: string;
    public url: string;
    public technicalName: string;

    public constructor(core: Core, uuid?: string, supervisor?: Owner, resetTimes?, timezone?: string, name?: string, url?: string, technicalName?: string) {
        super(core.getTool());

        this.core = core;
        this.uuid = uuid;
        this.supervisor = supervisor;
        this.resetTimes = resetTimes;
        this.timezone = timezone;
        this.name = name;
        this.url = url;
        this.technicalName = technicalName;
    }

    public async getConfig(network: Network, empty: boolean = true) {
        if (empty) {
            return new VotingSiteConfig(this.core, network, this, null);
        } else {
            throw new Error("to be implemented");
            // to-do fetch from server
        }
    }

    public getId(): string {
        return this.uuid;
    }

    public getSupervisor(): Owner {
        return this.supervisor;
    }

    public getResetTimes(): any {
        return this.resetTimes;
    }

    public getTimezone(): string {
        return this.timezone;
    }

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }

    public getTechnicalName(): string {
        return this.technicalName;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): VotingSite {
        this.uuid = array.uuid;
        this.supervisor = Owner.fromJSON(this.core, array.supervisor);
        this.resetTimes = array.resetTimes;
        this.timezone = array.timezone;
        this.name = array.name;
        this.url = array.url;
        this.technicalName = array.technicalName;
        return this;
    }

    public static fromJSON(core: Core, json: any): VotingSite {
        return new VotingSite(
            core,
            json.uuid,
            Owner.fromJSON(core, json.supervisor),
            json.resetTimes,
            json.timezone,
            json.name,
            json.url,
            json.technicalName
        );
    }
}
