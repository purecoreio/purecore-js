class Appeal extends Core {
    public uuid: string;
    public punishment: Punishment;
    public content: string;
    public staffResponse: string;
    public staffMember: Player;
    public accepted: boolean;

    public constructor(core: Core, uuid?: string, punishment?: Punishment, content?: string, staffResponse?: string, staffMember?: Player, accepted?: boolean) {
        super(core.getTool());

        this.uuid = uuid;
        this.punishment = punishment;
        this.content = content;
        this.staffResponse = staffResponse;
        this.staffMember = staffMember;
        this.accepted = accepted;
    }

    public getId(): string {
        return this.uuid;
    }

    public getPunishment(): Punishment {
        return this.punishment;
    }

    public getContext(): string {
        return this.content;
    }

    public getStaffResponse(): string {
        return this.staffResponse;
    }

    public getStaffMember(): Player {
        return this.staffMember;
    }

    public isAccepted(): boolean {
        return this.accepted;
    }
}
