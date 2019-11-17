class Core {

    key: string;

    constructor(key: string){
        this.key = key;
    }

    getKey(){
        return this.key;
    }

    getElements(){
        return new Elements(this);
    }

}