class Analytic {
  public timestamp;
  public original;
  public fields: Array<AnalyticField>;

  public constructor(timestamp, original, fields: Array<AnalyticField>) {
    this.timestamp = timestamp;
    this.original = original;
    this.fields = fields;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getOriginal() {
    return this.original;
  }

  public getFields(onlyrelative = false): Array<AnalyticField> {
    var final = new Array<AnalyticField>();
    if (onlyrelative) {
      this.fields.forEach((element) => {
        if (element.getName().includes("%")) {
          final.push(element);
        }
      });
    } else {
      this.fields.forEach((element) => {
        if (!element.getName().includes("%")) {
          final.push(element);
        }
      });
    }
    return final;
  }

  public setFields(fields: Array<AnalyticField>) {
    this.fields = fields;
  }
}
