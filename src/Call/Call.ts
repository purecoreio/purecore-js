class Call {

    private readonly baseURL: string;
    private paramList: Array<CallParam>;

    public constructor() {
        this.baseURL = "https://api.purecore.io/rest/3";
        this.paramList = new Array<CallParam>();
    }

    public addParam(param: Param, value: any): Call {
        this.paramList.push(new CallParam(param, value));
        return this;
    }

    public async commit(
        endpoint: string,
    ): Promise<any> {

        let args = {};
        for (let i = 0; i < this.paramList.length; i++) {
            const element = this.paramList[i];
            args[element.param] = element.value;
        }

        let m = Core.getAuth();
        if (m != null) {
            args[m.getParam()] = m.getCredentials();
        }

        let formattedEndpoint = Call.formatEndpoint(endpoint);
        const url =
            this.baseURL +
            formattedEndpoint +
            "?" +
            Object.keys(args)
                .filter((key) => args.hasOwnProperty(key))
                .map(
                    (key) => encodeURIComponent(key) + "=" + encodeURIComponent(args[key])
                )
                .join("&");

        if (Core.dev) {
            var visibleArgs: any = args;
            for (const arg in visibleArgs) {
                if (Object.prototype.hasOwnProperty.call(visibleArgs, arg)) {
                    if (arg == m.getParam()) visibleArgs[arg] = "***";
                }
            }
            console.log(this.baseURL +
                formattedEndpoint, visibleArgs);
        }

        return new Promise((resolve, reject) => {
            return fetch(url, { method: "POST" })
                .then((response: Response) => response.json())
                .then((response: any) => {
                    if ("error" in response) {
                        throw new Error(response.error + ". " + response.msg);
                    } else {
                        resolve(response);
                    }
                })
                .catch((error) => reject(error));
        });
    }

    private static formatEndpoint(endpoint: string): string {
        return (
            (endpoint.startsWith("/") ? "" : "/") +
            endpoint +
            (endpoint.endsWith("/") ? "" : "/")
        );
    }
}