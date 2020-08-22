class Host extends Core {

    public core: Core;

    public uuid: string;
    public instance: Instance;
    public machine: Machine;
    public owner: Owner;
    public createdOn: number;
    public disabledOn: number;
    public template: HostingTemplate;
    public port: number;
    public additionalPorts: Array<number>;
    public image: string;

    public constructor(core: Core, uuid?: string, instance?: Instance, machine?: Machine, owner?: Owner, createdOn?: number, disabledOn?: number, template?: HostingTemplate, port?: number, additionalPorts?: Array<number>, image?: string) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.instance = instance;
        this.machine = machine;
        this.owner = owner;
        this.createdOn = createdOn;
        this.disabledOn = disabledOn;
        this.template = template;
        this.port = port;
        this.additionalPorts = additionalPorts;
        this.image = image;
    }

    public fromObject(object: any): Host {
        this.uuid = object.uuid;
        this.instance = new Instance(this.core).fromObject(object.instance);
        this.machine = new Machine(this.core).fromObject(object.machine);
        this.owner = new Owner(this.core, object.owner.id, object.owner.name, object.owner.surname, object.owner.email);
        this.createdOn = object.createdOn;
        this.disabledOn = object.disabledOn;
        this.template = new HostingTemplate(this.core).fromObject(object.template);
        this.port = object.port;
        let additionalPorts = new Array<number>();
        object.additionalPorts.forEach(port => {
            additionalPorts.push(port);
        });
        this.additionalPorts = additionalPorts;
        this.image = object.image;
        return this;
    }


}