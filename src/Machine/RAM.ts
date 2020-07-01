class RAM {
  public size;
  public clockSpeed;
  public manufacturer: string;
  public voltage;

  public constructor(size?, clockSpeed?, manufacturer?: string, voltage?) {
    this.size = size;
    this.clockSpeed = clockSpeed;
    this.manufacturer = manufacturer;
    this.voltage = voltage;
  }

  public fromArray(array): RAM {
    this.size = array.size;
    this.clockSpeed = array.clockSpeed;
    this.manufacturer = array.manufacturer;
    this.voltage = array.voltage;
    return this;
  }

  public asArray() {
    return {
      size: this.size,
      clockSpeed: this.clockSpeed,
      manufacturer: this.manufacturer,
      voltage: this.voltage,
    };
  }
}
