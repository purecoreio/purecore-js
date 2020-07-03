class NetworkAdapter {
    public speed: string; //TODO: check if type string is correct
    public name: string;

    public constructor(speed?: string, name?: string) {
        this.speed = speed;
        this.name = name;
    }

    public getSpeed(): string {
        return this.speed;
    }

    public getName(): string {
        return this.name;
    }

    public asArray(): any {
        return {
            speed: this.speed,
            name: this.name
        };
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): NetworkAdapter {
        this.speed = array.speed;
        this.name = array.name;
        return this;
    }

    public static fromJSON(json: any): NetworkAdapter {
        return new NetworkAdapter(
            json.speed,
            json.name
        );
    }
}
