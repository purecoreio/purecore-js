class ConsoleLine {
    public date: Date;
    public type: LineType;
    public message: string;

    public constructor(date: Date, type: LineType, message: string) {
        this.date = date;
        this.type = type;
        this.message = message;
    }

    public getDate(): Date {
        return this.date;
    }

    public getType(): LineType {
        return this.type;
    }

    public getMessage(): string {
        return this.message;
    }
}
