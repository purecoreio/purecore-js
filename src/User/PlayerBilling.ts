/// <reference path="Player.ts"/>
class PlayerBilling extends Player {

    public constructor(id?: string, creation?: Date, username?: string, lastLogin?: Date, lastUpdated?: Date, bio?: string, birthdate?: Date) {
        super(id, creation, username, lastLogin, lastUpdated, bio, birthdate);
    }

    public async getPaymentMethods(): Promise<Array<Method>> {
        return await new Call()
            .commit('player/billing/method/list/').then((res) => {
                let methods = new Array<Method>();
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    methods.push(Method.fromObject(element));
                }
                return methods;
            })
    }

    public async addPaymentMethod(method: string | Method, defaultMethod: boolean = false): Promise<Method> {
        let id = null;
        if (typeof method == 'string') {
            id = method;
        } else {
            id = method.getId();
        }
        let endpoint = "player/billing/method/add/";
        if (defaultMethod) {
            endpoint = "player/billing/method/add/default/"
        }
        return await new Call()
            .addParam(Param.PaymentMethod, id)
            .commit(endpoint).then((res) => {
                return Method.fromObject(res);
            })
    }

    public async detachPaymentMethod(method: string | Method): Promise<void> {
        let id = null;
        if (typeof method == 'string') {
            id = method;
        } else {
            id = method.getId();
        }
        return await new Call()
            .addParam(Param.PaymentMethod, id)
            .commit("player/billing/method/detach/").then(() => {
                return;
            })
    }

    public async getBillingAddress(): Promise<Address> {
        return await new Call()
            .commit('player/billing/address/get/').then((res) => {
                return Address.fromObject(res);
            })
    }

    public async setBillingAddress(address: any): Promise<Address> {
        if (!(address instanceof Address)) {
            address = Address.fromObject(address);
        }
        return await new Call()
            .addParam(Param.Address, address.asQuery())
            .commit('player/billing/address/set/').then((res) => {
                return Address.fromObject(res);
            })
    }

}