type service = 'minecraft' | 'steam' | 'discord' | 'google' | 'github' | 'microsoft'

class Profile {

    public readonly id: string;
    public readonly service: service;
    public readonly externalId: string;
    public readonly externalName: string | undefined;
    public readonly externalEmail: string | undefined;

    constructor(service: service, id: string, externalId: string, externalName?: string, externalEmail?: string) {
        this.service = service;
        this.id = id;
        this.externalId = externalId;
        this.externalId = externalId;
        this.externalName = externalName;
        this.externalEmail = externalEmail;
    }

    public static fromObject(object: any): Profile {
        return new Profile(object.service, object.id, object.externalId, object.externalName, object.externalEmail)
    }

}