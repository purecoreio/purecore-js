class CPUUsage {
    public clockSpeed: number;
    public relativeUsage: number;
    public mainThreadSlip: number; //TODO: check if number type is correct

    public constructor(clockSpeed: number, relativeUsage: number, mainThreadSlip: number) {
        this.clockSpeed = clockSpeed;
        this.relativeUsage = relativeUsage;
        this.mainThreadSlip = mainThreadSlip;
    }

    public getClockSpeed(): number {
        return this.clockSpeed;
    }

    public getRelativeUsage(): number {
        return this.relativeUsage;
    }

    public getMainThreadSlip(): number {
        return this.mainThreadSlip;
    }
}
