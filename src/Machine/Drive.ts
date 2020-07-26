class Drive {
  public size;
  public name: string;
  public type: string;
  public interfaceType: string;
  public serialNum: string;

  public constructor(
    size?,
    name?: string,
    type?: string,
    interfaceType?: string,
    serialNum?: string
  ) {
    this.size = size;
    this.name = name;
    this.type = type;
    this.interfaceType = interfaceType;
    this.serialNum = serialNum;
  }

  public fromObject(array): Drive {
    this.size = array.size;
    this.name = array.name;
    this.type = array.type;
    this.interfaceType = array.interfaceType;
    this.serialNum = array.serialNum;
    return this;
  }

  public asArray() {
    return {
      size: this.size,
      name: this.name,
      type: this.type,
      interfaceType: this.interfaceType,
      serialNum: this.serialNum,
    };
  }
}
