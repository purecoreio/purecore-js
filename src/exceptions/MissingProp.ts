class MissingProp extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingProp";
    }
}