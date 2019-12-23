class Appeal extends Core {

    public uuid: string;
    public punishment: Punishment;
    public content: string;
    public staffResponse: string;
    public staffMember: Player;
    public accepted: boolean;

    constructor(core: Core, uuid?: string, punishment?: Punishment, content?: string, staffResponse?: string, staffMember?: Player, accepted?: boolean) {
        super(core.getTool());
        this.uuid = uuid;
        this.punishment = punishment;
        this.content = content;
        this.staffResponse = staffResponse;
        this.staffMember = staffMember;
        this.accepted = accepted;
    }

}