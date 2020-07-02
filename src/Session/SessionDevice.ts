class SessionDevice {
    public brand: string;
    public device: string;
    public model: string;
    public os: string;

    public constructor(brand?: string, device?: string, model?: string, os?: string) {
        this.brand = brand;
        this.device = device;
        this.model = model;
        this.os = os;
    }

    public getBrand(): string {
        return this.brand;
    }

    public getDevice(): string {
        return this.device;
    }

    public getModel(): string {
        return this.model;
    }

    public getOs(): string {
        return this.os;
    }

    public static fromJSON(json: any): SessionDevice {
        return new SessionDevice(
            json.brand,
            json.device,
            json.model,
            json.os
        );
    }
}
