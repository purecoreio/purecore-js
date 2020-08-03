class PerkParam extends Core {

    public core: Core;
    public uuid: string;
    public placeholder: string;
    public perk: Perk;
    public name: string;
    public description: string;
    public network: Network;
    public type: string;
    public default: string;
    public mandatory: boolean;
    public requirements: Array<ParamRequirement>;

    public constructor(core: Core, uuid?: string, placeholder?: string, perk?: Perk, name?: string, description?: string, network?: Network, type?: string, defaultv?: string, mandatory?: boolean, requirements?: Array<ParamRequirement>) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.placeholder = placeholder;
        this.perk = perk;
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
        this.perk = new Perk(this.core).fromObject(object.perk);
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

    /**
    * @param type the type of requirement: regex, size (img only), imgtype https://www.iana.org/assignments/media-types/media-types.xhtml#image)
    * @param value string when regex, array [width,height] for size, array ['image/png','image/jpg','class/type'...] for imgtype
    * if a requirement of that type is already present, it will overwrite its properties
    * for regex values, javascript ignores \ when followed by /, so use \\/ (double backslash)
    */
    public async addRequirement(type: string, value?: string | any): Promise<ParamRequirement> {

        var finalv = value;
        if(typeof value != 'string') finalv = JSON.stringify(value);

        return new Call(this.core)
            .commit(
                {
                    param: this.uuid,
                    type: type,
                    value: finalv,
                },
                "store/perk/param/requirement/add/"
            )
            .then(() => {
                return new ParamRequirement(type, value);
            });

    }

    /**
    * @param type the type of requirement to remove: regex, size, imgtype
    * throws error if there are no requirements of that type
    */
    public async removeRequirement(type: string): Promise<boolean> {

        return new Call(this.core)
            .commit(
                {
                    param: this.uuid,
                    type: type,
                },
                "store/perk/param/requirement/remove/"
            )
            .then(() => {
                return true;
            });

    }

    /**
    * @param value string or url to test
    * throws error if the tests are not passed
    */
    public async test(value: string): Promise<boolean> {

        return new Call(this.core)
            .commit(
                {
                    param: this.uuid,
                    str: value,
                },
                "store/perk/param/requirement/test/"
            )
            .then(() => {
                return true;
            });

    }

}