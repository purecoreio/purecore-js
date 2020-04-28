class CPUUsage {

    clockSpeed;
    relativeUsage;
    mainThreadSlip;

    public constructor(clockSpeed, relativeUsage, mainThreadSlip) {
        this.clockSpeed = clockSpeed;
        this.relativeUsage = relativeUsage;
        this.mainThreadSlip = mainThreadSlip;
    }

}