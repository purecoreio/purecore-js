class ExecutionTemplate {

    public id: string;
    public string: string;
    public requireOnline: boolean;
    public instances: Array<Instance>;
    public delay: number;

    public constructor(id: string, string: string, requireOnline: boolean, instances: Array<Instance>, delay: number) {
        this.id = id;
        this.string = string;
        this.requireOnline = requireOnline;
        this.instances = instances;
        this.delay = delay;
    }

    public static fromObject(object: any): ExecutionTemplate {
        let instances = new Array<Instance>();
        for (let index = 0; index < object.instances.length; index++) {
            const element = object.instances[index];
            instances.push(Instance.fromObject(element));
        }
        return new ExecutionTemplate(object.id, object.string, object.requireOnline, instances, object.delay);
    }


}