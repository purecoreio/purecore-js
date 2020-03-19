class Analytic {

    public timestamp;
    public original;
    public fields: Array<AnalyticField>;

    public constructor(timestamp, original, fields: Array<AnalyticField>) {
        this.timestamp = timestamp;
        this.original = original;
        this.fields = fields;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public getOriginal() {
        return this.original;
    }

    public getFields(): Array<AnalyticField> {
        return this.fields;
    }

    public setFields(fields: Array<AnalyticField>) {
        this.fields = fields;
    }

}