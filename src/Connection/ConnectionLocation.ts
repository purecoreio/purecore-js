class ConnectionLocation {
  public city;
  public region;
  public country;
  public lat;
  public long;

  public constructor(city?, region?, country?, lat?, long?) {
    this.city = city;
    this.region = region;
    this.country = country;
    this.lat = lat;
    this.long = long;
  }

  public fromArray(array): ConnectionLocation {
    this.city = array.city;
    this.region = array.region;
    this.country = array.country;
    this.lat = array.lat;
    this.long = array.long;
    return this;
  }
}
