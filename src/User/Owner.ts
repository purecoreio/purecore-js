class Owner extends Core {

    core: Core;
    id: string;
    name: string;
    surname: string;
    email: string;

    constructor(core: Core, id: string, name: string, surname: string, email: string) {
        super(core.getKey())
        this.core = core;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    getId(){
        return this.id;
    }

}