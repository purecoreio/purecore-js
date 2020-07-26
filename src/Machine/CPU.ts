class CPU {
  public manufacturer: string;
  public brand: string;
  public vendor: string;
  public speed: string;
  public maxSpeed: string;
  public physicalCores: string;
  public virtualCores: string;

  constructor(
    manufacturer?: string,
    brand?: string,
    vendor?: string,
    speed?,
    maxSpeed?,
    physicalCores?,
    virtualCores?
  ) {
    this.manufacturer = manufacturer;
    this.brand = brand;
    this.vendor = vendor;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
    this.physicalCores = physicalCores;
    this.virtualCores = virtualCores;
  }

  public fromObject(array): CPU {
    this.manufacturer = array.manufacturer;
    this.brand = array.brand;
    this.vendor = array.vendor;
    this.speed = array.speed;
    this.maxSpeed = array.maxSpeed;
    this.physicalCores = array.physicalCores;
    this.virtualCores = array.virtualCores;
    return this;
  }

  public asArray() {
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
}
