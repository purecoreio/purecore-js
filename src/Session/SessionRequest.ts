class SessionRequest extends Core {

    uuid: string;
    token: string;
    validated: boolean;
    player: Player;
    network: Network;
    type: string;

    constructor(core:Core,uuid:string,token:string,validated:boolean,player:Player,network:Network,type:string){
        super(core.getKey());
        this.uuid=uuid;
        this.token=token;
        this.validated=validated;
        this.player=player;
        this.network=network;
        this.type=type;
    }

}