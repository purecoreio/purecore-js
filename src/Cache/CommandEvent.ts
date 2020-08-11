class CommandEvent {

    public socketId;
    public commands: Array<Execution>;

    public constructor(socketId, commands: Array<Execution>) {
        this.socketId = socketId;
        this.commands = commands;
    }

}