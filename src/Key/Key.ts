class Key extends Core {

    public core: Core;
    public type: string;
    public uuid: string;
    public hash: string;
    public instance: Instance;

    public constructor(core: Core, type?: string, uuid?: string, hash?: string, instance?: Instance) {
        super(core.getTool());
        this.core = core;
        this.type = type;
        this.uuid = uuid;
        this.hash = hash;
        this.instance = instance;
    }

    public fromArray(array): Key {
        this.type = array.type;
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        return this;

    }

}