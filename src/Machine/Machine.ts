class Machine {
    public uuid: string;
    public hash: string;
    public owner: Owner;
    public ipv4: string;
    public ipv6: string;
    public port: number;
    public bios: BIOS;
    public motherboard: Motherboard;
    public cpu: CPU;
    public ram: Array<RAM>;
    public drives: Array<Drive>;
    public adapters: Array<NetworkAdapter>;

    public constructor(uuid?: string, hash?: string, owner?: Owner, ipv4?: string, ipv6?: string, port?: number, bios?: BIOS, motherboard?: Motherboard, cpu?: CPU, ram?: Array<RAM>, drives?: Array<Drive>, adapters?: Array<NetworkAdapter>) {
        this.uuid = uuid;
        this.hash = hash;
        this.owner = owner;
        this.ipv4 = ipv4;
        this.ipv6 = ipv6;
        this.port = port;
        this.bios = bios;
        this.motherboard = motherboard;
        this.cpu = cpu;
        this.ram = ram;
        this.drives = drives;
        this.adapters = adapters;
    }

    public async setIPV6(ip: string): Promise<String> {
        return await new Call(new Core(null, this.owner.core.dev))
            .commit({ipv6: ip, hash: this.hash}, "machine/update/")
            .then(() => ip);
    }

    public async setIPV4(ip: string): Promise<String> {
        return await new Call(new Core(null, this.owner.core.dev))
            .commit({ipv4: ip, hash: this.hash}, "machine/update/")
            .then(() => ip);
    }

    //TODO: si better name and type
    public async updateComponents(si?: any, bios?: BIOS, motherboard?: Motherboard, cpu?: CPU, ram?: Array<RAM>, drives?: Array<Drive>, adapters?: Array<NetworkAdapter>): Promise<Machine> {
        if (si != null) {
            bios = BIOS.fromJSON(si.bios);
            motherboard = Motherboard.fromJSON(si.baseboard);
            cpu = CPU.fromJSON(si.cpu);
            ram = si.memLayout.map(RAM.fromJSON);
            drives = si.diskLayout.map(Drive.fromJSON);
            adapters = si.net.map(NetworkAdapter.fromJSON);
        }

        let params: any = {};

        if (bios != null) {
            this.bios = bios;
            params["bios"] = JSON.stringify(bios.asArray());
        }

        if (motherboard != null) {
            this.motherboard = motherboard;
            params["motherboard"] = JSON.stringify(motherboard.asArray());
        }

        if (cpu != null) {
            this.cpu = cpu;
            params["cpu"] = JSON.stringify(cpu.asArray());
        }

        if (ram != null) {
            this.ram = ram;
            params["ram"] = JSON.stringify(ram.map(stick => stick.asArray()));
        }

        if (drives != null) {
            this.drives = drives;
            params["drives"] = JSON.stringify(drives.map(drives => drives.asArray()));
        }

        if (adapters != null) {
            this.adapters = adapters;
            params["adapters"] = JSON.stringify(adapters.map(adapter => adapter.asArray()));
        }

        params["hash"] = this.hash;

        return await new Call(new Core(null, this.owner.core.dev))
            .commit(params, "machine/update/")
            .then(() => this);
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): Machine {
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.owner = Owner.fromJSON(new Core(), array); //TODO: new Core()?
        this.ipv4 = array.ipv4;
        this.ipv6 = array.ipv6;
        this.port = array.port;
        this.bios = BIOS.fromJSON(array.bios);
        this.motherboard = Motherboard.fromJSON(array.motherboard);
        this.cpu = CPU.fromJSON(array.cpu);
        this.ram = array.ram.map(RAM.fromJSON);
        this.drives = array.drives.map(Drive.fromJSON);
        this.adapters = array.adapters.map(NetworkAdapter.fromJSON);
        return this;
    }

    public static fromJSON(json: any): Machine {
        return new Machine(
            json.uuid,
            json.hash,
            Owner.fromJSON(new Core(), json),
            json.ipv4,
            json.ipv6,
            json.port,
            BIOS.fromJSON(json.bios),
            Motherboard.fromJSON(json.motherboard),
            CPU.fromJSON(json.cpu),
            json.ram.map(RAM.fromJSON),
            json.drives.map(Drive.fromJSON),
            json.adapters.map(NetworkAdapter.fromJSON)
        );
    }
}
