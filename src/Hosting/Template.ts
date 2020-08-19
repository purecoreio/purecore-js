class HostingTemplate extends Core {

    public core: Core;

    public owner: Owner;
    public uuid: string;
    public supportedImages: Array<string>;
    public memory: number;
    public size: number;
    public cores: number;
    public price: number

    public constructor(core: Core) {
        super(core.getTool(), core.dev);
        this.core = core;
    }

    public fromObject(object: any): HostingTemplate {
        this.owner = new Owner(this.core, object.owner.id, object.owner.name, object.owner.surname, object.owner.email);
        this.uuid = object.uuid;
        this.supportedImages = object.supportedImages;
        this.memory = object.memory;
        this.size = object.size;
        this.cores = object.cores;
        this.price = object.price;
        return this;
    }

    public async addTo(machine: Machine): Promise<Machine> {
        return await new Call(this.core)
            .commit({
                machine: machine.uuid,
                template: this.uuid
            }, "hosting/template/add/")
            .then(function (jsonresponse) {
                return new Machine(this.core).fromObject(jsonresponse);
            });
    }

}