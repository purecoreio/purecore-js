class Call extends Core {
  public baseURL;
  public core;

  public constructor(core: Core) {
    super(core.getTool(), core.dev);
    this.core = core;
    if (core.dev) {
      this.baseURL = "http://localhost/rest/2/";
    } else {
      this.baseURL = "https://api.purecore.io/rest/2/";
    }
  }

  public commit(args = {}, endpoint: string): Promise<any> {
    var key = this.core.getKey();
    var session = this.core.getCoreSession();
    var baseURL = this.baseURL;

    var finalArgs = {};
    if (args == null) {
      finalArgs = {};
    }

    if (session != null) {
      finalArgs["hash"] = session.getHash();
    } else if (key != null) {
      finalArgs["key"] = key;
    }

    var paramsEncoded = Object.keys(finalArgs)
      .filter(function (key) {
        return finalArgs[key] ? true : false;
      })
      .map(function (key) {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(finalArgs[key])
        );
      })
      .join("&");

    var url = baseURL + endpoint + "?" + paramsEncoded;

    if (this.core.dev) {
      console.log("Fetching: " + url);
    }

    return new Promise(function (resolve, reject) {
      return fetch(url, {
        method: "POST",
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          if ("error" in response) {
            throw new Error(response.error + ". " + response.msg);
          } else {
            resolve(response);
          }
        })
        .catch(function (error) {
          reject(error.message);
        });
    });
  }
}
