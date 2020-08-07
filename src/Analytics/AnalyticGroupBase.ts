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
            values.push(new AnalyticGroup().fromObject(value));
        });
        this.values = values;
        return this;
    }

    public toApexHeatmap(): any[] {
        let series = [];
        let current = [];
        this.values.forEach(value => {
            current.push({
                x: value.key,
                y: value.value
            });
            if (current.length >= this.groupSize) {
                series.push({
                    name: (series.length + 1).toString(),
                    data: current
                })
                current = [];
            } else if (series.length * this.groupSize + current.length == this.values.length) {
                series.push({
                    name: (series.length + 1).toString(),
                    data: current
                })
            }
        });
        return series;
    }

}