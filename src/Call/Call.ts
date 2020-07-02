class Call extends Core {
    private readonly baseURL: string;
    private readonly core: Core;

    public constructor(core: Core) {
        super(core.getTool(), core.dev);
        this.core = core;
        if (core.dev) {
            this.baseURL = "http://localhost/rest/2/";
        } else {
            this.baseURL = "https://api.purecore.io/rest/2/";
        }
    }

    public async commit(args: any, endpoint: string): Promise<any> {
        if (args == null) args = {};

        if (this.core.getCoreSession() !== null) {
            args["hash"] = this.core.getCoreSession().getHash();
        } else if (this.core.getKey() !== null) {
            args["key"] = this.core.getKey();
        }

        const params: string = Object.keys(args)
            .filter(key => args.hasOwnProperty(key))
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(args[key]))
            .join("&")

        const url = this.baseURL + Call.formatEndpoint(endpoint) + "?" + params;

        if (this.core.dev) {
            console.log("Fetching: " + url);
        }

        return new Promise((resolve, reject) => {
            return fetch(url, {
                method: "POST",
            })
                .then((response: Response) => response.json())
                .then((response: any) => {
                    if ("error" in response) {
                        throw new Error(response.error + ". " + response.msg);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => reject(error.message));
        });
    }

    private static formatEndpoint(endpoint: string): string {
        return (endpoint.startsWith('/') ? '' : '/') + endpoint + (endpoint.endsWith('/') ? '' : '/');
    }
}
