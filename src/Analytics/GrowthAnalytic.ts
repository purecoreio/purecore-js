class GrowthAnalytic {

    public uuid;
    public instance;

    public newPlayers;
    public activePlayers;
    public inactivePlayers;

    public newPlayersRelative;
    public activePlayersRelative;
    public inactivePlayersRelative;

    public timestamp;


    public constructor(uuid: string = null, instance: Instance = null, newPlayers = 0, activePlayers = 0, inactivePlayers = 0, newPlayersRelative = 0, activePlayersRelative = 0, inactivePlayersRelative = 0, timestamp = 0) {
        this.uuid = uuid;
        this.instance = instance;

        this.newPlayers = newPlayers;
        this.activePlayers = activePlayers;
        this.inactivePlayers = inactivePlayers;

        this.newPlayersRelative = newPlayersRelative;
        this.activePlayersRelative = activePlayersRelative;
        this.inactivePlayersRelative = inactivePlayersRelative;

        this.timestamp = timestamp;
    }

    public getLegacy(): Analytic {
        return new Analytic(this.timestamp, this, this.getFields());
    }

    public fromArray(array): GrowthAnalytic {
        this.uuid = null;
        this.instance = null;

        this.newPlayers = array.newPlayers;
        this.activePlayers = array.activePlayers;
        this.inactivePlayers = array.inactivePlayers;

        this.newPlayersRelative = array.newPlayersRelative;
        this.activePlayersRelative = array.activePlayersRelative;
        this.inactivePlayersRelative = array.inactivePlayersRelative;

        this.timestamp = array.timestamp * 1000;
        return this;
    }

    public getFields(): Array<AnalyticField> {
        var result = new Array<AnalyticField>();
        result.push(new AnalyticField(this.newPlayers, "New Players", "newPlayers"));
        result.push(new AnalyticField(this.activePlayers, "Active Players", "activePlayers"));
        result.push(new AnalyticField(this.inactivePlayers, "Inactive Players", "inactivePlayers"));
        result.push(new AnalyticField((this.newPlayersRelative*100).toFixed(2), "New Players %", "newPlayersRelative"));
        result.push(new AnalyticField((this.activePlayersRelative*100).toFixed(2), "Active Players %", "activePlayersRelative"));
        result.push(new AnalyticField((this.inactivePlayersRelative*100).toFixed(2), "Inactive Players %", "inactivePlayersRelative"));
        return result;
    }

}