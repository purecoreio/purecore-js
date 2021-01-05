class Perk {

    public id: string;
    public name: string;
    public description: string;
    public countable: boolean;
    public params: Array<PerkParam>;
    public commands: Array<ExecutionTemplate>;
    public archived: boolean;

    public constructor(id: string, name: string, description: string, countable: boolean, params: Array<PerkParam>, commands: Array<ExecutionTemplate>, archived: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.countable == countable;
        this.params = params;
        this.commands = commands;
        this.archived = archived;
    }

    public static fromObject(object: any): Perk {
        let params = new Array<PerkParam>();
        let commands = new Array<ExecutionTemplate>();
        for (let index = 0; index < object.params.length; index++) {
            const element = object.params[index];
            params.push(PerkParam.fromObject(element));
        }
        for (let index = 0; index < object.commands.length; index++) {
            const element = object.commands[index];
            commands.push(ExecutionTemplate.fromObject(element));
        }
        return new Perk(object.id, object.name, object.description, object.countable, params, commands, object.archived);
    }

}