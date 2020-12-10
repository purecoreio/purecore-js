class Core {

    public static dev: boolean;
    private static keychain: Keychain;

    public constructor(method?: any, dev?: boolean) {

        // dev mode
        if (dev == null || dev == false) {
            let loc = location;
            if (loc) {
                // automatically set dev mode if running on localhost
                Core.dev = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
            } else {
                Core.dev = false;
            }
        } else {
            Core.dev = dev;
        }

        // checks if the ID instance has not been started
        if (Core.keychain == null) {
            Core.keychain = new Keychain();
        }

        // adds the authentication method to the ID manager if it is a valid authentication method
        if (method != null) {
            Core.keychain.addMethod(Keychain.getMethod(method));
        }
    }

    /**
     * @description pass a callback to call when logging in
     */
    public getLoginManager(): LoginHelper {
        return new LoginHelper();
    }

    /**
     * @description gets the current keychain instance
     */
    public static getKeychain(): Keychain {
        return Core.keychain;
    }

    /**
     * @description gets a generic instance from the api
     */
    public static async getInstance(id: string): Promise<Instance> {
        return await new Call()
            .addParam(Param.Instance, id)
            .commit('instance/get/').then((res) => {
                return Instance.fromObject(res);
            })
    }

    /**
     * @description gets a network instance from the api
     */
    public static async getNetwork(id: string): Promise<Network> {
        return await new Call()
            .addParam(Param.Instance, id)
            .commit('network/get/').then((res) => {
                return Network.fromObject(res);
            })
    }

    /**
     * @description gets the highest priority authentication method
     */
    static getAuth(): AuthMethod {
        let m = null;
        let mths = Core.keychain.getMethods();
        for (let i = 0; i < mths.length; i++) {
            const element = mths[i];
            if (m == null) {
                m = element;
            } else {
                if (element instanceof CoreSession && m instanceof Key) {
                    m = element;
                    break;
                }
            }
        }
        return m;
    }

    public static addAuth(method: AuthMethod): void {
        Core.keychain.addMethod(method);
        return;
    }

    /**
     * @description returns null if there is no assigned player to the global core instance
     */
    public getPlayer(): Player | null {
        let ses = Core.keychain.getSession();
        if (ses != null) {
            return Core.keychain.getSession().getPlayer();
        } else {
            return null;
        }
    }

}

try {
    module.exports = Core;
} catch (error) {

}