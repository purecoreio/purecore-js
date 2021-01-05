class ParamRequirement {

    public type: RequirementType;
    public value: Array<number> | RegExp | string;

    public constructor(type: RequirementType, value: Array<number> | RegExp | string) {
        this.type = type;
        this.value = value;
    }

    public static fromObject(object: any): ParamRequirement {
        let type = null;
        let value = null;
        switch (object.type) {
            case 0:
                type = RequirementType.RegExp
                value = RegExp(object.value);
                break;
            case 1:
                type = RequirementType.ImageType
                value = String(object.value);
                break;
            case 2:
                type = RequirementType.ImageSize
                value = new Array<Number>();
                for (let i = 0; i < object.value.length; i++) {
                    const element = object.value[i];
                    value.push(Number(element));
                }
                break;
            default:
                type = RequirementType.Unknown
                break;
        }
        return new ParamRequirement(type, value);
    }

}