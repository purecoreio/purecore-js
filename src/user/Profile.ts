class Profile {

    public readonly service: string;
    public readonly id: string;
    public readonly name: string | undefined;
    public readonly email: string | undefined;

    constructor(service: string, id: string, name?: string, email?: string) {
        this.service = service;
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static fromObject(object: any): Profile {
        return new Profile(object.service, object.id, object.name, object.email)
    }

}