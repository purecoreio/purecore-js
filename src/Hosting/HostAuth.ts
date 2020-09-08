class HostAuth extends Core {

    public core: Core;
    public hash: string;
    public host: Host;

    public constructor(core: Core, hash?: string, host?: Host) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.hash = hash;
        this.host = host;
    }

    public fromObject(object: any): HostAuth {
        this.hash = object.hash;
        this.host = new Host(this.core).fromObject(object.host);
        return this;
    }

}