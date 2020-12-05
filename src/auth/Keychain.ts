class Keychain {

    private authMethods: Array<AuthMethod>;

    /**
     * @description tells the difference from different authentication methods based on the object structure
     */

    public addMethod(object: AuthMethod): void {
        this.authMethods.push(object);
    }

    public getSession(): CoreSession | null {
        for (let i = 0; i < this.authMethods.length; i++) {
            const element = this.authMethods[i];
            if (element instanceof CoreSession) {
                return element;
            }
        }
        return null;
    }

    getMethods(): Array<AuthMethod> {
        return this.authMethods;
    }

    public static getMethod(object: any): AuthMethod {
        if (typeof object == 'string') {
            return new Key(object);
        } else if (typeof object == 'object') {
            // can be class, host code, payment hash
            // TODO: Implement host code, payment hash
            return CoreSession.fromObject(object);
        }
    }


}