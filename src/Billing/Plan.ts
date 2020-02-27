class Plan {

    uuid: string;
    name: string;
    price;
    features: Array<PlanSection>;

    constructor(uuid?: string, name?: string, price?, features?: Array<PlanSection>) {
        this.uuid = uuid;
        this.name = name;
        this.price = price;
        this.features = features;
    }

    public fromArray(array): Plan {
        this.uuid = array.uuid;
        this.name = array.name;
        this.price = array.price;
        this.features = new Array<PlanSection>();
        array.features.forEach(planSectionJSON => {
            var planSection = new PlanSection().fromArray(planSectionJSON);
            this.features.push(planSection);
        });
        return this;
    }

}