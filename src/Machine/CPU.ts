class CPU {

    public manufacturer: string
    public vendor: string
    public speed: string
    public maxSpeed: string
    public physicalCores: string
    public virtualCores: string

    constructor(manufacturer?: string, vendor?: string, speed?, maxSpeed?, physicalCores?, virtualCores?) {
        this.manufacturer = manufacturer;
        this.vendor = vendor;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.physicalCores = physicalCores;
        this.virtualCores = virtualCores;
    }

    public fromArray(array): CPU {
        this.manufacturer = array.manufacturer;
        this.vendor = array.vendor;
        this.speed = array.speed;
        this.maxSpeed = array.maxSpeed;
        this.physicalCores = array.physicalCores;
        this.virtualCores = array.virtualCores;
        return this;
    }

    public asArray() {
        return { "manufacturer": this.manufacturer, "vendor": this.vendor, "speed": this.speed, "maxSpeed": this.maxSpeed, "physicalCores": this.physicalCores, "virtualCores": this.virtualCores }
    }

}