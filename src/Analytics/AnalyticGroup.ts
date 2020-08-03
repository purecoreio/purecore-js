class AnalyticGroup {

    public key;
    public value;

    public constructor(key?, value?) {
        this.key = key;
        this.value = value;
    }

    public fromObject(object: any): AnalyticGroup {
        this.key = object.key;
        this.value = object.value;
        return this;
    }

}