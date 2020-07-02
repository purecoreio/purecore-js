class Discount {
    public type: string; //TODO: enum
    public id: string;
    public description: string;
    public amount: number;

    public constructor(type: string, id: string, description: string, amount: number) {
        this.type = type;
        this.id = id;
        this.description = description;
        this.amount = amount;
    }

    public getType(): string {
        return this.type;
    }

    public getId(): string {
        return this.id;
    }

    public getDescription(): string {
        return this.description;
    }

    public getAmount(): number {
        return this.amount;
    }

    public static fromJSON(json: any): Discount {
        return new Discount(
            json.type,
            json.id,
            json.description,
            json.amount
        );
    }
}
