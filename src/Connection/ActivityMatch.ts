class ActivityMatch {
    public startedOn: Date;
    public finishedOn: Date;
    public activity: any; //TODO: type
    public matchList: Array<MatchingRange>;

    public constructor(startedOn?: Date, finishedOn?: Date, activity?: any, matchList?: Array<MatchingRange>) {
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

    public getActivity(): any {
        return this.activity;
    }

    public getMatchList(): Array<MatchingRange> {
        return this.matchList;
    }

    public static fromJSON(json: any): ActivityMatch {
        return new ActivityMatch(
            new Date(json.startedOn * 1000),
            new Date(json.finishedOn * 1000),
            json.activity,
            json.matchList.map(matchingRange => new MatchingRange(
                new Date(matchingRange.startedOn * 1000),
                new Date(matchingRange.finishedOn * 1000),
                matchingRange.matchWith
            ))
        );
    }
}
