class CPU {
    public manufacturer: string;
    public brand: string;
    public vendor: string;
    public speed: number; //TODO: check if number type is correct
    public maxSpeed: number;
    public physicalCores: number;
    public virtualCores: number;

    public constructor(manufacturer?: string, brand?: string, vendor?: string, speed?: number, maxSpeed?: number, physicalCores?: number, virtualCores?: number) {
        this.manufacturer = manufacturer;
        this.brand = brand;
        this.vendor = vendor;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.physicalCores = physicalCores;
        this.virtualCores = virtualCores;
    }

    public getManufacturer(): string {
        return this.manufacturer;
    }

    public getBrand(): string {
        return this.brand;
    }

    public getVendor(): string {
        return this.vendor;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getMaxSpeed(): number {
        return this.maxSpeed;
    }

    public getPhysicalCores(): number {
        return this.physicalCores;
    }

    public getVirtualCores(): number {
        return this.virtualCores;
    }

    public asArray(): any {
        return {
            manufacturer: this.manufacturer,
            brand: this.brand,
            vendor: this.vendor,
            speed: this.speed,
            maxSpeed: this.maxSpeed,
            physicalCores: this.physicalCores,
            virtualCores: this.virtualCores,
        };
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): CPU {
        this.manufacturer = array.manufacturer;
        this.brand = array.brand;
        this.vendor = array.vendor;
        this.speed = array.speed;
        this.maxSpeed = array.maxSpeed;
        this.physicalCores = array.physicalCores;
        this.virtualCores = array.virtualCores;
        return this;
    }

    public static fromJSON(json: any): CPU {
        return new CPU(
            json.manufacturer,
            json.brand,
            json.vendor,
            json.speed,
            json.maxSpeed,
            json.physicalCores,
            json.virtualCores
        );
    }
}
