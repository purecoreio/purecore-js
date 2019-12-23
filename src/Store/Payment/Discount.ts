class Discount{

    public type: string;
    public uuid: string;
    public description: string;
    public amount;

    constructor(type: string, uuid: string, description: string, amount){
        this.type=type;
        this.uuid=uuid;
        this.description=description;
        this.amount=amount;
    }

}