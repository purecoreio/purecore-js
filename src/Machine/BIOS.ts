class BIOS {
  public vendor: string;
  public version: string;

  constructor(vendor?: string, version?: string) {
    this.vendor = vendor;
    this.version = version;
  }

  fromObject(array): BIOS {
    this.vendor = array.vendor;
    this.version = array.version;
    return this;
  }

  asArray() {
    return { vendor: this.vendor, version: this.version };
  }
}
