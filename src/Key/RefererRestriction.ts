class RefererRestriction {
  public index: string;
  public domain: string;
  public ip: string;

  public constructor(index?: string, domain?: string, ip?: string) {
    this.index = index;
    this.domain = domain;
    this.ip = ip;
  }

  public fromArray(array): RefererRestriction {
    this.index = array.index;
    this.domain = array.domain;
    this.ip = array.ip;
    return this;
  }

  public getIndex(): string {
    return this.index;
  }

  public getDomain(): string {
    return this.domain;
  }

  public getIP(): string {
    return this.ip;
  }
}
