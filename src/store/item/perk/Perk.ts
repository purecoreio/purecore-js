class Perk {

    public id: string;
    public name: string;
    public description: string;
    public countable: boolean;
    public params: Array<PerkParam>;
    public commands: ExecutionSetup;
    public archived: boolean;

    public constructor(id: string, name: string, description: string, countable: boolean, params: Array<PerkParam>, commands: ExecutionSetup, archived: boolean) {
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
        for (let index = 0; index < object.params.length; index++) {
            const element = object.params[index];
            params.push(PerkParam.fromObject(element));
        }
        return new Perk(object.id, object.name, object.description, object.countable, params, ExecutionSetup.fromObject(object.commands), object.archived);
    }

    public async addExecutionTemplate(template: ExecutionTemplate | string, type: ExecutionType | Number): Promise<void> {
        let templateId = template;
        if (template instanceof ExecutionTemplate) {
            templateId = template.id;
        }
        let main = this;
        return await new Call()
            .addParam(Param.Perk, main.id)
            .addParam(Param.ExecutionTemplate, templateId)
            .addParam(Param.ExecutionType, type)
            .commit('store/perk/command/add/').then(() => {
                return;
            })
    }

}