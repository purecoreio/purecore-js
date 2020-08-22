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

    public fromId(id: string, query?: boolean): HostingTemplate {
        if (query) {
            //todo
        }
        this.uuid = id;
        return this;
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
        let core = this.core;
        return await new Call(this.core)
            .commit({
                machine: machine.uuid,
                template: this.uuid
            }, "hosting/template/add/")
            .then(function (jsonresponse) {
                return new Machine(core).fromObject(jsonresponse);
            });
    }


    public async use(instance: Instance, image: string, machine: Machine): Promise<BillingPreview> {

        return await new Call(this.core)
            .commit({
                machine: machine.uuid,
                template: this.uuid,
                instance: instance.uuid,
                image: image
            }, "hosting/template/use/")
            .then(function (jsonresponse) {
                return new BillingPreview().fromObject(jsonresponse);
            });

    }

}