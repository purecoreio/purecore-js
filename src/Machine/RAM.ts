class RAM {
    public size: number;
    public clockSpeed: number;
    public manufacturer: string;
    public voltage: number;

    public constructor(size?: number, clockSpeed?: number, manufacturer?: string, voltage?: number) {
        this.size = size;
        this.clockSpeed = clockSpeed;
        this.manufacturer = manufacturer;
        this.voltage = voltage;
    }

    public getSize(): number {
        return this.size;
    }

    public getClockSpeed(): number {
        return this.clockSpeed;
    }

    public getManufacturer(): string {
        return this.manufacturer;
    }

    public getVoltage(): number {
        return this.voltage;
    }

    public asArray(): any {
        return {
            size: this.size,
            clockSpeed: this.clockSpeed,
            manufacturer: this.manufacturer,
            voltage: this.voltage,
        };
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): RAM {
        this.size = array.size;
        this.clockSpeed = array.clockSpeed;
        this.manufacturer = array.manufacturer;
        this.voltage = array.voltage;
        return this;
    }

    public static fromJSON(json: any): RAM {
        return new RAM(
            json.size,
            json.clockSpeed,
            json.manufacturer,
            json.voltage
        );
    }
}
