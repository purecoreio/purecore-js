class CommandContext extends Core {

    public core: Core;

    public player: Player;
    public legacyUsername: string;
    public legacyUuid: string;
    public originType: string;
    public originName: string;
    public originId: string;
    public causedBy: string;
    public quantity: number;


    public constructor(core: Core, player?: Player, legacyUsername?: string, legacyUuid?: string, originType?: string, originName?: string, originId?: string, causedBy?: string, quantity?: number) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.player = player;
        this.legacyUsername = legacyUsername;
        this.legacyUuid = legacyUuid;
        this.originType = originType;
        this.originName = originName;
        this.originId = originId;
        this.causedBy = causedBy;
        this.quantity = quantity;
    }

    public fromObject(object: any): CommandContext {
        this.player = new Player(this.core).fromObject(object.player);
        this.legacyUsername = object.legacyUsername;
        this.legacyUuid = object.legacyUuid;
        this.originType = object.originType;
        this.originName = object.originName;
        this.originId = object.originId;
        this.causedBy = object.causedBy;
        this.quantity = object.quantity;
        return this;
    }


}