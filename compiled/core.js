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
            Core.dev = true;
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
     * @description gets a generic instance from the api
     */
    static getInstance(id) {
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
    static getNetwork(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, id)
                .commit('network/get/').then((res) => {
                return Network.fromObject(res);
            });
        });
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
class Keychain {
    /**
     * @description tells the difference from different authentication methods based on the object structure
     */
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
var Platform;
(function (Platform) {
    Platform[Platform["Mojang"] = 0] = "Mojang";
    Platform[Platform["Xbox"] = 1] = "Xbox";
    Platform[Platform["Steam"] = 2] = "Steam";
    Platform[Platform["Stadia"] = 3] = "Stadia";
    Platform[Platform["EpicGames"] = 4] = "EpicGames";
    Platform[Platform["Unknown"] = 5] = "Unknown";
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
    getGroup() {
        return this.group;
    }
    setGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
                .addParam(Param.ServerGroup, group.getId())
                .commit('instance/group/set').then((res) => {
                let server = Server.fromObject(res);
                this.group = server.getGroup();
                return server;
            });
        });
    }
    ungroup(grup) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
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
        sg.id = String(object.id);
        sg.name = String(object.name);
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
    static fromObject(object) {
        let sg = new ServerGroup();
        sg.id = String(object.id);
        sg.network = null;
        if ('network' in object && object.network != null) {
            sg.network = Network.fromObject(object.network);
        }
        sg.name = String(object.name);
        return sg;
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
                .commit('instance/group/delete').then(() => {
                return;
            });
        });
    }
}
class Owner {
    /*
    public constructor(id?: string, creation?: Date, username?: string, lastLogin?: Date, lastUpdated?: Date, bio?: string, birthdate?: Date) {
        super(id, creation, username, lastLogin, lastUpdated, bio, birthdate);
    }*/
    getNetworks(name, cname, game, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Name, name)
                .addParam(Param.Cname, cname)
                .addParam(Param.Game, game)
                .addParam(Param.Platform, platform)
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
    static fromObject(object) {
        let ply = new Player();
        if ('id' in object) {
            ply.id = String(object.id);
        }
        if ('creation' in object) {
            ply.creation = Util.date(object.creation);
        }
        if ('username' in object) {
            ply.username = String(object.username);
        }
        if ('lastLogin' in object) {
            ply.lastLogin = Util.date(object.lastLogin);
        }
        if ('lastUpdated' in object) {
            ply.lastUpdated = Util.date(object.lastUpdated);
        }
        if ('bio' in object) {
            ply.bio = String(object.bio);
        }
        if ('birthdate' in object) {
            ply.birthdate = Util.date(object.birthdate);
        }
        return ply;
    }
    asOwner() {
        return new Owner();
        //return new Owner(this.id, this.creation, this.username, this.lastLogin, this.lastUpdated, this.bio, this.birthdate)
    }
}
class Util {
    static date(UTCSeconds) {
        let date = new Date(0);
        date.setUTCSeconds(UTCSeconds);
        return date;
    }
}
