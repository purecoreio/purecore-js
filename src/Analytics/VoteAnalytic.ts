class VoteAnalytic {

    public uuid;
    public network: Network;
    public voteCount;
    public voterCount;
    public timestamp;

    public constructor(uuid: string = null, network: Network = null, voteCount = 0, voterCount = 0, timestamp = 0) {
        this.uuid = uuid;
        this.network = network;
        this.voteCount = voteCount;
        this.voterCount = voterCount;
        this.timestamp = timestamp;
    }

    public fromArray(array): VoteAnalytic {
        this.uuid = array.uuid;
        this.network = null;
        this.voteCount = array.voteCount;
        this.voterCount = array.voterCount;
        this.timestamp = array.timestamp;
        return this;
    }

    public getLegacy(): Analytic {
        return new Analytic(this.timestamp, this, this.getFields());
    }

    public getFields(): Array<AnalyticField> {
        var result = new Array<AnalyticField>();
        result.push(new AnalyticField(this.voteCount, "Vote count", "voteCount"));
        result.push(new AnalyticField(this.voterCount, "Voter count", "voterCount"));
        return result;
    }

}