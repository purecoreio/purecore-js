class Player extends Core {

    core: Core;
    id: string;
    username: string;
    uuid: string;
    verified;

    constructor(core: Core, id: string, username: string, uuid: string, verified) {
        super(core.getKey())
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }

    getId(){
        return this.id;
    }

    getUuid(){
        return this.uuid;
    }

    getUsername(){
        return this.username;
    }

}