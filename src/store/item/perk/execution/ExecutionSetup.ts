class ExecutionSetup {

    public uponPayment: Array<ExecutionTemplate>;
    public uponRefund: Array<ExecutionTemplate>;
    public uponDispute: Array<ExecutionTemplate>;

    public static fromObject(object: any): ExecutionSetup {
        let setup = new ExecutionSetup();
        setup.uponPayment = new Array<ExecutionTemplate>();
        setup.uponRefund = new Array<ExecutionTemplate>();
        setup.uponDispute = new Array<ExecutionTemplate>();
        if (object != null) {
            for (let i = 0; i < object.uponPayment.length; i++) {
                const element = object.uponPayment[i];
                setup.uponPayment.push(ExecutionTemplate.fromObject(element));
            }
            for (let i = 0; i < object.uponRefund.length; i++) {
                const element = object.uponRefund[i];
                setup.uponRefund.push(ExecutionTemplate.fromObject(element));
            }
            for (let i = 0; i < object.uponDispute.length; i++) {
                const element = object.uponDispute[i];
                setup.uponDispute.push(ExecutionTemplate.fromObject(element));
            }
        }
        return setup;
    }

}