interface Analytic {

    getCreation(): Date;
    getBase(): string;
    asObject(): any;
    empty(creation: Date): Analytic;

}