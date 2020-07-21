class Punishment extends Core {
    public core: Core;
    public uuid: string;
    public player: Player;
    public offenceList: Array<Offence>;
    public moderator: Player;
    public network: Network;
    public pointsChat: number;
    public pointsGameplay: number;
    public report: Report;
    public notes: string;
    public appealStatus: AppealStatus;

    public constructor(core?: Core, uuid?: string, player?: Player, offenceList?: Array<Offence>, moderator?: Player, network?: Network, pointsChat?: number, pointsGameplay?: number, report?: Report, notes?: string, appealStatus?: AppealStatus) {
        super(core.getTool());
        this.core = core;
        this.player = player;
        this.offenceList = offenceList;
        this.moderator = moderator;
        this.network = network;
        this.pointsChat = pointsChat;
        this.pointsGameplay = pointsGameplay;
        this.report = report;
        this.notes = notes;
        this.appealStatus = appealStatus;
    }

    public getId(): string {
        return this.uuid;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getOffenceList(): Array<Offence> {
        return this.offenceList;
    }

    public getModerator(): Player {
        return this.moderator;
    }

    public getNetwork(): Network {
        return this.network;
    }

    public getPointsChat(): number {
        return this.pointsChat;
    }

    public getPointsGameplay(): number {
        return this.pointsGameplay;
    }

    public getReport(): Report {
        return this.report;
    }

    public getNotes(): string {
        return this.notes;
    }

    public getAppealStatus(): AppealStatus {
        return this.appealStatus;
    }

    public getPoints(type: PointType): number {
        if (type === "GMT") {
            return this.pointsGameplay;
        } else if (type === "CHT") {
            return this.pointsChat;
        }
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array) {
        this.uuid = array.uuid;
        this.player = Player.fromJSON(this.core, array.player);
        this.offenceList = array.offenceList.map(offence => Offence.fromJSON(this.core, offence));
        this.moderator = Player.fromJSON(this.core, array.createdBy);
        this.network = Network.fromJSON(this.core, array.network);
        this.pointsChat = array.pointsAddedChat;
        this.pointsGameplay = array.pointsAddedGameplay;
        if (array.report == null) {
            this.report = null;
        } else {
            // to-do: report implementation
        }
        this.appealStatus = AppealStatus.fromJSON(this.core, array.appealStatus);
        return this;
    }

    public static fromJSON(core: Core, json: any): Punishment {
        return new Punishment(
            core,
            json.uuid,
            Player.fromJSON(core, json.player),
            json.offenceList.map(offence => Offence.fromJSON(core, offence)),
            Player.fromJSON(core, json.createdBy),
            Network.fromJSON(core, json.network),
            json.pointsAddedChat,
            json.pointsAddedGameplay,
            null, //TODO: report
            json.notes,
            AppealStatus.fromJSON(core, json.appealStatus)
        );
    }
}
