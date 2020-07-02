class Warning {
    public cause: string;
    public text: string;

    public constructor(cause: string, text: string) {
        this.cause = cause;
        this.text = text;
    }

    public getCause(): string {
        return this.cause;
    }

    public getText(): string {
        return this.text;
    }

    public static fromJSON(json: any): Warning {
        return new Warning(
            json.cause,
            json.text
        );
    }
}
