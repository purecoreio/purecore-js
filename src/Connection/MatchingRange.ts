class MatchingRange {

    public startedOn: Date;
    public finishedOn: Date;
    public matchWith: Date;

    public constructor(startedOn?: Date, finishedOn?: Date, matchWith?) {
        this.startedOn = startedOn;
        this.finishedOn = finishedOn;
        this.matchWith = matchWith;
    }

    public getStart(): Date {
        return this.startedOn;
    }

    public getFinish(): Date {
        return this.finishedOn;
    }

    public getMatchWith() {
        return this.matchWith;
    }

}