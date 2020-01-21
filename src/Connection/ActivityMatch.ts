class ActivityMatch {

    public startedOn: Date;
    public finishedOn: Date;
    public activity;
    public matchList: Array<MatchingRange>;

    public constructor(startedOn?: Date, finishedOn?: Date, activity?, matchList?: Array<MatchingRange>) {
        this.startedOn = startedOn;
        this.finishedOn = finishedOn;
        this.activity = activity;
        this.matchList = matchList;
    }

    public getStart(): Date {
        return this.startedOn;
    }

    public getFinish(): Date {
        return this.finishedOn;
    }

    public getMatchList(): Array<MatchingRange> {
        return this.matchList;
    }

}