class NetworkAdapter {

    public speed;
    public name;

    public constructor(speed?: string, name?: string) {
        this.speed = speed;
        this.name = name;
    }

    public fromArray(array): NetworkAdapter {
        this.speed = array.speed;
        this.name = array.speed;
        return this;
    }

    public asArray() {
        return { "speed": this.speed, "name": this.name }
    }

}