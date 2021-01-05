class PerkParam {

    public id: string;
    public placeholder: string;
    public name: string;
    public description: string;
    public type: ParamType;
    public default: string;
    public mandatory: boolean;
    public requirements: Array<ParamRequirement>;
    public archived: boolean;

    public constructor(id: string, placeholder: string, name: string, description: string, type: ParamType, defaultv: string, mandatory: boolean, requirements: Array<ParamRequirement>, archived: boolean) {
        this.id = id;
        this.placeholder = placeholder;
        this.name = name;
        this.description = description;
        this.type = type;
        this.default = defaultv;
        this.mandatory = mandatory;
        this.requirements = requirements;
        this.archived = archived;
    }

    public static fromObject(object: any): PerkParam {
        let requirements = new Array<ParamRequirement>();
        let paramType = null;
        switch (object.type) {
            case 0:
                paramType = ParamType.String
                break;
            case 1:
                paramType = ParamType.Image
                break;
            default:
                paramType = ParamType.Unknown
                break;
        }
        for (let index = 0; index < object.requirements.length; index++) {
            const element = object.requirements[index];
            requirements.push(ParamRequirement.fromObject(element));
        }
        return new PerkParam(object.id, object.placeholder, object.name, object.description, paramType, object.default, object.mnandatory, requirements, object.archived);
    }

}