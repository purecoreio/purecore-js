class ConsoleLine {

    date: Date;
    type: LineType;
    message: string;

    public constructor(date: Date, type: LineType, message: string) {
        this.date = date;
        this.type = type;
        this.message = message;
    }

}