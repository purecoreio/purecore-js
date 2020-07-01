class Machine {
  public uuid: string;
  public hash: string;
  public owner: Owner;
  public ipv4: string;
  public ipv6: string;
  public port;
  public bios: BIOS;
  public motherboard: Motherboard;
  public cpu: CPU;
  public ram: Array<RAM>;
  public drives: Array<Drive>;
  public adapters: Array<NetworkAdapter>;

  public constructor(
    uuid?: string,
    hash?: string,
    owner?: Owner,
    ipv4?: string,
    ipv6?: string,
    port?,
    bios?: BIOS,
    motherboard?: Motherboard,
    cpu?: CPU,
    ram?: Array<RAM>,
    drives?: Array<Drive>,
    adapters?: Array<NetworkAdapter>
  ) {
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
      .commit({ ipv6: ip, hash: this.hash }, "machine/update/")
      .then(function () {
        return ip;
      });
  }

  public async setIPV4(ip: string): Promise<String> {
    return await new Call(new Core(null, this.owner.core.dev))
      .commit({ ipv4: ip, hash: this.hash }, "machine/update/")
      .then(function () {
        return ip;
      });
  }

  public fromArray(array): Machine {
    if (array.uuid != null && array.uuid != undefined) {
      this.uuid = array.uuid;
    }

    if (array.hash != null && array.hash != undefined) {
      this.hash = array.hash;
    }

    if (array.owner != null && array.owner != undefined) {
      this.owner = new Owner(
        new Core(),
        array.id,
        array.name,
        array.surname,
        array.email
      );
    }

    if (array.ipv4 != null && array.ipv4 != undefined) {
      this.ipv4 = array.ipv4;
    }

    if (array.ipv6 != null && array.ipv6 != undefined) {
      this.ipv6 = array.ipv6;
    }

    if (array.port != null && array.port != undefined) {
      this.port = array.port;
    }

    if (array.bios != null && array.bios != undefined) {
      this.bios = new BIOS().fromArray(array.bios);
    }

    if (array.motherboard != null && array.motherboard != undefined) {
      this.motherboard = new Motherboard().fromArray(array.motherboard);
    }

    if (array.cpu != null && array.cpu != undefined) {
      this.cpu = new CPU().fromArray(array.cpu);
    }

    this.ram = new Array<RAM>();
    array.ram.forEach((ramDim) => {
      this.ram.push(new RAM().fromArray(ramDim));
    });

    this.drives = new Array<Drive>();
    array.drives.forEach((drive) => {
      this.drives.push(new Drive().fromArray(drive));
    });

    this.adapters = new Array<NetworkAdapter>();
    array.adapters.forEach((adapter) => {
      this.adapters.push(new NetworkAdapter().fromArray(adapter));
    });

    return this;
  }

  public async updateComponents(
    si?,
    bios?: BIOS,
    motherboard?: Motherboard,
    cpu?: CPU,
    ram?: Array<RAM>,
    drives?: Array<Drive>,
    adapters?: Array<NetworkAdapter>
  ): Promise<Machine> {
    let mainObj = this;

    if (si != null) {
      bios = new BIOS(si.bios.vendor, si.bios.version);

      motherboard = new Motherboard(
        si.baseboard.manufacturer,
        si.baseboard.model
      );

      cpu = new CPU(
        si.cpu.manufacturer,
        si.cpu.brand,
        si.cpu.vendor,
        si.cpu.speed,
        si.cpu.speedmax,
        si.cpu.physicalCores,
        si.cpu.cores
      );

      ram = new Array<RAM>();
      si.memLayout.forEach((ramStick) => {
        ram.push(
          new RAM(ramStick.size, ramStick.clockSpeed, ramStick.manufacturer)
        );
      });

      drives = new Array<Drive>();
      si.diskLayout.forEach((disk) => {
        drives.push(
          new Drive(
            disk.size,
            disk.name,
            disk.type,
            disk.interfaceType,
            disk.serialNum
          )
        );
      });

      adapters = new Array<NetworkAdapter>();
      si.net.forEach((adapter) => {
        adapters.push(new NetworkAdapter(adapter.speed, adapter.ifaceName));
      });
    }

    var params = {};

    if (bios != null && bios != undefined) {
      this.bios = bios;
      params["bios"] = JSON.stringify(bios.asArray());
    }

    if (motherboard != null && motherboard != undefined) {
      this.motherboard = motherboard;
      params["motherboard"] = JSON.stringify(motherboard.asArray());
    }

    if (cpu != null && cpu != undefined) {
      this.cpu = cpu;
      params["cpu"] = JSON.stringify(cpu.asArray());
    }

    if (ram != null && ram != undefined) {
      this.ram = ram;

      var ramDims = [];
      ram.forEach((ramDim) => {
        ramDims.push(ramDim.asArray());
      });
      params["ram"] = JSON.stringify(ramDims);
    }

    if (drives != null && drives != undefined) {
      this.drives = drives;
      var drivesArray = [];
      drives.forEach((drive) => {
        drivesArray.push(drive.asArray());
      });
      params["drives"] = JSON.stringify(drivesArray);
    }

    if (adapters != null && adapters != undefined) {
      this.adapters = adapters;

      var adapterArray = [];
      adapters.forEach((adapter) => {
        adapterArray.push(adapter.asArray());
      });
      params["adapters"] = JSON.stringify(adapterArray);
    }

    params["hash"] = this.hash;

    return await new Call(new Core(null, this.owner.core.dev))
      .commit(params, "machine/update/")
      .then(function () {
        return mainObj;
      });
  }
}
