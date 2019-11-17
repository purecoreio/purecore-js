class StoreCategory {

    uuid: string;
    name: string;
    description: string;
    network:Network;
    upgradable:boolean;

    constructor(uuid:string,name:string,description:string,network:Network,upgradable:boolean){
        this.uuid=uuid;
        this.name=name;
        this.description=description;
        this.network=network;
        this.upgradable=upgradable;
    }

}

module.exports.StoreCategory