class Call extends Core {
  private readonly baseURL: string;
  private readonly core: Core;

  public constructor(core: Core) {
    super(core.getTool(), core.dev);
    this.core = core;
    this.baseURL = "https://api.purecore.io/rest/2";
  }

  public async commit(
    args: any,
    endpoint: string,
    request?: RequestInit
  ): Promise<any> {
    if (args == null) args = {};
    if (request == null) request = { method: "POST" };

    if (this.core.getCoreSession() != null) {
      args.hash = this.core.getCoreSession().getHash();
    } else if (this.core.getKey() != null) {
      args.key = this.core.getKey();
    }

    const url =
      this.baseURL +
      Call.formatEndpoint(endpoint) +
      "?" +
      Object.keys(args)
        .filter((key) => args.hasOwnProperty(key))
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(args[key])
        )
        .join("&");

    if (this.core.dev) {
      var visibleArgs: any = args;
      if (args.key != null) visibleArgs.key = "***";
      if (args.hash != null) visibleArgs.hash = "***";
      console.log(this.baseURL +
        Call.formatEndpoint(endpoint), visibleArgs);
    }

    return new Promise((resolve, reject) => {
      return fetch(url, request)
        .then((response: Response) => response.json())
        .then((response: any) => {
          if ("error" in response) {
            throw new Error(response.error + ". " + response.msg);
          } else {
            resolve(response);
          }
        })
        .catch((error) => reject(error.message));
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