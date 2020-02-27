class PlanFeature {

    technicalName: string;
    value;
    displayValue;
    name: string;

    constructor(technicalName?: string, value?, displayValue?, name?: string) {
        this.technicalName = technicalName;
        this.value = value;
        this.displayValue = displayValue;
        this.name = name;
    }

    public fromArray(array): PlanFeature {
        this.technicalName = array.technical_name;
        this.value = array.value;
        this.displayValue = array.displayValue;
        this.name = array.name;
        return this;
    }

}