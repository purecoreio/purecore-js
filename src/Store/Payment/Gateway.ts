class Gateway {
    public readonly name: string;
    public readonly url: string;
    public readonly color: string;
    public readonly logo: string;

    public constructor(name: string, url: string, color: string, logo: string) {
        this.name = name;
        this.url = url;
        this.color = color;
        this.logo = logo;
    }

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }

    public getColor(): string {
        return this.color;
    }

    public getLogo(): string {
        return this.logo;
    }

    public static fromJSON(json: any): Gateway {
        return new Gateway(
            json.name,
            json.url,
            json.color,
            json.logo
        );
    }
}
