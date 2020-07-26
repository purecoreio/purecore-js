class PayPalSubscription {
  public url;
  public id;

  public constructor(url: string, id: string) {
    this.url = url;
    this.id = id;
  }

  public getURL() {
    return this.url;
  }

  public getID() {
    return this.id;
  }
}
