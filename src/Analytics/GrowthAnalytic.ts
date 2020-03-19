class GrowthAnalytic {

    public uuid;
    public instance;
    public newPlayers;
    public activePlayers;
    public inactivePlayers;
    public timestamp;


    public constructor(uuid: string = null, instance: Instance = null, newPlayers = 0, activePlayers = 0, inactivePlayers = 0, timestamp = 0) {
        this.uuid = uuid;
        this.instance = instance;
        this.newPlayers = newPlayers;
        this.activePlayers = activePlayers;
        this.inactivePlayers = inactivePlayers;
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
        this.timestamp = array.timestamp;
        return this;
    }

    public getFields(): Array<AnalyticField> {
        var result = new Array<AnalyticField>();
        result.push(new AnalyticField(this.newPlayers, "New Players", "newPlayers"));
        result.push(new AnalyticField(this.activePlayers, "Active Players", "activePlayers"));
        result.push(new AnalyticField(this.inactivePlayers, "Inactive Players", "inactivePlayers"));
        return result;
    }

}