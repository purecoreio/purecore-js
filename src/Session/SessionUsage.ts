class SessionUsage {
    public creation: string;
    public uses: string;

    public constructor(creation?: string, uses?: string) {
        this.creation = creation;
        this.uses = uses;
    }

    public getCreation(): string {
        return this.creation;
    }

    public getUses(): string {
        return this.uses;
    }

    public static fromJSON(json: any): SessionUsage {
        return new SessionUsage(
            json.creation,
            json.uses
        );
    }
}
