class AnalyticGroupBase {

    public groupSize: number;
    public values: Array<AnalyticGroup>;

    public constructor(groupSize?: number, values?: Array<AnalyticGroup>) {
        this.groupSize = groupSize;
        this.values = values;
    }

    public fromObject(object: any): AnalyticGroupBase {
        this.groupSize = object.groupSize;
        var values = new Array<AnalyticGroup>();
        object.values.forEach(value => {
            this.values.push(new AnalyticGroup().fromObject(value));
        });
        this.values = values;
        return this;
    }

}