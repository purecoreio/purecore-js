var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Core {
    constructor(method, dev) {
        // context
        if (Core.context == null) {
            Core.context = new Context();
        }
        // dev mode
        if (dev == null || dev == false) {
            let loc = location;
            if (loc) {
                // automatically set dev mode if running on localhost
                Core.dev = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
            }
            else {
                Core.dev = false;
            }
        }
        else {
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
    getLoginManager() {
        return new LoginHelper();
    }
    /**
     * @description gets the current context. useful when making network-related calls with a session object
     */
    getContext() {
        return Core.context;
    }
    /**
     * @description gets the current keychain instance
     */
    static getKeychain() {
        return Core.keychain;
    }
    /**
     * @description gets a generic instance from the api
     */
    getInstance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, id)
                .commit('instance/get/').then((res) => {
                return Instance.fromObject(res);
            });
        });
    }
    /**
     * @description gets a network instance from the api
     */
    getNetwork(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Network, id)
                .commit('network/get/').then((res) => {
                return Network.fromObject(res);
            });
        });
    }
    static getCopy() {
        return new Core();
    }
    /**
     * @description gets the highest priority authentication method
     */
    static getAuth() {
        let m = null;
        let mths = Core.keychain.getMethods();
        for (let i = 0; i < mths.length; i++) {
            const element = mths[i];
            if (m == null) {
                m = element;
            }
            else {
                if (element instanceof CoreSession && m instanceof Key) {
                    m = element;
                    break;
                }
            }
        }
        return m;
    }
    static addAuth(method) {
        Core.keychain.addMethod(method);
        return;
    }
    /**
     * @description returns null if there is no assigned player to the global core instance
     */
    getPlayer() {
        let ses = Core.keychain.getSession();
        if (ses != null) {
            return Core.keychain.getSession().getPlayer();
        }
        else {
            return null;
        }
    }
}
try {
    module.exports = Core;
}
catch (error) {
}
class Keychain {
    /**
     * @description tells the difference from different authentication methods based on the object structure
     */
    constructor() {
        this.authMethods = new Array();
    }
    addMethod(object) {
        this.authMethods.push(object);
    }
    getSession() {
        for (let i = 0; i < this.authMethods.length; i++) {
            const element = this.authMethods[i];
            if (element instanceof CoreSession) {
                return element;
            }
        }
        return null;
    }
    getMethods() {
        return this.authMethods;
    }
    removeSessions() {
        let newAuthMethods = new Array();
        for (let i = 0; i < this.authMethods.length; i++) {
            const element = this.authMethods[i];
            if (!(element instanceof CoreSession)) {
                newAuthMethods.push(element);
            }
        }
        this.authMethods = newAuthMethods;
    }
    static getMethod(object) {
        if (typeof object == 'string') {
            return new Key(object);
        }
        else if (typeof object == 'object') {
            // can be class, host code, payment hash
            // TODO: Implement host code, payment hash
            return CoreSession.fromObject(object);
        }
    }
}
class LoginHelper {
    constructor(autoLogin = true) {
        this.autoLogin = autoLogin;
        this.loggedIn = false;
        if (this.autoLogin) {
            try {
                this.loadSession();
                this.loggedIn = true;
            }
            catch (error) {
                // ignore
            }
        }
        if (Core.getAuth() instanceof CoreSession) {
            this.loggedIn = true;
        }
    }
    isLoggedIn() {
        return this.loggedIn;
    }
    loadSession() {
        let ses = CoreSession.load();
        Core.addAuth(ses);
        return ses;
    }
    logout() {
        // removes stored sessions
        if (localStorage.getItem(btoa("purecore-" + window.location.hostname + "l")) != null) {
            localStorage.removeItem(btoa("purecore-" + window.location.hostname + "l"));
        }
        if (localStorage.getItem(btoa("purecore-" + window.location.hostname + "d")) != null) {
            localStorage.removeItem(btoa("purecore-" + window.location.hostname + "d"));
        }
        if (localStorage.getItem(btoa("purecore-" + window.location.hostname + "h")) != null) {
            localStorage.removeItem(btoa("purecore-" + window.location.hostname + "h"));
        }
        // removes current sessions
        Core.getKeychain().removeSessions();
        // updates login status
        this.loggedIn = false;
    }
    login(method) {
        return new Promise((resolve, reject) => {
            method = Util.platformVal(method);
            if (window != null) {
                try {
                    if (LoginHelper.activeWindow != null)
                        LoginHelper.activeWindow.close();
                    // generates popup
                    let h = 600;
                    let w = 400;
                    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
                    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
                    let popup = window.open(this.getURL(method), 'Login', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
                    LoginHelper.activeWindow = popup;
                    let listenerActive = true;
                    let res = null;
                    // waits for result
                    window.addEventListener("message", (event) => {
                        if (event.origin !== "https://api.purecore.io") {
                            return;
                        }
                        switch (event.data.message) {
                            case 'login':
                                if (listenerActive) {
                                    res = Keychain.getMethod(event.data.data);
                                    Core.addAuth(res);
                                    // close window (result already got)
                                    if (!popup.closed) {
                                        popup.close();
                                        LoginHelper.activeWindow = null;
                                    }
                                    // do not listen for further events (task completed)
                                    listenerActive = false;
                                }
                                if (this.autoLogin) {
                                    if (res instanceof CoreSession) {
                                        res.save();
                                        this.loggedIn = true;
                                    }
                                }
                                resolve(res);
                                break;
                        }
                    }, false);
                    // check if the window gets closed before a result was retrieved
                    let interval = setInterval(() => {
                        if (LoginHelper.activeWindow != null && LoginHelper.activeWindow.closed) {
                            LoginHelper.activeWindow = null;
                        }
                        if (popup.closed && res == null) {
                            // stop listening for events
                            listenerActive = false;
                            // stop the window state checker
                            clearInterval(interval);
                            // throw error
                            reject(new Error("The popup was closed before any session was retrieved"));
                        }
                    }, 50);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                reject(new Error("In order to create a login popup, you must be executing purecore from a Document Object Model"));
            }
        });
    }
    getURL(platform) {
        let ext = "";
        switch (platform) {
            case Platform.Stadia:
                ext += "google";
                break;
            case Platform.Steam:
                ext += "steam";
                break;
            case Platform.Xbox:
                ext += "microsoft";
                break;
            case Platform.Discord:
                ext += "discord";
                break;
            default:
                throw new Error("Unsupported login method");
        }
        return `https://api.purecore.io/login/${ext}/`;
    }
}
class Key {
    constructor(hash, id, type, restrict, allowedReferrers, allowedRegions) {
        this.hash = hash;
        this.id = id;
        this.type = type;
        this.restrict = restrict;
        this.allowedReferrers = allowedReferrers;
        this.allowedRegions = allowedRegions;
    }
    getCredentials() {
        return this.hash;
    }
    getParam() {
        return Param.Hash;
    }
    static fromObject(object) {
        if ('hash' in object) {
            let key = new Key(String(object.hash));
            if ('id' in object) {
                key.id = String(object.id);
            }
            if ('restrict' in object) {
                key.restrict = Boolean(object.restrict);
            }
            if ('allowedReferrers' in object) {
                key.allowedReferrers = new Array();
                if (Array.isArray(object.allowedReferrers)) {
                    for (let i = 0; i < object.allowedReferrers.length; i++) {
                        const refererData = object.allowedReferrers[i];
                        key.allowedReferrers.push(RefererRestriction.fromObject(refererData));
                    }
                }
            }
            if ('allowedRegions' in object) {
                key.allowedRegions = new Array();
                if (Array.isArray(object.allowedRegions)) {
                    for (let i = 0; i < object.allowedRegions.length; i++) {
                        const regionData = object.allowedRegions[i];
                        key.allowedRegions.push(RegionRestriction.fromObject(regionData));
                    }
                }
            }
            return key;
        }
        else {
            throw new MissingProp('hash');
        }
    }
}
class RefererRestriction {
    constructor(index, domain, ip) {
        this.index = index;
        this.domain = domain;
        this.ip = ip;
    }
    static fromObject(object) {
        let ref = new RefererRestriction();
        ref.index = Number(object.index);
        ref.domain = String(object.domain);
        ref.ip = String(object.ip);
        return ref;
    }
}
class RegionRestriction {
    constructor(index, country, state, city) {
        this.index = index;
        this.country = country;
        this.state = state;
        this.city = city;
    }
    static fromObject(object) {
        let ref = new RegionRestriction();
        ref.index = Number(object.index);
        ref.country = String(object.country);
        ref.state = String(object.state);
        ref.city = String(object.city);
        return ref;
    }
}
class CoreSession {
    constructor(owner, location, device, usage, id, hash, network) {
        this.owner = owner;
        this.location = location;
        this.device = device;
        this.usage = usage;
        this.id = id;
        this.hash = hash;
        this.network = network;
    }
    getCredentials() {
        return this.hash;
    }
    getParam() {
        return Param.Hash;
    }
    asObject() {
        let obj = {
            owner: this.owner.asObject(),
            location: this.location.asObject(),
            device: this.device.asObject(),
            usage: this.usage.asObject(),
            id: this.id,
            hash: this.hash,
            network: (this.network == null ? null : this.network.asObject())
        };
        return obj;
    }
    save() {
        if (localStorage) {
            let gibberishLength = Math.floor(Math.random() * 128);
            let finalStr = btoa(Util.generateGibberish(256 + gibberishLength) + this.hash + Util.generateGibberish(256 + gibberishLength));
            let encodedLength = Util.shortLengthToLong(gibberishLength);
            /* please, keep in mind this encryption is just trash. it is only used
            in order to mask values when people are streaming or debugging live    */
            let sessionNonSensitive = this.asObject();
            delete sessionNonSensitive.hash;
            localStorage.setItem(btoa("purecore-" + window.location.hostname + "h"), finalStr);
            localStorage.setItem(btoa("purecore-" + window.location.hostname + "d"), btoa(JSON.stringify(sessionNonSensitive)));
            localStorage.setItem(btoa("purecore-" + window.location.hostname + "l"), encodedLength);
        }
        else {
            throw new Error("Local storage unavailable");
        }
    }
    static load() {
        let hash = localStorage.getItem(btoa("purecore-" + window.location.hostname + "h"));
        let nonSensitive = localStorage.getItem(btoa("purecore-" + window.location.hostname + "d"));
        let len = localStorage.getItem(btoa("purecore-" + window.location.hostname + "l"));
        if (hash != null) {
            if (len != null) {
                if (nonSensitive != null) {
                    let decodedLen = Util.longLengthToShort(len);
                    let decodedHash = atob(hash);
                    let finalHash = decodedHash.substr(256 + decodedLen, decodedHash.length - ((256 + decodedLen) * 2));
                    let decodedNonSensitive = JSON.parse(atob(nonSensitive));
                    decodedNonSensitive.hash = finalHash; // now sensitive
                    return CoreSession.fromObject(Keychain.getMethod(decodedNonSensitive)); // removes entity, reconverts it
                }
                else {
                    localStorage.removeItem(btoa("purecore-" + window.location.hostname + "h"));
                    localStorage.removeItem(btoa("purecore-" + window.location.hostname + "l"));
                    throw new Error("Missing non-sensitive data");
                }
            }
            else {
                localStorage.removeItem(btoa("purecore-" + window.location.hostname + "h"));
                throw new Error("No hash length found");
            }
        }
        else {
            if (len != null) {
                localStorage.removeItem(btoa("purecore-" + window.location.hostname + "l"));
            }
            if (nonSensitive != null) {
                localStorage.removeItem(btoa("purecore-" + window.location.hostname + "d"));
            }
            throw new Error("No hash found");
        }
    }
    static fromObject(object) {
        let ses = new CoreSession();
        if ('owner' in object) {
            ses.owner = Player.fromObject(object.owner);
        }
        if ('location' in object) {
            ses.location = SessionLocation.fromObject(object.location);
        }
        if ('device' in object) {
            ses.device = SessionDevice.fromObject(object.device);
        }
        if ('usage' in object) {
            ses.usage = SessionUsage.fromObject(object.usage);
        }
        if ('id' in object) {
            ses.id = String(object.id);
        }
        if ('hash' in object) {
            ses.hash = String(object.hash);
        }
        if ('network' in object) {
            if (object.network != null) {
                ses.network = Network.fromObject(object.network);
            }
            else {
                ses.network = null;
            }
        }
        return ses;
    }
    getPlayer() {
        return this.owner;
    }
}
class SessionDevice {
    constructor(os, device, brand, model) {
        this.os = os;
        this.device = device;
        this.brand = brand;
        this.model = model;
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }
    static fromObject(object) {
        let dev = new SessionDevice();
        dev.os = String(object.os);
        dev.device = String(object.device);
        dev.brand = String(object.brand);
        dev.model = String(object.model);
        return dev;
    }
}
class SessionLocation {
    constructor(city, state, country) {
        this.city = city;
        this.state = state;
        this.country = country;
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }
    static fromObject(object) {
        let loc = new SessionLocation();
        loc.city = String(object.city);
        loc.state = String(object.state);
        loc.country = String(object.country);
        return loc;
    }
}
class SessionUsage {
    constructor(creation, uses) {
        this.creation = creation;
        this.uses = uses;
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        obj.creation = Util.epoch(this.creation);
        return obj;
    }
    static fromObject(object) {
        let us = new SessionUsage();
        us.creation = Util.date(object.creation);
        us.uses = Number(object.uses);
        return us;
    }
}
class Call {
    constructor() {
        this.baseURL = "https://api.purecore.io/rest/3";
        this.paramList = new Array();
    }
    addParam(param, value) {
        this.paramList.push(new CallParam(param, value));
        return this;
    }
    commit(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const url = this.baseURL +
                formattedEndpoint +
                "?" +
                Object.keys(args)
                    .filter((key) => args.hasOwnProperty(key))
                    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(args[key]))
                    .join("&");
            if (Core.dev) {
                var visibleArgs = args;
                for (const arg in visibleArgs) {
                    if (Object.prototype.hasOwnProperty.call(visibleArgs, arg)) {
                        if (arg == m.getParam())
                            visibleArgs[arg] = "***";
                    }
                }
                console.log(this.baseURL +
                    formattedEndpoint, visibleArgs);
            }
            return new Promise((resolve, reject) => {
                return fetch(url, { method: "POST" })
                    .then((response) => response.json())
                    .then((response) => {
                    if ("error" in response) {
                        throw new Error(response.error + ". " + response.msg);
                    }
                    else {
                        resolve(response);
                    }
                })
                    .catch((error) => reject(error));
            });
        });
    }
    static formatEndpoint(endpoint) {
        return ((endpoint.startsWith("/") ? "" : "/") +
            endpoint +
            (endpoint.endsWith("/") ? "" : "/"));
    }
}
class CallParam {
    constructor(param, value) {
        this.param = param;
        this.value = value;
    }
}
var Param;
(function (Param) {
    Param["Address"] = "ad";
    Param["Key"] = "k";
    Param["Hash"] = "h";
    Param["Session"] = "ses";
    Param["Code"] = "c";
    Param["PaymentHash"] = "ph";
    Param["Bank"] = "b";
    Param["Description"] = "desc";
    Param["Name"] = "nm";
    Param["Platform"] = "plt";
    Param["Cname"] = "cnm";
    Param["Game"] = "gme";
    Param["PlatformId"] = "plid";
    Param["PlatformName"] = "plnm";
    Param["Quantity"] = "qty";
    Param["Value"] = "val";
    Param["Ip"] = "ip";
    Param["DeviceFingerprint"] = "dv";
    Param["ForumCategory"] = "fc";
    Param["ForumEmote"] = "fe";
    Param["ForumObject"] = "fo";
    Param["ForumOpinion"] = "fop";
    Param["ForumPost"] = "fp";
    Param["ForumReaction"] = "fr";
    Param["ForumReply"] = "frp";
    Param["ForumSection"] = "fs";
    Param["Connection"] = "cn";
    Param["Connections"] = "cs";
    Param["Command"] = "cmd";
    Param["CommandExecution"] = "cex";
    Param["EnvSource"] = "es";
    Param["Host"] = "ht";
    Param["Image"] = "hi";
    Param["ImageEnv"] = "hie";
    Param["HostTemplate"] = "htt";
    Param["Instance"] = "i";
    Param["Instances"] = "is";
    Param["Network"] = "n";
    Param["Server"] = "s";
    Param["Servers"] = "ss";
    Param["ServerGroup"] = "sg";
    Param["KeyId"] = "kid";
    Param["Machine"] = "m";
    Param["Notification"] = "not";
    Param["Payment"] = "p";
    Param["Discount"] = "d";
    Param["Discounts"] = "ds";
    Param["StoreItem"] = "si";
    Param["StoreItems"] = "sis";
    Param["StoreParam"] = "sp";
    Param["StoreParamResponse"] = "spr";
    Param["StoreParamResponses"] = "sprs";
    Param["Perk"] = "pk";
    Param["Perks"] = "pks";
    Param["StoreCategory"] = "sc";
    Param["Punishment"] = "pn";
    Param["Appeal"] = "a";
    Param["Report"] = "r";
    Param["Offence"] = "o";
    Param["Offences"] = "os";
    Param["PunishmentAction"] = "pa";
    Param["VotingSite"] = "vs";
    Param["Ticket"] = "t";
    Param["TicketCategory"] = "tc";
    Param["TicketReply"] = "tr";
    Param["Player"] = "pl";
    Param["Profile"] = "pp";
    Param["NetworkPlayer"] = "np";
})(Param || (Param = {}));
class MissingProp extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingProp";
    }
}
var Game;
(function (Game) {
    Game[Game["Minecraft"] = 0] = "Minecraft";
    Game[Game["MinecraftBedrock"] = 1] = "MinecraftBedrock";
    Game[Game["SpaceEngineers"] = 2] = "SpaceEngineers";
    Game[Game["Unknown"] = -1] = "Unknown";
})(Game || (Game = {}));
class Instance {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
    static fromObject(object) {
        let ins = new Instance();
        ins.id = String(object.id);
        ins.name = String(object.name);
        ins.type = Number(object.type);
        return ins;
    }
    asNetwork() {
        return new Network(this.id, this.name, Game.Unknown, Platform.Unknown);
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
                .commit('instance/delete').then(() => {
                return;
            });
        });
    }
}
var CoreInstanceType;
(function (CoreInstanceType) {
    CoreInstanceType[CoreInstanceType["Network"] = 0] = "Network";
    CoreInstanceType[CoreInstanceType["Server"] = 1] = "Server";
})(CoreInstanceType || (CoreInstanceType = {}));
class Network {
    constructor(id, name, game, platform) {
        this.id = id;
        this.name = name;
        this.game = game;
        this.platform = platform;
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }
    static fromObject(object) {
        let net = new Network();
        net.name = String(object.name);
        net.id = String(object.id);
        net.game = Number(object.game);
        net.platform = Number(object.platform);
        return net;
    }
    asInstance() {
        return new Instance(this.id, this.name, CoreInstanceType.Network);
    }
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Network, this.id)
                .commit('instance/group/list').then((res) => {
                let lists = new Array();
                if (Array.isArray(res)) {
                    for (let i = 0; i < res.length; i++) {
                        const groupData = res[i];
                        lists.push(ServerGroupList.fromObject(groupData));
                    }
                    return lists;
                }
                else {
                    throw new Error("Invalid result");
                }
            });
        });
    }
    createServer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Network, this.id)
                .addParam(Param.Name, name)
                .commit('instance/create').then((res) => {
                return Server.fromObject(res);
            });
        });
    }
    createServerGroup(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Network, this.id)
                .addParam(Param.Name, name)
                .commit('instance/group/create').then((res) => {
                return ServerGroup.fromObject(res);
            });
        });
    }
    delete(confirmation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirmation) {
                return yield new Call()
                    .addParam(Param.Instance, this.id)
                    .commit('instance/delete').then(() => {
                    return;
                });
            }
            else {
                return new Promise((resolve, reject) => {
                    reject(new Error("missing confirmation"));
                });
            }
        });
    }
}
var Platform;
(function (Platform) {
    Platform[Platform["Unknown"] = -1] = "Unknown";
    Platform[Platform["Mojang"] = 0] = "Mojang";
    Platform[Platform["Xbox"] = 1] = "Xbox";
    Platform[Platform["Steam"] = 2] = "Steam";
    Platform[Platform["Stadia"] = 3] = "Stadia";
    Platform[Platform["EpicGames"] = 4] = "EpicGames";
    Platform[Platform["Discord"] = 5] = "Discord";
})(Platform || (Platform = {}));
class Server {
    constructor(network, id, name, group) {
        this.network = network;
        this.id = id;
        this.name = name;
        this.group = group;
    }
    static fromObject(object) {
        let ser = new Server();
        ser.id = String(object.id);
        ser.name = String(object.name);
        ser.group = null;
        if ('group' in object && object.group != null) {
            ser.group = ServerGroup.fromObject(object.group);
        }
        return ser;
    }
    asInstance() {
        return new Instance(this.id, this.name, CoreInstanceType.Server);
    }
    getGroup() {
        return this.group;
    }
    setGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Server, this.id)
                .addParam(Param.ServerGroup, group.getId())
                .commit('instance/group/set').then((res) => {
                let server = Server.fromObject(res);
                this.group = server.getGroup();
                return server;
            });
        });
    }
    ungroup() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Server, this.id)
                .commit('instance/group/unset').then((res) => {
                let server = Server.fromObject(res);
                this.group = server.getGroup();
                return server;
            });
        });
    }
}
class ServerGroupList {
    constructor(id, name, network, servers) {
        this.id = id;
        this.name = name;
        this.network = network;
        this.servers = servers;
    }
    static fromObject(object) {
        let sg = new ServerGroupList();
        sg.id = (object.id == null ? null : String(object.id));
        sg.name = (object.name == null ? null : String(object.name));
        sg.network = null;
        if ('network' in object && object.network != null) {
            sg.network = Network.fromObject(object.network);
        }
        sg.servers = new Array();
        if ('servers' in object && object.servers != null && Array.isArray(object.servers)) {
            for (let i = 0; i < object.servers.length; i++) {
                sg.servers.push(Server.fromObject(object.servers[i]));
            }
        }
        return sg;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getServers() {
        return this.servers;
    }
    asServerGroup() {
        return new ServerGroup(this.id, this.network, this.name);
    }
}
class ServerGroup {
    constructor(id, network, name) {
        this.id = id;
        this.network = network;
        this.name = name;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    static fromObject(object) {
        let sg = new ServerGroup();
        sg.id = (object.id == null ? null : String(object.id));
        sg.network = null;
        if ('network' in object && object.network != null) {
            sg.network = Network.fromObject(object.network);
        }
        sg.name = (object.name == null ? null : String(object.name));
        return sg;
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.ServerGroup, this.id)
                .commit('instance/group/delete').then(() => {
                return;
            });
        });
    }
}
class Address {
    constructor(name, email, country, state, city, postalCode, line1, line2) {
        this.name = name;
        this.email = email;
        this.country = country;
        this.state = state;
        this.city = city;
        this.postalCode = postalCode;
        this.line1 = line1;
        this.line2 = line2;
    }
    static fromObject(object) {
        let address = new Address();
        address.name = (object.name == null ? null : String(object.name));
        address.email = (object.email == null ? null : String(object.email));
        address.country = (object.country == null ? null : String(object.country));
        address.state = (object.state == null ? null : String(object.state));
        address.city = (object.city == null ? null : String(object.city));
        address.postalCode = (object.postalcode == null ? null : String(object.postalcode));
        address.line1 = (object.line1 == null ? null : String(object.line1));
        address.line2 = (object.name == null ? null : String(object.line2));
        return object;
    }
    asObject() {
        let obj = {};
        if (this.name != null) {
            obj["name"] = this.name;
        }
        if (this.email != null) {
            obj["email"] = this.email;
        }
        if (this.state != null) {
            obj["state"] = this.state;
        }
        if (this.city != null) {
            obj["city"] = this.city;
        }
        if (this.postalCode != null) {
            obj["postalcode"] = this.postalCode;
        }
        if (this.line1 != null) {
            obj["line1"] = this.line1;
        }
        if (this.line2 != null) {
            obj["line2"] = this.line2;
        }
        return obj;
    }
    asQuery() {
        return JSON.stringify(this.asObject());
    }
}
class Player {
    /*private msa;
    private dca;
    private ga;
    private sa;*/
    constructor(id, creation, username, lastLogin, lastUpdated, bio, birthdate) {
        this.id = id;
        this.creation = creation;
        this.username = username;
        this.lastLogin = lastLogin;
        this.lastUpdated = lastUpdated;
        this.bio = bio;
        this.birthdate = birthdate;
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        obj.lastUpdated = Util.epoch(this.getLastUpdated());
        obj.lastLogin = Util.epoch(this.getLastLogin());
        obj.birthdate = Util.epoch(this.getBirthdate());
        obj.creation = Util.epoch(this.getCreation());
        return obj;
    }
    getBillingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .commit('player/billing/address/get/').then((res) => {
                return Address.fromObject(res);
            });
        });
    }
    setBillingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(address instanceof Address)) {
                address = Address.fromObject(address);
            }
            return yield new Call()
                .addParam(Param.Address, address.asQuery())
                .commit('player/billing/address/set/').then((res) => {
                return Address.fromObject(res);
            });
        });
    }
    getLastUpdated() {
        return this.lastUpdated;
    }
    getLastLogin() {
        return this.lastLogin;
    }
    getBirthdate() {
        return this.birthdate;
    }
    getCreation() {
        return this.creation;
    }
    static fromObject(object) {
        let ply = new Player();
        if ('id' in object) {
            ply.id = String(object.id);
        }
        if ('creation' in object) {
            ply.creation = Util.date(object.creation);
        }
        if ('username' in object) {
            ply.username = object.username == null ? null : String(object.username);
        }
        if ('lastLogin' in object) {
            ply.lastLogin = Util.date(object.lastLogin);
        }
        if ('lastUpdated' in object) {
            ply.lastUpdated = Util.date(object.lastUpdated);
        }
        if ('bio' in object) {
            ply.bio = (object.bio == null ? null : String(object.bio));
        }
        if ('birthdate' in object) {
            ply.birthdate = Util.date(object.birthdate);
        }
        return ply;
    }
    asOwner() {
        return new Owner(this.id, this.creation, this.username, this.lastLogin, this.lastUpdated, this.bio, this.birthdate);
    }
}
/// <reference path="Player.ts"/>
class Owner extends Player {
    constructor(id, creation, username, lastLogin, lastUpdated, bio, birthdate) {
        super(id, creation, username, lastLogin, lastUpdated, bio, birthdate);
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        obj.lastUpdated = Util.epoch(this.getLastUpdated());
        obj.lastLogin = Util.epoch(this.getLastLogin());
        obj.birthdate = Util.epoch(this.getBirthdate());
        obj.creation = Util.epoch(this.getCreation());
        return obj;
    }
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .commit('network/list/').then((res) => {
                if (Array.isArray(res)) {
                    let networkList = new Array();
                    for (let i = 0; i < res.length; i++) {
                        networkList.push(Network.fromObject(res[i]));
                    }
                    return networkList;
                }
                else {
                    throw new Error("Invalid type");
                }
            });
        });
    }
    createNetwork(name, cname, game, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            game = Util.gameVal(game);
            platform = Util.platformVal(platform);
            return yield new Call()
                .addParam(Param.Name, name)
                .addParam(Param.Cname, cname)
                .addParam(Param.Game, game)
                .addParam(Param.Platform, platform)
                .commit('network/create/').then((res) => {
                return Network.fromObject(res);
            });
        });
    }
}
class Context {
    getNetwork() {
        return this.network;
    }
    setNetwork(network) {
        if (typeof network == 'string') {
            let main = this;
            main.network = new Network(String(network), null, null, null);
            Core.getCopy().getNetwork(network).then((network) => {
                main.network = network;
            });
        }
        else {
            this.network = network;
        }
    }
}
class Util {
    static dec2hex(dec) {
        return dec.toString(16).padStart(2, "0");
    }
    static generateGibberish(len) {
        var arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, Util.dec2hex).join('');
    }
    static shortLengthToLong(length) {
        let output = "";
        let multiplyFactor = Math.floor(Math.random() * 16);
        if (multiplyFactor % 2 <= 0) {
            multiplyFactor += 1;
        }
        let componentNumber = 16 + multiplyFactor;
        output = Number(length * multiplyFactor).toString(2);
        let finalLengthStr = "";
        for (let i = 0; i < componentNumber; i++) {
            if (i == componentNumber - 1) {
                finalLengthStr += String(i) + output;
            }
            else {
                finalLengthStr += String(i) + output + "!@#";
            }
        }
        return btoa(finalLengthStr);
    }
    static longLengthToShort(length) {
        let bin = atob(length);
        let components = bin.split("!@#");
        let n = parseInt(components[0].substring(1, components[0].length - 1), 2) / (components.length - 16);
        return Math.floor(n * 2);
    }
    static epoch(date) {
        return (date == null ? null : date.getTime() / 1000);
    }
    static date(UTCSeconds) {
        if (UTCSeconds != null && UTCSeconds != 0) {
            let date = new Date(0);
            date.setUTCSeconds(UTCSeconds);
            return date;
        }
        else {
            return null;
        }
    }
    static gameVal(game) {
        if (typeof game == 'string') {
            if (!isNaN(Number(game))) {
                game = Number(game);
            }
            else {
                game = String(game).toLowerCase();
                switch (true) {
                    case ['mc', 'minecraft'].includes(game):
                        game = Game.Minecraft;
                        break;
                    case ['mc bedrock', 'bedrock', 'minecraft bedrock', 'minecraft_bedrock', 'minecraftbedrock'].includes(game):
                        game = Game.MinecraftBedrock;
                        console.log(game);
                        break;
                    case ['se', 'spaceengineers', 'space engineers'].includes(game):
                        game = Game.SpaceEngineers;
                        break;
                    default:
                        game = Game.Unknown;
                        break;
                }
            }
        }
        if (game > Game.SpaceEngineers, game < Game.Unknown)
            game = Game.Unknown;
        return game;
    }
    static platformVal(platform) {
        if (typeof platform == 'string') {
            if (!isNaN(Number(platform))) {
                platform = Number(platform);
            }
            else {
                platform = String(platform).toLowerCase();
                switch (true) {
                    case ['mojang'].includes(platform):
                        platform = Platform.Mojang;
                        break;
                    case ['xbox', 'microsoft'].includes(platform):
                        platform = Platform.Xbox;
                        break;
                    case ['google', 'stadia'].includes(platform):
                        platform = Platform.Stadia;
                        break;
                    case ['steam', 'valve'].includes(platform):
                        platform = Platform.Steam;
                        break;
                    case ['discord', 'discord-o!'].includes(platform):
                        platform = Platform.Discord;
                        break;
                    case ['epic', 'epicgames'].includes(platform):
                        platform = Platform.EpicGames;
                        break;
                    default:
                        platform = Platform.Unknown;
                        break;
                }
            }
        }
        if (platform > Platform.Discord, platform < Platform.Unknown)
            platform = Platform.Unknown;
        return platform;
    }
}
