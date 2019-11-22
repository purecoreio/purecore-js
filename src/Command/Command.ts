class Command {

    public uuid: String;
    public cmd: String;
    public network: Network;

    constructor(uuid: String, cmd: String, network: Network) {
        this.uuid = uuid;
        this.cmd = cmd;
        this.network = network;
    }
}