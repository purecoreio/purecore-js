class AnalyticField {
  public value;
  public name;
  public technicalName;

  public constructor(value, name: string, technicalName: string) {
    this.value = value;
    this.name = name;
    this.technicalName = technicalName;
  }

  public getTechnicalName() {
    return this.technicalName;
  }

  public getName() {
    return this.name;
  }

  public getValue() {
    return this.value;
  }
}
