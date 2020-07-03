class Motherboard {
    public manufacturer: string;
    public model: string;

    public constructor(manufacturer?: string, model?: string) {
        this.manufacturer = manufacturer;
        this.model = model;
    }

    public getManufacturer(): string {
        return this.manufacturer;
    }

    public getModel(): string {
        return this.model;
    }

    public asArray(): any {
        return {
            manufacturer: this.manufacturer,
            model: this.model
        };
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): Motherboard {
        this.manufacturer = array.manufacturer;
        this.model = array.model;
        return this;
    }

    public static fromJSON(json: any): Motherboard {
        return new Motherboard(
            json.manufacturer,
            json.model
        );
    }
}
