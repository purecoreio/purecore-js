class NetworkAdapter {
  public speed;
  public name;

  public constructor(speed?: string, name?: string) {
    this.speed = speed;
    this.name = name;
  }

  public fromObject(array): NetworkAdapter {
    this.speed = array.speed;
    this.name = array.name;
    return this;
  }

  public asArray() {
    return { speed: this.speed, name: this.name };
  }
}
