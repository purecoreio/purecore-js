export default class Machine {

    // todo other props
    public readonly id: string;

    constructor(id: string) {
        this.id = id
    }

    public static fromObject(obj: any): Machine {
        return new Machine(
            obj.id
        )
    }

}