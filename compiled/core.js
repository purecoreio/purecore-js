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
        try {
            Core.context.updateSubscriptionStatus();
        }
        catch (error) {
            // ignore
        }
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
class Analytics {
    static fromObject(object, type) {
        let analytics = new Analytics();
        analytics.list = new Array();
        analytics.base = object.base;
        analytics.beggining = Util.date(object.beggining);
        analytics.ending = Util.date(object.ending);
        analytics.period = Number(object.period);
        for (let i = 0; i < object.list.length; i++) {
            const element = object.list[i];
            if (type == AnalyticType.Revenue) {
                analytics.list.push(RevenueAnalytic.fromObject(element));
            }
            else {
                throw new Error("Unknown type");
            }
        }
        analytics.type = type;
        return analytics;
    }
    asApexSeries(fields = []) {
        let series = {};
        for (let i = 0; i < fields.length; i++) {
            series[String(fields[i])] = {
                name: this.base + " " + String(fields[i]).replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase(),
                data: [],
            };
        }
        for (let o = 0; o < this.list.length; o++) {
            const analytic = this.list[o];
            const analyticObj = analytic.asObject();
            for (let i = 0; i < fields.length; i++) {
                const field = String(fields[i]);
                if (field in analyticObj) {
                    series[field].data.push([analytic.getCreation().getTime(), analyticObj[field]]);
                }
            }
        }
        let finalSeries = [];
        for (const key in series) {
            if (Object.prototype.hasOwnProperty.call(series, key)) {
                const element = series[key];
                finalSeries.push(element);
            }
        }
        return finalSeries;
    }
    fill(until = null) {
        if (until != null && !(until instanceof Date)) {
            until = Util.date(until);
        }
        if (until == null)
            until = new Date();
        if (until instanceof Date) {
            if (until.getTime() > this.ending.getTime()) {
                // if the filling max is after the ending date, use the ending date as the max
                until = this.ending;
            }
            let unused = this.list.reverse();
            let final = new Array();
            for (let i = this.beggining.getTime() / 1000; i < until.getTime() / 1000; i += this.period) {
                if (unused.length > 0 && unused[0].getCreation().getTime() / 1000 == i) {
                    final.push(unused[0]);
                    unused.shift();
                }
                else {
                    if (this.type == AnalyticType.Revenue) {
                        final.push(new RevenueAnalytic().empty(Util.date(i)));
                    }
                }
            }
            if (unused.length > 0) {
                for (let i = 0; i < unused.length; i++) {
                    const element = unused[i];
                    final.push(element);
                }
            }
            this.list = final;
            return this;
        }
        else {
            throw new Error("Unknown until date");
        }
    }
    getTotal(fieldName) {
        let total = 0;
        for (let i = 0; i < this.list.length; i++) {
            const element = this.list[i];
            total += Number(element.asObject()[fieldName]);
        }
        return total;
    }
}
class MultipleAnalytics {
    static fromObject(object, type) {
        let ma = new MultipleAnalytics();
        ma.analytics = new Array();
        for (let i = 0; i < object.analytics.length; i++) {
            const element = object.analytics[i];
            ma.analytics.push(Analytics.fromObject(element, type));
        }
        return ma;
    }
    fill(until = null) {
        let final = new Array();
        for (let i = 0; i < this.analytics.length; i++) {
            final.push(this.analytics[i].fill(until));
        }
        this.analytics = final;
        return this;
    }
}
var AnalyticType;
(function (AnalyticType) {
    AnalyticType[AnalyticType["Revenue"] = 0] = "Revenue";
})(AnalyticType || (AnalyticType = {}));
class RevenueAnalytic {
    static fromObject(object) {
        let revenue = new RevenueAnalytic();
        revenue.creation = Util.date(object.creation);
        revenue.distinctCustomers = Number(object.distinctCustomers);
        revenue.totalRequests = Number(object.totalRequests);
        revenue.totalPayments = Number(object.totalPayments);
        revenue.totalRequested = Number(object.totalRequested);
        revenue.totalPaid = Number(object.totalPaid);
        revenue.totalDiscounted = Number(object.totalDiscounted);
        revenue.totalPotentialDiscount = Number(object.totalPotentialDiscount);
        revenue.totalTaxes = Number(object.totalTaxes);
        revenue.totalDisputed = Number(object.totalDisputed);
        revenue.totalRefunded = Number(object.totalRefunded);
        revenue.totalNet = Number(object.totalNet);
        revenue.totalGross = Number(object.totalGross);
        revenue.currency = String(object.currency);
        return revenue;
    }
    empty(date) {
        this.creation = date;
        this.distinctCustomers = 0;
        this.totalRequests = 0;
        this.totalPayments = 0;
        this.totalRequested = 0;
        this.totalPaid = 0;
        this.totalDiscounted = 0;
        this.totalPotentialDiscount = 0;
        this.totalTaxes = 0;
        this.totalDisputed = 0;
        this.totalRefunded = 0;
        this.totalNet = 0;
        this.totalGross = 0;
        this.currency = null;
        return this;
    }
    asObject() {
        return JSON.parse(JSON.stringify(this));
    }
    getCreation() {
        return this.creation;
    }
    getBase() {
        return this.currency;
    }
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
        return address;
    }
    asObject() {
        let obj = {};
        if (this.name != null) {
            obj["name"] = this.name;
        }
        if (this.email != null) {
            obj["email"] = this.email;
        }
        if (this.country != null) {
            obj["country"] = this.country;
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
class Method {
    static fromObject(object) {
        let method = new Method();
        method.creation = Util.date(object.creation);
        method.type = object.type == null ? null : String(object.type);
        method.brand = object.brand == null ? null : String(object.brand);
        method.wallet = object.wallet == null ? null : String(object.wallet);
        method.id = object.id == null ? null : String(object.id);
        method.visibleId = object.type == null ? null : String(object.visibleId);
        method.default = object.default === true ? true : false;
        return method;
    }
    getId() {
        return this.id;
    }
    getVisibleId() {
        return this.visibleId;
    }
    isDefault() {
        return this.default;
    }
}
class SubscriptionStatus {
    static fromObject(object) {
        let ss = new SubscriptionStatus();
        ss.plus = Boolean(object.plus);
        ss.plusReview = Boolean(object.plusReview);
        ss.plusGateway = Number(object.plusGateway);
        ss.hostingReview = Boolean(object.hostingReview);
        ss.hostingGateway = Number(object.hostingGateway);
        ss.usedTrial = Util.date(object.usedTrial);
        return ss;
    }
    isSubbed() {
        return this.plus;
    }
    didUseTrial() {
        return this.usedTrial != null;
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
    Param["Year"] = "ye";
    Param["Month"] = "mo";
    Param["Week"] = "we";
    Param["Day"] = "da";
    Param["Hour"] = "ho";
    Param["Epoch"] = "ep";
    Param["Address"] = "ad";
    Param["PaymentMethod"] = "pm";
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
    Param["ExecutionTemplate"] = "ext";
    Param["Delay"] = "de";
    Param["RequireOnline"] = "ro";
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
    Param["PerkCategory"] = "pc";
    Param["Countable"] = "cnt";
    Param["Price"] = "pr";
    Param["Amount"] = "am";
    Param["ExecutionType"] = "et";
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
        ins.online = Boolean(object.online);
        ins.type = Number(object.type);
        return ins;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
                .commit('instance/log/connection/').then(() => {
                return;
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
                .commit('instance/log/disconnection').then(() => {
                return;
            });
        });
    }
    isOnline() {
        return this.online;
    }
    asNetwork() {
        return new Network(this.id, this.name, Game.Unknown, Platform.Unknown);
    }
    getId() {
        return this.id;
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
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Instance, this.id)
                .commit('instance/get/key/').then((keyData) => {
                let keys = new Array();
                for (let i = 0; i < keyData.length; i++) {
                    const element = keyData[i];
                    keys.push(Key.fromObject(element));
                }
                return keys;
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
    asStore() {
        return new Store(this.id, this.name, this.game, this.platform);
    }
    asWebsite() {
        return new Website(this.id, this.name, this.game, this.platform);
    }
    getId() {
        return this.id;
    }
    asObject() {
        let obj = JSON.parse(JSON.stringify(this));
        return obj;
    }
    createExecutionTemplate(instances, command, requireOnline, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceIDs = Array();
            for (let i = 0; i < instances.length; i++) {
                const element = instances[i];
                if (typeof element == 'string') {
                    instanceIDs.push(element);
                }
                else if (element instanceof Instance) {
                    instanceIDs.push(element.getId());
                }
            }
            return yield new Call()
                .addParam(Param.Network, this.id)
                .addParam(Param.Instances, JSON.stringify(instanceIDs))
                .addParam(Param.Command, command)
                .addParam(Param.RequireOnline, Number(requireOnline))
                .addParam(Param.Delay, delay)
                .commit('execution/template/create').then((res) => {
                return ExecutionTemplate.fromObject(res);
            });
        });
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
    getMonthRevenue(month = null, year = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let call = new Call();
            call.addParam(Param.Network, this.id);
            if (month != null && year != null) {
                call.addParam(Param.Month, month);
                call.addParam(Param.Year, year);
            }
            return call.commit('analytics/revenue/month').then((res) => {
                return MultipleAnalytics.fromObject(res, AnalyticType.Revenue);
            });
        });
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
    isOnline() {
        return this.online;
    }
    static fromObject(object) {
        let ser = new Server();
        ser.id = String(object.id);
        ser.name = String(object.name);
        ser.group = null;
        if ('group' in object && object.group != null) {
            ser.group = ServerGroup.fromObject(object.group);
        }
        ser.online = Boolean(object.online);
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
class Store extends Network {
    constructor(id, name, game, platform) {
        super(id, name, game, platform);
    }
    getRepresentation() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Network, this.getId())
                .commit('store/representation/').then((res) => {
                return StoreRepresentation.fromObject(res);
            });
        });
    }
    getPerkRepresentation() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .addParam(Param.Network, this.getId())
                .commit('store/representation/perks/').then((res) => {
                return StorePerkRepresentation.fromObject(res);
            });
        });
    }
    createCategory(name, description = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let call = new Call()
                .addParam(Param.Network, this.getId())
                .addParam(Param.Name, name);
            if (description != null) {
                call.addParam(Param.Description, description);
            }
            return yield call.commit('store/item/category/create/').then((res) => {
                return ItemCategory.fromObject(res);
            });
        });
    }
    createPerkCategory(name, description = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let call = new Call()
                .addParam(Param.Network, this.getId())
                .addParam(Param.Name, name);
            if (description != null) {
                call.addParam(Param.Description, description);
            }
            return yield call.commit('store/perk/category/create/').then((res) => {
                return PerkCategory.fromObject(res);
            });
        });
    }
}
class ExecutionTemplate {
    constructor(id, string, requireOnline, instances, delay) {
        this.id = id;
        this.string = string;
        this.requireOnline = requireOnline;
        this.instances = instances;
        this.delay = delay;
    }
    static fromObject(object) {
        let instances = new Array();
        for (let index = 0; index < object.instances.length; index++) {
            const element = object.instances[index];
            instances.push(Instance.fromObject(element));
        }
        return new ExecutionTemplate(object.id, object.string, object.requireOnline, instances, object.delay);
    }
}
class StoreItem {
    constructor(id, name, description, icon, banner, price, perks, enable, list, archived) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.banner = banner;
        this.price = price;
        this.perks = perks;
        this.enable = enable;
        this.list = list;
        this.archived = archived;
    }
    static fromObject(object) {
        let perkRepresentations = new Array();
        for (let i = 0; i < object.perks.length; i++) {
            const element = object.perks[i];
            perkRepresentations.push(PerkCategoryRepresentation.fromObject(element));
        }
        return new StoreItem(object.id, object.name, object.description, object.icon, object.banner, object.price, perkRepresentations, object.enable, object.list, object.archived);
    }
    addPerk(perk, quantity = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let perkId = perk;
            if (perk instanceof Perk) {
                perkId = perk.id;
            }
            let call = new Call()
                .addParam(Param.StoreItem, this.id)
                .addParam(Param.Perk, perkId);
            if (quantity != null) {
                call.addParam(Param.Quantity, quantity);
            }
            return yield call.commit('store/item/perk/add/').then((res) => {
                return PerkContext.fromObject(res);
            });
        });
    }
    removePerk(perk) {
        return __awaiter(this, void 0, void 0, function* () {
            let perkId = perk;
            if (perk instanceof Perk || perk instanceof PerkContext) {
                perkId = perk.id;
            }
            return new Call()
                .addParam(Param.StoreItem, this.id)
                .addParam(Param.Perk, perkId)
                .commit('store/item/perk/remove/').then(() => {
                return;
            });
        });
    }
}
class ItemCategory {
    constructor(id, name, description, icon, banner, preferredRepresentation, list, enabled, upgradable, archived) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.banner = banner;
        this.preferredRepresentation = preferredRepresentation;
        this.list = list;
        this.enabled = enabled;
        this.upgradable = upgradable;
        this.archived = archived;
    }
    static fromObject(object) {
        let representation = null;
        switch (object.preferredRepresentation) {
            case 0:
                representation = PreferredRepresentation.List;
                break;
            case 1:
                representation = PreferredRepresentation.Box;
                break;
            case 2:
                representation = PreferredRepresentation.Table;
                break;
            case 3:
                representation = PreferredRepresentation.Carousel;
                break;
            default:
                representation = PreferredRepresentation.Unknown;
                break;
        }
        return new ItemCategory(object.id, object.name, object.description, object.icon, object.banner, representation, object.list, object.enabled, object.upgradable, object.archived);
    }
    createItem(name, price, description = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let call = new Call()
                .addParam(Param.StoreCategory, this.id)
                .addParam(Param.Name, name)
                .addParam(Param.Price, price);
            if (description != null) {
                call.addParam(Param.Description, description);
            }
            return yield call.commit('store/item/create/').then((res) => {
                return StoreItem.fromObject(res);
            });
        });
    }
}
var PreferredRepresentation;
(function (PreferredRepresentation) {
    PreferredRepresentation[PreferredRepresentation["Unknown"] = -1] = "Unknown";
    PreferredRepresentation[PreferredRepresentation["List"] = 0] = "List";
    PreferredRepresentation[PreferredRepresentation["Box"] = 1] = "Box";
    PreferredRepresentation[PreferredRepresentation["Table"] = 2] = "Table";
    PreferredRepresentation[PreferredRepresentation["Carousel"] = 3] = "Carousel";
})(PreferredRepresentation || (PreferredRepresentation = {}));
class ItemCategoryRepresentation {
    constructor(itemCategory, items) {
        this.itemCategory = itemCategory;
        this.items = items;
    }
    static fromObject(object) {
        const itemCategory = ItemCategory.fromObject(object.itemCategory);
        let items = new Array();
        for (let i = 0; i < object.items.length; i++) {
            const element = object.items[i];
            items.push(StoreItem.fromObject(element));
        }
        return new ItemCategoryRepresentation(itemCategory, items);
    }
}
class Perk {
    constructor(id, name, description, countable, params, commands, archived) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.countable == countable;
        this.params = params;
        this.commands = commands;
        this.archived = archived;
    }
    static fromObject(object) {
        let params = new Array();
        for (let index = 0; index < object.params.length; index++) {
            const element = object.params[index];
            params.push(PerkParam.fromObject(element));
        }
        return new Perk(object.id, object.name, object.description, object.countable, params, ExecutionSetup.fromObject(object.commands), object.archived);
    }
    addExecutionTemplate(template, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let templateId = template;
            if (template instanceof ExecutionTemplate) {
                templateId = template.id;
            }
            let main = this;
            return yield new Call()
                .addParam(Param.Perk, main.id)
                .addParam(Param.ExecutionTemplate, templateId)
                .addParam(Param.ExecutionType, type)
                .commit('store/perk/command/add/').then(() => {
                return;
            });
        });
    }
}
class PerkContext {
    constructor(id, name, description, countable, params, commands, quantity, archived) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.countable == countable;
        this.params = params;
        this.commands = commands;
        this.quantity = quantity;
        this.archived = archived;
    }
    static fromObject(object) {
        let params = new Array();
        for (let index = 0; index < object.params.length; index++) {
            const element = object.params[index];
            params.push(PerkParam.fromObject(element));
        }
        return new PerkContext(object.id, object.name, object.description, object.countable, params, ExecutionSetup.fromObject(object.commands), object.quantity, object.archived);
    }
    asPerk() {
        return new Perk(this.id, this.name, this.description, this.countable, this.params, this.commands, this.archived);
    }
}
class PerkCategory {
    constructor(id, name, description, archived) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.archived = archived;
    }
    static fromObject(object) {
        return new PerkCategory(object.id, object.name, object.description, object.archived);
    }
    createPerk(name, countable, description = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const countval = countable ? 'true' : 'false';
            let call = new Call()
                .addParam(Param.PerkCategory, this.id)
                .addParam(Param.Name, name)
                .addParam(Param.Countable, countval);
            if (description != null) {
                call.addParam(Param.Description, description);
            }
            return yield call.commit('store/perk/create/').then((res) => {
                return Perk.fromObject(res);
            });
        });
    }
}
class PerkCategoryRepresentation {
    constructor(perkCategory, perks) {
        this.perkCategory = perkCategory;
        this.perks = perks;
    }
    static fromObject(object) {
        let perks = new Array();
        for (let i = 0; i < object.perks.length; i++) {
            const element = object.perks[i];
            if ('quantity' in element) {
                perks.push(PerkContext.fromObject(element));
            }
            else {
                perks.push(Perk.fromObject(element));
            }
        }
        return new PerkCategoryRepresentation(PerkCategory.fromObject(object.perkCategory), perks);
    }
}
class ExecutionSetup {
    static fromObject(object) {
        let setup = new ExecutionSetup();
        setup.uponPayment = new Array();
        for (let i = 0; i < object.uponPayment.length; i++) {
            const element = object.uponPayment[i];
            setup.uponPayment.push(ExecutionTemplate.fromObject(element));
        }
        setup.uponRefund = new Array();
        for (let i = 0; i < object.uponRefund.length; i++) {
            const element = object.uponRefund[i];
            setup.uponRefund.push(ExecutionTemplate.fromObject(element));
        }
        setup.uponDispute = new Array();
        for (let i = 0; i < object.uponDispute.length; i++) {
            const element = object.uponDispute[i];
            setup.uponDispute.push(ExecutionTemplate.fromObject(element));
        }
        return setup;
    }
}
var ExecutionType;
(function (ExecutionType) {
    ExecutionType[ExecutionType["UponPayment"] = 0] = "UponPayment";
    ExecutionType[ExecutionType["UponRefund"] = 1] = "UponRefund";
    ExecutionType[ExecutionType["UponDispute"] = 2] = "UponDispute";
})(ExecutionType || (ExecutionType = {}));
class ParamRequirement {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    static fromObject(object) {
        let type = null;
        let value = null;
        switch (object.type) {
            case 0:
                type = RequirementType.RegExp;
                value = RegExp(object.value);
                break;
            case 1:
                type = RequirementType.ImageType;
                value = String(object.value);
                break;
            case 2:
                type = RequirementType.ImageSize;
                value = new Array();
                for (let i = 0; i < object.value.length; i++) {
                    const element = object.value[i];
                    value.push(Number(element));
                }
                break;
            default:
                type = RequirementType.Unknown;
                break;
        }
        return new ParamRequirement(type, value);
    }
}
var ParamType;
(function (ParamType) {
    ParamType[ParamType["Unknown"] = -1] = "Unknown";
    ParamType[ParamType["String"] = 0] = "String";
    ParamType[ParamType["Image"] = 1] = "Image";
})(ParamType || (ParamType = {}));
class PerkParam {
    constructor(id, placeholder, name, description, type, defaultv, mandatory, requirements, archived) {
        this.id = id;
        this.placeholder = placeholder;
        this.name = name;
        this.description = description;
        this.type = type;
        this.default = defaultv;
        this.mandatory = mandatory;
        this.requirements = requirements;
        this.archived = archived;
    }
    static fromObject(object) {
        let requirements = new Array();
        let paramType = null;
        switch (object.type) {
            case 0:
                paramType = ParamType.String;
                break;
            case 1:
                paramType = ParamType.Image;
                break;
            default:
                paramType = ParamType.Unknown;
                break;
        }
        for (let index = 0; index < object.requirements.length; index++) {
            const element = object.requirements[index];
            requirements.push(ParamRequirement.fromObject(element));
        }
        return new PerkParam(object.id, object.placeholder, object.name, object.description, paramType, object.default, object.mnandatory, requirements, object.archived);
    }
}
var RequirementType;
(function (RequirementType) {
    RequirementType[RequirementType["Unknown"] = -1] = "Unknown";
    RequirementType[RequirementType["RegExp"] = 0] = "RegExp";
    RequirementType[RequirementType["ImageType"] = 1] = "ImageType";
    RequirementType[RequirementType["ImageSize"] = 2] = "ImageSize";
})(RequirementType || (RequirementType = {}));
class StorePerkRepresentation {
    constructor(representations) {
        this.perkRepresentations = representations;
    }
    static fromObject(object) {
        let representations = new Array();
        for (let index = 0; index < object.perkRepresentations.length; index++) {
            const element = object.perkRepresentations[index];
            representations.push(PerkCategoryRepresentation.fromObject(element));
        }
        return new StorePerkRepresentation(representations);
    }
}
class StoreRepresentation {
    constructor(representations) {
        this.itemCategoryRepresentations = representations;
    }
    static fromObject(object) {
        let representations = new Array();
        for (let i = 0; i < object.itemCategoryRepresentations.length; i++) {
            const element = object.itemCategoryRepresentations[i];
            representations.push(ItemCategoryRepresentation.fromObject(element));
        }
        return new StoreRepresentation(representations);
    }
}
class Player {
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
    getBilling() {
        return new PlayerBilling(this.id, this.creation, this.username, this.lastLogin, this.lastUpdated, this.bio, this.birthdate);
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
/// <reference path="Player.ts"/>
class PlayerBilling extends Player {
    constructor(id, creation, username, lastLogin, lastUpdated, bio, birthdate) {
        super(id, creation, username, lastLogin, lastUpdated, bio, birthdate);
    }
    getSubscriptionStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .commit('player/billing/subscription/status/').then((res) => {
                let stat = SubscriptionStatus.fromObject(res);
                Core.context.setSubscriptionStatus(stat);
                return stat;
            });
        });
    }
    subscribeWithStripe() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .commit('player/billing/subscription/plus/start/stripe/').then((res) => {
                let stat = SubscriptionStatus.fromObject(res);
                Core.context.setSubscriptionStatus(stat);
                return stat;
            });
        });
    }
    cancelPlus() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .commit('player/billing/subscription/plus/cancel/').then((res) => {
                return SubscriptionStatus.fromObject(res);
            });
        });
    }
    getPaymentMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call()
                .commit('player/billing/method/list/').then((res) => {
                let methods = new Array();
                for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    methods.push(Method.fromObject(element));
                }
                return methods;
            });
        });
    }
    addPaymentMethod(method, defaultMethod = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = null;
            if (typeof method == 'string') {
                id = method;
            }
            else {
                id = method.getId();
            }
            let endpoint = "player/billing/method/add/";
            if (defaultMethod) {
                endpoint = "player/billing/method/add/default/";
            }
            return yield new Call()
                .addParam(Param.PaymentMethod, id)
                .commit(endpoint).then((res) => {
                return Method.fromObject(res);
            });
        });
    }
    detachPaymentMethod(method) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = null;
            if (typeof method == 'string') {
                id = method;
            }
            else {
                id = method.getId();
            }
            return yield new Call()
                .addParam(Param.PaymentMethod, id)
                .commit("player/billing/method/detach/").then(() => {
                return;
            });
        });
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
}
class Context {
    getNetwork() {
        return this.network;
    }
    getSubscriptionStatus() {
        return this.subscriptionStatus;
    }
    updateSubscriptionStatus() {
        let main = this;
        Core.getCopy().getPlayer().getBilling().getSubscriptionStatus().then((status) => {
            main.subscriptionStatus = status;
        });
    }
    setSubscriptionStatus(status) {
        this.subscriptionStatus = status;
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
class ColorScheme {
    static fromObject(object) {
        let scheme = new ColorScheme();
        scheme.dark = Boolean(object.dark);
        scheme.primary = String(object.primary);
        scheme.secondary = String(object.secondary);
        scheme.accent = String(object.accent);
        scheme.error = String(object.errorColor);
        return scheme;
    }
}
class Component {
    static fromObject(object) {
        let component = new Component();
        component.id = object.id;
        component.name = object.name;
        component.props = new Array();
        for (let i = 0; i < object.props.length; i++) {
            const element = object.props[i];
            component.props.push(element);
        }
        component.template = String(object.template);
        component.css = object.css;
        component.js = object.js;
        component.verified = Boolean(object.verified);
        return component;
    }
}
class Page {
    static fromObject(object) {
        let page = new Page();
        page.id = object.id;
        page.components = new Array();
        for (let i = 0; i < object.components.length; i++) {
            const element = object.components[i];
            page.components.push(Component.fromObject(element));
        }
        page.children = new Array();
        for (let i = 0; i < object.children.length; i++) {
            const element = object.children[i];
            page.children.push(Page.fromObject(element));
        }
        page.pathUnit = object.pathUnit;
        page.propName = object.propName;
        page.template = object.template;
        page.css = object.css;
        return page;
    }
    hasProp() {
        return this.propName != null;
    }
    hasChildren() {
        return this.children.length > 0;
    }
}
class SimplifiedTemplate {
    static fromObject(object) {
        let template = new Template();
        template.id = object.id;
        template.name = object.name;
        template.parent = object.template != null ? SimplifiedTemplate.fromObject(object.parent) : null;
        template.colorScheme = ColorScheme.fromObject(object.colorScheme);
        template.price = object.price;
        template.bundled = Boolean(object.bundled);
        return template;
    }
}
class Template {
    static fromObject(object) {
        let template = new Template();
        template.id = object.id;
        template.name = object.name;
        template.parent = object.parent != null ? SimplifiedTemplate.fromObject(object.parent) : null;
        template.colorScheme = ColorScheme.fromObject(object.colorScheme);
        template.template = object.template;
        template.css = object.css;
        template.price = object.price;
        template.bundled = Boolean(object.bundled);
        return template;
    }
}
class Website extends Network {
    constructor(id, name, game, platform) {
        super(id, name, game, platform);
    }
}
class WebsiteRepresentation {
    static fromObject(object) {
        let representation = new WebsiteRepresentation();
        representation.pages = new Array();
        for (let i = 0; i < object.pages.length; i++) {
            const element = object.pages[i];
            representation.pages.push(Page.fromObject(element));
        }
        representation.template = Template.fromObject(object.template);
        return representation;
    }
}
