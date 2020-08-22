class HostingAvailability extends Core {

    public core: Core;
    public template: HostingTemplate;
    public machine: Machine;
    public count: number;

    public constructor(core: Core, template?: HostingTemplate, machine?: Machine, count?: number) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.template = template;
        this.machine = machine;
        this.count = count;
    }

    public fromObject(object: any): HostingAvailability {
        this.template = new HostingTemplate(this.core).fromObject(object);
        this.machine = new Machine(this.core).fromObject(object.machine);
        this.count = object.count;
        return this;
    }

    public async use(instance: Instance, image: string): Promise<BillingPreview> {
        return this.template.use(instance, image, this.machine);
    }

}