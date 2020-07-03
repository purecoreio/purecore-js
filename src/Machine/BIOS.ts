class BIOS {
    public vendor: string;
    public version: string;

    public constructor(vendor?: string, version?: string) {
        this.vendor = vendor;
        this.version = version;
    }

    public asArray(): any {
        return {
            vendor: this.vendor,
            version: this.version
        };
    }

    public getVendor(): string {
        return this.vendor;
    }

    public getVersion(): string {
        return this.version;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): BIOS {
        this.vendor = array.vendor;
        this.version = array.version;
        return this;
    }

    public static fromJSON(json: any): BIOS {
        return new BIOS(
            json.vendor,
            json.version
        );
    }
}
