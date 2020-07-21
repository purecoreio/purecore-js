class DriveUsage {
    public max: number;
    public used: number;

    public constructor(max: number, used: number) {
        this.max = max;
        this.used = used;
    }

    public getMax(): number {
        return this.max;
    }

    public getUsed(): number {
        return this.used;
    }
}
