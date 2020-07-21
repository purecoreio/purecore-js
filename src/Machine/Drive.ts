class Drive {
    public size: number;
    public name: string;
    public type: string; //TODO: enum
    public interfaceType: string;
    public serialNum: string;

    public constructor(size?: number, name?: string, type?: string, interfaceType?: string, serialNum?: string) {
        this.size = size;
        this.name = name;
        this.type = type;
        this.interfaceType = interfaceType;
        this.serialNum = serialNum;
    }

    public getSize(): number {
        return this.size;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public getInterfaceType(): string {
        return this.interfaceType;
    }

    public getSerialNumber(): string {
        return this.serialNum;
    }

    public asArray(): any {
        return {
            size: this.size,
            name: this.name,
            type: this.type,
            interfaceType: this.interfaceType,
            serialNum: this.serialNum,
        };
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): Drive {
        this.size = array.size;
        this.name = array.name;
        this.type = array.type;
        this.interfaceType = array.interfaceType;
        this.serialNum = array.serialNum;
        return this;
    }

    public static fromJSON(json: any) {
        return new Drive(
            json.size,
            json.name,
            json.type,
            json.interfaceType,
            json.serialNum
        );
    }
}
