class ConnectionStatus {

    public openedOn;
    public closedOn;

    public constructor(openedOn?, closedOn?) {
        this.openedOn = openedOn;
        this.closedOn = closedOn;
    }

    public fromArray(array): ConnectionStatus {
        this.openedOn = array.openedOn;
        this.closedOn = array.closedOn;
        return this;
    }

}