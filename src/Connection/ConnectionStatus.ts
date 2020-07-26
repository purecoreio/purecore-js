class ConnectionStatus {
  public openedOn: Date;
  public closedOn: Date;

  public constructor(openedOn?: Date, closedOn?: Date) {
    this.openedOn = openedOn;
    this.closedOn = closedOn;
  }

  public fromObject(array): ConnectionStatus {
    this.openedOn = new Date(array.openedOn * 1000);
    this.closedOn = new Date(array.closedOn * 1000);
    return this;
  }

  public getOpenedOn(): Date {
    return this.openedOn;
  }

  public isActive(): boolean {
    if (this.closedOn == undefined || this.closedOn == null) {
      return true;
    } else {
      return false;
    }
  }

  public isClosed(): boolean {
    return !this.isActive();
  }

  public getClosedOn(): Date {
    return this.closedOn;
  }
}
