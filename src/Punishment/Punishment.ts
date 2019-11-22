class Punishment extends Core {

    public core: Core;
    public uuid: string
    public player: Player;
    public offenceList: Array<Offence>;
    public moderator: Player;
    public network: Network;
    public pointsChat;
    public pointsGameplay;
    public report: Report;
    public notes: string;

    public constructor(core?: Core, player?: Player, offenceList?: Array<Offence>, moderator?: Player, network?: Network, pointsChat?, pointsGameplay?, report?: Report, notes?: string) {
        super(core.getKey());
        this.core = core;
        this.player = player;
        this.offenceList = offenceList;
        this.moderator = moderator;
        this.network = network;
        this.pointsChat = pointsChat;
        this.pointsGameplay = pointsGameplay;
        this.report = report;
        this.notes = notes;
    }

}