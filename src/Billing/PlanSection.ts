class PlanSection {

    name: string;
    features: Array<PlanFeature>;

    constructor(name?: string, features?: Array<PlanFeature>) {
        this.name = name;
        this.features = features;
    }

    public fromArray(array): PlanSection {
        this.name = array.name;
        this.features = new Array<PlanFeature>();
        array.features.forEach(planFeatureJSON => {
            var planFeature = new PlanFeature().fromArray(planFeatureJSON);
            this.features.push(planFeature);
        });
        return this;
    }

}