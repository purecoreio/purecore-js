class Drive {

    public size;
    public uuid: string;
    public model: string;
    public serial: string;
    public mount: string;

    public constructor(size?, uuid?: string, model?: string, serial?: string, mount?: string) {
        this.size = size;
        this.uuid = uuid;
        this.model = model;
        this.serial = serial;
        this.mount = mount;
    }

    public fromArray(array): Drive {
        this.size = array.size;
        this.uuid = array.uuid;
        this.model = array.model;
        this.serial = array.serial;
        this.mount = array.mount;
        return this;
    }

    public asArray() {
        return { "size": this.size, "uuid": this.uuid, "model": this.model, "serial": this.serial, "mount": this.mount }
    }

}