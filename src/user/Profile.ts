type service = 'minecraft' | 'steam' | 'discord' | 'google' | 'github' | 'microsoft' | 'xbox'

export default class Profile {

    public readonly id: string;
    public readonly service: service;
    public readonly externalId: string;
    public readonly externalUsername: string | null;
    public readonly externalEmail: string | null;
    public readonly pfp: string | null;

    constructor(service: service, id: string, externalId: string, externalName?: string, externalEmail?: string, pfp?: string) {
        this.service = service;
        this.id = id;
        this.externalId = externalId;
        this.externalUsername = externalName;
        this.externalEmail = externalEmail;
        this.pfp = pfp;
    }

    public static fromObject(object: any): Profile {
        return new Profile(object.service, object.id, object.externalId, object.externalUsername, object.externalEmail, object.pfp)
    }

}