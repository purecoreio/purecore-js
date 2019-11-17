class Instance extends Core {

    core: Core;
    uuid: string;
    name: string;
    type: string;

    constructor(core: Core, uuid: string, name: string, type: string) {
        super(core.getKey())
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.type = type;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.uuid;
    }

    asNetwork(): Network {
        return new Network(this.core, this)
    }

}

module.exports.Instance