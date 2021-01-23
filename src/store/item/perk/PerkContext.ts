class PerkContext {

    public id: string;
    public name: string;
    public description: string;
    public countable: boolean;
    public params: Array<PerkParam>;
    public commands: ExecutionSetup;
    public quantity: number;
    public archived: boolean;

    public constructor(id: string, name: string, description: string, countable: boolean, params: Array<PerkParam>, commands: ExecutionSetup, quantity: number, archived: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.countable == countable;
        this.params = params;
        this.commands = commands;
        this.quantity = quantity;
        this.archived = archived;
    }

    public static fromObject(object: any): PerkContext {
        let params = new Array<PerkParam>();
        for (let index = 0; index < object.params.length; index++) {
            const element = object.params[index];
            params.push(PerkParam.fromObject(element));
        }
        return new PerkContext(object.id, object.name, object.description, object.countable, params, ExecutionSetup.fromObject(object.commands), object.quantity, object.archived);
    }

    public asPerk(): Perk {
        return new Perk(this.id,this.name,this.description,this.countable,this.params,this.commands,this.archived);
    }

}