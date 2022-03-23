class Network {
    public readonly id: string;
    public readonly name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static fromObject(object: any): Network {
        return new Network(object.id, object.name)
    }
}