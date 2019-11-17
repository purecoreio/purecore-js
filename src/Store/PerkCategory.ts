class PerkCategory {

    uuid: string;
    name: string;
    network: Network;

    constructor(uuid:string,name:string,network:Network){
        this.uuid=uuid;
        this.name=name;
        this.network=network;
    }

}