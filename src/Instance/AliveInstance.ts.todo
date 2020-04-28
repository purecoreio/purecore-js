class AliveInstance extends Instance {

    instance: Instance;
    machine: Machine;
    instanceConsole: InstanceConsole;
    connections: Array<Connection>;
    vitals: Array<InstanceVital>;

    public constructor(instance: Instance, machine?: Machine, instanceConsole?: InstanceConsole, connections?: Array<Connection>, vitals?: Array<InstanceVital>) {
        super(instance.core, instance.uuid, instance.name, instance.type);
        this.instance = instance;
        this.machine = machine;
        this.instanceConsole = instanceConsole;
        this.connections = connections;
        this.vitals = vitals;
    }

    public getMachineIO(): Machine {
        return this.machine;
    }

    public pushVital(vital: InstanceVital): Array<InstanceVital> {
        this.vitals.push(vital);
        return this.vitals;
    }

    public getVitals(): Array<InstanceVital> {
        return this.vitals;
    }

    public getConsole() {
        return this.instanceConsole;
    }

    public getConnections(): Array<Connection> {
        return this.connections;
    }

    public createConnection(ip: string, serviceid: string, serviceusername: string, service: Service = Service.MINECRAFT) {

    }

    public closeConnections(player: Player) {

    }

    public closeAllConnections() {

    }

}