class Core {

    public static dev: boolean;
    public static context: Context;
    private static keychain: Keychain;

    public constructor(method?: any, dev?: boolean) {

        // context
        if (Core.context == null) {
            Core.context = new Context();
        }

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
            let methodFinal = Keychain.getMethod(method);
            Core.keychain.addMethod(methodFinal);
        }
    }

    /**
     * @description pass a callback to call when logging in
     */
    public getLoginManager(): LoginHelper {
        return new LoginHelper();
    }

    /**
     * @description gets the current context. useful when making network-related calls with a session object
     */
    public getContext(): Context {
        return Core.context;
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
    public async getInstance(id: string): Promise<Instance> {
        return await new Call()
            .addParam(Param.Instance, id)
            .commit('instance/get/').then((res) => {
                return Instance.fromObject(res);
            })
    }

    public getOfflineInstance(id: string): Instance {
        return new Instance(id, null, null);
    }

    /**
     * @description gets a network instance from the api
     */
    public async getNetwork(id: string): Promise<Network> {
        return await new Call()
            .addParam(Param.Network, id)
            .commit('network/get/').then((res) => {
                return Network.fromObject(res);
            })
    }

    public async getProfiles(network: Network | string = null): Promise<Array<PlatformProfile>> {
        let call = new Call();
        if (network != null) {
            if (typeof network == 'string') {
                call.addParam(Param.Network, network);
            } else {
                call.addParam(Param.Network, network.getId());
            }
        }
        return await call
            .commit('network/list/profile/hash/').then((res) => {
                let result = new Array<PlatformProfile>();
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    result.push(PlatformProfile.fromObject(element));
                }
                return result;
            })
    }

    public static getCopy(): Core {
        return new Core()
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
        try {
            Core.context.updateSubscriptionStatus();
        } catch (error) {
            // ignore
        }
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