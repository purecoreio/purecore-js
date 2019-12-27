class Motherboard {

    public manufacturer: string;
    public model: string;

    public constructor(manufacturer?: string, model?: string) {
        this.manufacturer = manufacturer;
        this.model = model;
    }

    public fromArray(array): Motherboard {
        this.manufacturer = array.manufacturer;
        this.model = array.model;
        return this;
    }

    public asArray() {
        return { "manufacturer": this.manufacturer, "model": this.model }
    }

}