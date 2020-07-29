class PerkParam extends Core {

    public core: Core;
    public uuid: string;
    public placeholder: string;
    public name: string;
    public description: string;
    public network: Network;
    public type: string;
    public default: string;
    public mandatory: boolean;
    public requirements: Array<ParamRequirement>;

    public constructor(core: Core, uuid?: string, placeholder?: string, name?: string, description?: string, network?: Network, type?: string, defaultv?: string, mandatory?: boolean, requirements?: Array<ParamRequirement>) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.placeholder = placeholder;
        this.name = name;
        this.description;
        this.network = network;
        this.type = type;
        this.default = defaultv;
        this.mandatory = mandatory;
        this.requirements = requirements;
    }

    public fromObject(object): PerkParam {
        this.uuid = object.uuid;
        this.placeholder = object.placeholder;
        this.name = object.name;
        this.description = object.description;
        this.network = new Network(this.core, new Instance(this.core, object.network.uuid, object.network.name, "NTW"));
        this.type = object.type;
        this.default = object.default;
        this.mandatory = object.mandatory;
        this.requirements = new Array<ParamRequirement>();
        object.requirements.forEach(requirement => {
            this.requirements.push(new ParamRequirement(requirement.type, requirement.value));
        });
        return this;
    }

}