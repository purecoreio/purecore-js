class SessionDevice {
  brand: string;
  device: string;
  model: string;
  os: string;

  constructor(brand?: string, device?: string, model?: string, os?: string) {
    this.brand = brand;
    this.device = device;
    this.model = model;
    this.os = os;
  }
}
