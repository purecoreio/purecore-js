class HostingManager extends Core {

    public core: Core;

    public constructor(core: Core) {
        super(core.getTool(), core.dev);
        this.core = core;
    }

    public async getRecommended(countries: [string]): Promise<Array<HostingAvailability>> {
        let main = this;
        return await new Call(this.core)
            .commit({
                countries: Array.isArray(countries) ? JSON.stringify(countries) : JSON.stringify([])
            }, "hosting/recommended/")
            .then(function (jsonresponse) {
                let availabilityList = new Array<HostingAvailability>();
                jsonresponse.forEach(element => {
                    availabilityList.push(new HostingAvailability(main.core).fromObject(element))
                });
                return availabilityList;
            });
    }

    public async preview(template: HostingTemplate | string): Promise<BillingPreview> {

        if (typeof template == "string") template = new HostingTemplate(this.core).fromId(template, false);

        return await new Call(this.core)
            .commit({
                template: template.uuid
            }, "hosting/template/use/preview/")
            .then(function (jsonresponse) {
                return new BillingPreview().fromObject(jsonresponse);
            });
    }

    public getTemplate(): HostingTemplate {
        return new HostingTemplate(this.core);
    }

    public getMachineFromId(id: string): Machine {
        return new Machine(this.core, null, null, null, null, null, null, null, null, null, id)
    }


}