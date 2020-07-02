class BIOS {
    public vendor: string;
    public version: string;

    public constructor(vendor?: string, version?: string) {
        this.vendor = vendor;
        this.version = version;
    }

    public fromArray(array): BIOS {
        this.vendor = array.vendor;
        this.version = array.version;
        return this;
    }

   public asArray() {
        return {vendor: this.vendor, version: this.version};
    }
}
