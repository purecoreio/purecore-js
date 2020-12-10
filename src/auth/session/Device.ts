class SessionDevice {

    private os: string;
    private device: string;
    private brand: string;
    private model: string;

    public constructor(os?: string, device?: string, brand?: string, model?: string) {
        this.os = os;
        this.device = device;
        this.brand = brand;
        this.model = model;
    }

    public asObject(): any {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }

    public static fromObject(object: any): SessionDevice {
        let dev = new SessionDevice();
        dev.os = String(object.os);
        dev.device = String(object.device);
        dev.brand = String(object.brand);
        dev.model = String(object.model);
        return dev;
    }

}