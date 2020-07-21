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
    constructor(tool, dev) {
        if (dev == null) {
            this.dev = false;
        }
        else {
            this.dev = dev;
        }
        if (tool != undefined) {
            if (typeof tool == "string") {
                this.key = tool;
            }
            else if (typeof tool == "object") {
                if (tool instanceof Session) {
                    this.session = tool;
                }
                else {
                    this.session = new Session(new Core(this.session, this.dev)).fromArray(tool);
                }
            }
        }
        // if not start with fromdiscord or fromtoken
    }
    getCacheCollection() {
        return new CacheCollection();
    }
    requestGlobalHash() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this)
                .commit({}, "session/hash/list/")
                .then(json => json.map(hash => ConnectionHashGlobal.fromJSON(this, hash)));
        });
    }
    getPlayersFromIds(ids) {
        return ids.map(id => new Player(this, id));
    }
    getMachine(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this)
                .commit({ hash: hash }, "machine")
                .then(Machine.fromJSON);
        });
    }
    fromToken(googleToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this)
                .commit({ token: googleToken }, "session/from/google")
                .then(json => {
                const session = Session.fromJSON(new Core(null), json);
                this.session = session;
                return session;
            });
        });
    }
    asBillingAddress(json) {
        return BillingAddress.fromJSON(json);
    }
    getWorkbench() {
        return new Workbench();
    }
    pushFCM(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this)
                .commit({ token: token }, "account/push/fcm")
                .then(() => true);
        });
    }
    getTool() {
        if (this.key != null) {
            return this.key;
        }
        else {
            return this.session;
        }
    }
    getCoreSession() {
        return this.session;
    }
    getLegacyKey() {
        return new Key(this, "UNK", null, this.key, null);
    }
    getKey() {
        if (this.key == undefined) {
            return null;
        }
        else {
            return this.key;
        }
    }
    getElements() {
        return new Elements(this);
    }
    getInstance(instanceId, name, type) {
        return new Instance(this, instanceId, name, type);
    }
    getCore() {
        return this;
    }
    fromDiscord(guildId, botToken, devkey) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                guildid: guildId,
                token: botToken
            };
            if (devkey)
                params.devkey = true;
            return yield new Call(this)
                .commit(params, "key/from/discord")
                .then(json => {
                this.key = json.hash;
                return this;
            });
        });
    }
}
try {
    module.exports = Core;
}
catch (error) {
    console.log("[corejs] starting plain vanilla instance, as nodejs exports were not available");
}
class Analytic {
    constructor(timestamp, original, fields) {
        this.timestamp = timestamp;
        this.original = original;
        this.fields = fields;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getOriginal() {
        return this.original;
    }
    getFields(onlyrelative = false) {
        var final = new Array();
        if (onlyrelative) {
            this.fields.forEach((element) => {
                if (element.getName().includes("%")) {
                    final.push(element);
                }
            });
        }
        else {
            this.fields.forEach((element) => {
                if (!element.getName().includes("%")) {
                    final.push(element);
                }
            });
        }
        return final;
    }
    setFields(fields) {
        this.fields = fields;
    }
}
class AnalyticField {
    constructor(value, name, technicalName) {
        this.value = value;
        this.name = name;
        this.technicalName = technicalName;
    }
    getTechnicalName() {
        return this.technicalName;
    }
    getName() {
        return this.name;
    }
    getValue() {
        return this.value;
    }
}
class GrowthAnalytic {
    constructor(uuid = null, instance = null, newPlayers = 0, activePlayers = 0, inactivePlayers = 0, newPlayersRelative = 0, activePlayersRelative = 0, inactivePlayersRelative = 0, timestamp = 0) {
        this.uuid = uuid;
        this.instance = instance;
        this.newPlayers = newPlayers;
        this.activePlayers = activePlayers;
        this.inactivePlayers = inactivePlayers;
        this.newPlayersRelative = newPlayersRelative;
        this.activePlayersRelative = activePlayersRelative;
        this.inactivePlayersRelative = inactivePlayersRelative;
        this.timestamp = timestamp;
    }
    getLegacy() {
        return new Analytic(this.timestamp, this, this.getFields());
    }
    fromArray(array) {
        this.uuid = null;
        this.instance = null;
        this.newPlayers = array.newPlayers;
        this.activePlayers = array.activePlayers;
        this.inactivePlayers = array.inactivePlayers;
        this.newPlayersRelative = array.newPlayersRelative;
        this.activePlayersRelative = array.activePlayersRelative;
        this.inactivePlayersRelative = array.inactivePlayersRelative;
        this.timestamp = array.timestamp * 1000;
        return this;
    }
    getFields() {
        var result = new Array();
        result.push(new AnalyticField(this.newPlayers, "New Players", "newPlayers"));
        result.push(new AnalyticField(this.activePlayers, "Active Players", "activePlayers"));
        result.push(new AnalyticField(this.inactivePlayers, "Inactive Players", "inactivePlayers"));
        result.push(new AnalyticField((this.newPlayersRelative * 100).toFixed(2), "New Players %", "newPlayersRelative"));
        result.push(new AnalyticField((this.activePlayersRelative * 100).toFixed(2), "Active Players %", "activePlayersRelative"));
        result.push(new AnalyticField((this.inactivePlayersRelative * 100).toFixed(2), "Inactive Players %", "inactivePlayersRelative"));
        return result;
    }
}
class IncomeAnalytic {
    constructor(uuid = null, store = null, finalIncome = 0, payments = 0, potentialIncome = 0, paymentRequests = 0, timestamp = 0) {
        this.uuid = uuid;
        this.store = store;
        this.finalIncome = finalIncome;
        this.payments = payments;
        this.potentialIncome = potentialIncome;
        this.paymentRequests = paymentRequests;
        this.timestamp = timestamp * 1000;
    }
    getLegacy() {
        return new Analytic(this.timestamp, this, this.getFields());
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.store = null;
        this.finalIncome = array.finalIncome;
        this.payments = array.payments;
        this.potentialIncome = array.potentialIncome;
        this.paymentRequests = array.paymentRequests;
        this.timestamp = array.timestamp * 1000;
        return this;
    }
    getFields() {
        var result = new Array();
        result.push(new AnalyticField(this.finalIncome, "Income", "income"));
        result.push(new AnalyticField(this.payments, "Payment Count", "paymentCount"));
        result.push(new AnalyticField(this.potentialIncome, "Potential Income", "potentialIncome"));
        result.push(new AnalyticField(this.paymentRequests, "Potential Payment Count", "potentialPaymentCount"));
        return result;
    }
}
class VoteAnalytic {
    constructor(uuid = null, network = null, voteCount = 0, voterCount = 0, timestamp = 0) {
        this.uuid = uuid;
        this.network = network;
        this.voteCount = voteCount;
        this.voterCount = voterCount;
        this.timestamp = timestamp * 1000;
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.network = null;
        this.voteCount = array.voteCount;
        this.voterCount = array.voterCount;
        this.timestamp = array.timestamp * 1000;
        return this;
    }
    getLegacy() {
        return new Analytic(this.timestamp, this, this.getFields());
    }
    getFields() {
        var result = new Array();
        result.push(new AnalyticField(this.voteCount, "Vote count", "voteCount"));
        result.push(new AnalyticField(this.voterCount, "Voter count", "voterCount"));
        return result;
    }
}
class Workbench {
    arrayToLegacy(array) {
        var final = new Array();
        array.forEach((element) => {
            var analytic = element.getLegacy();
            final.push(analytic);
        });
        return final;
    }
    stack(analytics = new Array(), maxSeconds = 0) {
        var finalAnalytics = new Array();
        var timestampStart = null;
        var itemBeingWorkedOn = null;
        analytics.forEach((analytic) => {
            if (timestampStart == null) {
                timestampStart = analytic.getTimestamp();
                itemBeingWorkedOn = analytic;
            }
            else {
                if (analytic.getTimestamp() - timestampStart >= maxSeconds) {
                    finalAnalytics.push(itemBeingWorkedOn);
                    itemBeingWorkedOn = analytic;
                    timestampStart = analytic.getTimestamp();
                }
                else {
                    if (itemBeingWorkedOn.getOriginal() instanceof VoteAnalytic ||
                        itemBeingWorkedOn.getOriginal() instanceof IncomeAnalytic) {
                        var fields = itemBeingWorkedOn.getFields();
                        var newFields = new Array();
                        fields.forEach((field) => {
                            analytic.getFields().forEach((fieldTemporal) => {
                                if (field.getTechnicalName() == fieldTemporal.getTechnicalName()) {
                                    var newField = new AnalyticField(field.value + fieldTemporal.value, field.name, field.technicalName);
                                    newFields.push(newField);
                                }
                            });
                        });
                        itemBeingWorkedOn.setFields(newFields);
                    }
                    else if (itemBeingWorkedOn.getOriginal() instanceof GrowthAnalytic) {
                        var fields = itemBeingWorkedOn.getFields();
                        var newFields = new Array();
                        fields.forEach((field) => {
                            analytic.getFields().forEach((fieldTemporal) => {
                                if (field.getTechnicalName() == fieldTemporal.getTechnicalName()) {
                                    var newField = new AnalyticField(field.value, field.name, field.technicalName);
                                    newFields.push(newField);
                                }
                            });
                        });
                        itemBeingWorkedOn.setFields(newFields);
                    }
                }
            }
        });
        if (!finalAnalytics.includes(itemBeingWorkedOn)) {
            finalAnalytics.push(itemBeingWorkedOn);
        }
        return finalAnalytics;
    }
    toApexSeries(analyticArray, onlyRelative = false) {
        var fieldData = [];
        analyticArray.forEach((analytic) => {
            var timestamp = analytic.getTimestamp();
            analytic.getFields(onlyRelative).forEach((field) => {
                if (!(field.getTechnicalName() in fieldData)) {
                    fieldData[field.getTechnicalName()] = {};
                    fieldData[field.getTechnicalName()]["values"] = [];
                    fieldData[field.getTechnicalName()]["name"] = field.getName();
                }
                fieldData[field.getTechnicalName()].values.push({
                    x: timestamp,
                    y: field.getValue(),
                });
            });
        });
        var finalSeries = [];
        for (const key in fieldData) {
            if (fieldData.hasOwnProperty(key)) {
                const element = fieldData[key];
                var finalSerie = {
                    name: element.name,
                    data: element.values,
                };
                finalSeries.push(finalSerie);
            }
        }
        return finalSeries;
    }
}
class PayPalSubscription {
    constructor(url, id) {
        this.url = url;
        this.id = id;
    }
    getURL() {
        return this.url;
    }
    getID() {
        return this.id;
    }
    static fromJSON(json) {
        return new PayPalSubscription(json.url, json.id);
    }
}
class StripeSubscription {
    constructor(id) {
        this.id = id;
    }
    getID() {
        return this.id;
    }
    static fromJSON(json) {
        return new StripeSubscription(json.id);
    }
}
class CacheCollection {
    constructor(instanceCaches, uuidAssociation, socketAssociation) {
        if (instanceCaches != null) {
            this.instanceCaches = instanceCaches;
        }
        else {
            this.instanceCaches = new Array();
        }
        if (uuidAssociation != null) {
            this.uuidAssociation = uuidAssociation;
        }
        else {
            this.uuidAssociation = {};
        }
        if (socketAssociation != null) {
            this.socketAssociation = socketAssociation;
        }
        else {
            this.socketAssociation = {};
        }
    }
    // CONNECTION AND DISCONNECT
    disconnect(socketId) {
        if (this.getCacheBySocket(socketId) != null) {
            this.removeCache(this.getCacheBySocket(socketId).createdOn.getTime());
        }
    }
    connect(socketId, keyStr) {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials = new Core(keyStr);
            return yield credentials
                .getLegacyKey()
                .update()
                .then((keyData) => {
                let cache = new InstanceCache(credentials, keyData.instance);
                this.socketAssociation[socketId] = cache.createdOn.getTime();
                if (!(cache.instance.uuid in this.uuidAssociation)) {
                    this.uuidAssociation[cache.instance.uuid] = [];
                }
                this.uuidAssociation[cache.instance.uuid].push(cache.createdOn.getTime());
                this.instanceCaches.push(cache);
                return true;
            });
        });
    }
    // DATA REMOVAL
    removeCache(epoch) {
        let cache = this.getCacheByEpoch(epoch);
        cache.flush();
        // remove assoc (sockets)
        var socketIdsToRemove = [];
        for (const key in this.socketAssociation) {
            if (this.socketAssociation.hasOwnProperty(key)) {
                const element = this.socketAssociation[key];
                if (element.createdOn == epoch) {
                    socketIdsToRemove.push(key);
                }
            }
        }
        socketIdsToRemove.forEach((socketId) => {
            delete this.socketAssociation[socketId];
        });
        // remove assoc (instance ids)
        var newAssoc = this.uuidAssociation[cache.instance.uuid].filter(function (item) {
            return item !== epoch;
        });
        if (newAssoc.length == 0) {
            delete this.uuidAssociation[cache.instance.uuid];
        }
        else {
            this.uuidAssociation[cache.instance.uuid] = newAssoc;
        }
    }
    // DATA QUERY
    getCacheByEpoch(epoch) {
        var value = null;
        this.instanceCaches.forEach((instanceCache) => {
            if (instanceCache.createdOn.getTime() == epoch) {
                value = instanceCache;
            }
        });
        return value;
    }
    getCacheBySocket(socketId) {
        return this.getCacheByEpoch(this.socketAssociation[socketId]);
    }
    getCachesByInstance(instance) {
        var cacheList = new Array();
        this.uuidAssociation[instance.uuid].forEach((epoch) => {
            var cache = this.getCacheByEpoch(epoch);
            if (cache != null) {
                cacheList.push(cache);
            }
        });
        return cacheList;
    }
}
class InstanceCache extends Core {
    constructor(credentials, instance, skipFill = false, consoleLines, instanceVitals, instanceConnections, createdOn) {
        super(credentials.getTool());
        // ensure valid credentials on the instance object
        var securedInstance = instance;
        securedInstance.core = credentials;
        this.instance = securedInstance;
        // check optional values
        if (consoleLines != null) {
            this.consoleLines = consoleLines;
        }
        else {
            this.consoleLines = new Array();
        }
        if (instanceVitals != null) {
            this.instanceVitals = instanceVitals;
        }
        else {
            this.instanceVitals = new Array();
        }
        if (instanceConnections != null) {
            this.connections = instanceConnections;
        }
        else {
            this.connections = new Array();
        }
        if (createdOn != null) {
            this.createdOn = createdOn;
        }
        else {
            this.createdOn = new Date();
        }
        if (!skipFill) {
            this.update();
        }
    }
    createLine(string) {
        new ConsoleLine(new Date(), LineType.INFO, string);
    }
    connectPlayer(ip, uuid, username) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var player = new Player(this.instance.core, null, username, uuid);
            return yield player
                .openConnection(ip, this.instance)
                .then(function (connection) {
                main.pushConnection(connection);
                return connection;
            });
        });
    }
    disconnectPlayer(uuid, username) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var player = new Player(this.instance.core, null, username, uuid, false);
            return yield player
                .closeConnections(this.instance)
                .then(function (closedConnections) {
                var newConnections = new Array();
                main.connections.forEach((connection) => {
                    var match = false;
                    closedConnections.forEach((closedConnection) => {
                        if (connection.uuid == closedConnection.uuid) {
                            match = true;
                        }
                    });
                    if (!match) {
                        newConnections.push(connection);
                    }
                });
                main.connections = newConnections;
                return closedConnections;
            });
        });
    }
    pushConnection(connection) {
        this.connections.push(connection);
    }
    pushLine(consoleLine) {
        this.consoleLines.push(consoleLine);
    }
    pushVital(instanceVital) {
        this.instanceVitals.push(instanceVital);
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            // updates data from the instance if it hasn't been pushed before
            let main = this;
            /*return await this.instance
              .getOpenConnections()
              .then(function (connections) {
                main.connections = connections;
              });*/
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return yield this.instance.closeOpenConnections().then(function () {
                main.connections = new Array();
                main.consoleLines = new Array();
                main.instanceVitals = new Array();
            });
        });
    }
}
class Call extends Core {
    constructor(core) {
        super(core.getTool(), core.dev);
        this.core = core;
        if (core.dev) {
            this.baseURL = "http://localhost/rest/2";
        }
        else {
            this.baseURL = "https://api.purecore.io/rest/2";
        }
    }
    commit(args, endpoint, request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args == null)
                args = {};
            if (request == null)
                request = { method: "POST" };
            if (this.core.getCoreSession() != null) {
                args.hash = this.core.getCoreSession().getHash();
            }
            else if (this.core.getKey() != null) {
                args.key = this.core.getKey();
            }
            const url = this.baseURL + Call.formatEndpoint(endpoint) + "?" + Object.keys(args)
                .filter(key => args.hasOwnProperty(key))
                .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(args[key]))
                .join("&");
            if (this.core.dev)
                console.log("Fetching: " + url);
            return new Promise((resolve, reject) => {
                return fetch(url, request)
                    .then((response) => response.json())
                    .then((response) => {
                    if ("error" in response) {
                        throw new Error(response.error + ". " + response.msg);
                    }
                    else {
                        resolve(response);
                    }
                })
                    .catch(error => reject(error.message));
            });
        });
    }
    static formatEndpoint(endpoint) {
        return (endpoint.startsWith('/') ? '' : '/') + endpoint + (endpoint.endsWith('/') ? '' : '/');
    }
}
class Command {
    constructor(id, command, network) {
        this.id = id;
        this.command = command;
        this.network = network;
    }
    getId() {
        return this.id;
    }
    getCommand() {
        return this.command;
    }
    getNetwork() {
        return this.network;
    }
    static fromJSON(network, json) {
        return new Command(json.cmdId, json.cmdString, network);
    }
}
class ActivityMatch {
    constructor(startedOn, finishedOn, activity, matchList) {
        this.startedOn = startedOn;
        this.finishedOn = finishedOn;
        this.activity = activity;
        this.matchList = matchList;
    }
    getStart() {
        return this.startedOn;
    }
    getFinish() {
        return this.finishedOn;
    }
    getActivity() {
        return this.activity;
    }
    getMatchList() {
        return this.matchList;
    }
    static fromJSON(json) {
        return new ActivityMatch(new Date(json.startedOn * 1000), new Date(json.finishedOn * 1000), json.activity, json.matchList.map(matchingRange => new MatchingRange(new Date(matchingRange.startedOn * 1000), new Date(matchingRange.finishedOn * 1000), matchingRange.matchWith)));
    }
}
class Connection extends Core {
    constructor(core, player, instance, location, status, uuid) {
        super(core.getTool());
        this.core = core;
        this.player = player;
        this.instance = instance;
        this.location = location;
        this.status = status;
        this.uuid = uuid;
    }
    getPlayer() {
        return this.player;
    }
    getInstance() {
        return this.instance;
    }
    getLocation() {
        return this.location;
    }
    getStatus() {
        return this.status;
    }
    getId() {
        return this.uuid;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.player = Player.fromJSON(this.core, array.player);
        this.instance = Instance.fromJSON(this.core, array.instance);
        this.location = ConnectionLocation.fromJSON(array.location);
        this.status = ConnectionStatus.fromJSON(array.status);
        this.uuid = array.uuid;
        return this;
    }
    static fromJSON(core, json) {
        return new Connection(core, Player.fromJSON(core, json.player), Instance.fromJSON(core, json.instance), ConnectionLocation.fromJSON(json.location), ConnectionStatus.fromJSON(json.status));
    }
}
class ConnectionHash extends Core {
    constructor(core, network, uuid, hash, player) {
        super(core.getKey());
        this.core = core;
        this.network = network;
        this.uuid = uuid;
        this.hash = hash;
        this.player = player;
    }
    getPlayer() {
        return this.player;
    }
    getHash() {
        return this.hash;
    }
    getNetwork() {
        return this.network;
    }
    getId() {
        return this.uuid;
    }
    requestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ hash: this.hash }, "session/hash/token/")
                .then(json => {
                return new SessionRequest(this.core, json.uuid, json.token, json.validated, Player.fromJSON(this.core, json.player), Network.fromJSON(this.core, json.network), "player");
            });
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.network = Network.fromJSON(this.core, array.network);
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.player = Player.fromJSON(this.core, array.player);
        return this;
    }
    static fromJSON(core, json) {
        return new ConnectionHash(core, Network.fromJSON(core, json.network), json.uuid, json.hash, Player.fromJSON(core, json.player));
    }
}
class ConnectionHashGlobal extends Core {
    constructor(core, hash, player) {
        super(core.getKey());
        this.core = core;
        this.hash = hash;
        this.player = player;
    }
    getPlayer() {
        return this.player;
    }
    getHash() {
        return this.hash;
    }
    requestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ hash: this.hash }, "session/hash/token/")
                .then(json => {
                if (this.core.getTool() != null) {
                    return SessionRequest.fromJSON(this.core, json);
                }
                else {
                    return new SessionRequest(this.core, json.uuid, json.token, json.validated, Player.fromJSON(this.core, json.player), null, "masterplayer");
                }
            });
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.hash = array.hash;
        this.player = Player.fromJSON(this.core, array.player);
        return this;
    }
    static fromJSON(core, json) {
        return new ConnectionHashGlobal(core, json.hash, Player.fromJSON(core, json.player));
    }
}
class ConnectionLocation {
    constructor(city, region, country, lat, long) {
        this.city = city;
        this.region = region;
        this.country = country;
        this.lat = lat;
        this.long = long;
    }
    getCity() {
        return this.city;
    }
    getRegion() {
        return this.region;
    }
    getCountry() {
        return this.country;
    }
    getLat() {
        return this.lat;
    }
    getLong() {
        return this.long;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.city = array.city;
        this.region = array.region;
        this.country = array.country;
        this.lat = array.lat;
        this.long = array.long;
        return this;
    }
    static fromJSON(json) {
        return new ConnectionLocation(json.city, json.region, json.country, json.lat, json.long);
    }
}
class ConnectionStatus {
    constructor(openedOn, closedOn) {
        this.openedOn = openedOn;
        this.closedOn = closedOn;
    }
    getOpenedOn() {
        return this.openedOn;
    }
    isActive() {
        return this.closedOn == undefined;
    }
    isClosed() {
        return !this.isActive();
    }
    getClosedOn() {
        return this.closedOn;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.openedOn = new Date(array.openedOn * 1000);
        this.closedOn = new Date(array.closedOn * 1000);
        return this;
    }
    static fromJSON(json) {
        return new ConnectionStatus(new Date(json.openedOn * 1000), json.closedOn == null ? null : new Date(json.closedOn * 1000));
    }
}
class MatchingRange {
    constructor(startedOn, finishedOn, matchWith) {
        this.startedOn = startedOn;
        this.finishedOn = finishedOn;
        this.matchWith = matchWith;
    }
    getStart() {
        return this.startedOn;
    }
    getFinish() {
        return this.finishedOn;
    }
    getMatchWith() {
        return this.matchWith;
    }
}
var Service;
(function (Service) {
    Service[Service["MINECRAFT"] = 0] = "MINECRAFT";
})(Service || (Service = {}));
class InstanceConsole {
}
class ConsoleLine {
    constructor(date, type, message) {
        this.date = date;
        this.type = type;
        this.message = message;
    }
    getDate() {
        return this.date;
    }
    getType() {
        return this.type;
    }
    getMessage() {
        return this.message;
    }
}
var LineType;
(function (LineType) {
    LineType[LineType["INFO"] = 0] = "INFO";
    LineType[LineType["WARNING"] = 1] = "WARNING";
    LineType[LineType["ERROR"] = 2] = "ERROR";
})(LineType || (LineType = {}));
class DiscordGuild {
    constructor(network, name, uuid, memberCount) {
        this.network = network;
        this.name = name;
        this.uuid = uuid;
        this.memberCount = memberCount;
    }
    getNetwork() {
        return this.network;
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.uuid;
    }
    getMemberCount() {
        return this.memberCount;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.name = array.name;
        this.uuid = array.uuid;
        this.memberCount = array.memberCount;
        return this;
    }
    static fromJSON(network, json) {
        return new DiscordGuild(network, json.name, json.uuid, json.memberCount);
    }
}
class CheckoutElement extends Core {
    constructor(core, products, successFunction) {
        super(core.getKey());
        this.core = core;
        this.products = products;
        document.addEventListener("paymentSuccess", successFunction);
    }
    getJSON() {
        return JSON.stringify(this.products.map(product => product.getId()));
    }
    loadInto(selector) {
        /*
        $.getScript("https://js.stripe.com/v3/", (
            data,
            textStatus,
            jqxhr
        ) => {
            $(selector).load(
                "https://api.purecore.io/rest/2/element/checkout/?key=" +
                this.core +
                "&items=" +
                this.getJSON()
            );
        });*/
    }
}
class Elements extends Core {
    constructor(core) {
        super(core.getKey());
        this.core = core;
    }
    getCheckoutElement(products, successFunction) {
        return new CheckoutElement(this.core, products, successFunction);
    }
}
class ForumCategory extends Core {
    constructor(core, uuid, name, description, network, section) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.section = section;
    }
    getPosts(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return new Call(this.core)
                .commit({
                category: this.uuid,
                page: page.toString(),
            }, "forum/get/post/list/")
                .then(json => json.map(post => ForumPost.fromJSON(this.core, post)));
        });
    }
    createPost(title, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                category: this.uuid,
                title: title,
                content: escape(content),
            }, "forum/create/post/")
                .then(json => ForumPost.fromJSON(this.core, json));
        });
    }
    getId() {
        return this.uuid;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getNetwork() {
        return this.network;
    }
    getSelection() {
        return this.section;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = Network.fromJSON(this.core, array.network);
        this.section = ForumSection.fromJSON(this.core, array.session);
        return this;
    }
    static fromJSON(core, json) {
        return new ForumCategory(core, json.uuid, json.name, json.description, Network.fromJSON(core, json.network), ForumSection.fromJSON(core, json.session));
    }
}
class Forum {
    constructor(network) {
        this.network = network;
    }
    getSections() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.network.core)
                .commit({ network: this.network.uuid }, "forum/get/section/list/")
                .then(json => json.map(section => ForumSection.fromJSON(this.network.core, section)));
        });
    }
    getCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.network.core)
                .commit({ category: categoryId }, "forum/get/category/")
                .then(json => ForumCategory.fromJSON(this.network.core, json));
        });
    }
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.network.core)
                .commit({ post: postId }, "forum/get/post/")
                .then(json => ForumPost.fromJSON(this.network.core, json));
        });
    }
    createSection(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.network.core)
                .commit({
                network: this.network.uuid,
                name: name,
                description: description,
            }, "forum/create/section/")
                .then(json => ForumSection.fromJSON(this.network.core, json));
        });
    }
}
class ForumPost extends Core {
    constructor(core, uuid, title, content, player, open, network, category) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.title = title;
        this.content = content;
        this.player = player;
        this.open = open;
        this.network = network;
        this.category = category;
    }
    createReply(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                object: this.uuid,
                content: escape(content),
            }, "forum/create/reply/")
                .then(json => ForumReply.fromJSON(this.core, json));
        });
    }
    getReplies(page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return new Call(this.core)
                .commit({
                object: this.uuid,
                page: page.toString(),
            }, "forum/get/reply/list/")
                .then(json => json.map(reply => ForumReply.fromJSON(this.core, reply)));
        });
    }
    getId() {
        return this.uuid;
    }
    getTitle() {
        return this.title;
    }
    getContent() {
        return this.content;
    }
    getPlayer() {
        return this.player;
    }
    isOpen() {
        return this.open;
    }
    getNetwork() {
        return this.network;
    }
    getCategory() {
        return this.category;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.title = array.title;
        this.content = array.content;
        this.player = Player.fromJSON(this.core, array.player);
        this.open = array.open;
        this.network = Network.fromJSON(this.core, array.network);
        this.category = ForumCategory.fromJSON(this.core, array.category);
        return this;
    }
    static fromJSON(core, json) {
        return new ForumPost(core, json.uuid, json.title, json.content, Player.fromJSON(core, json.player), json.open, Network.fromJSON(core, json.network), ForumCategory.fromJSON(core, json.category));
    }
}
class ForumReply extends Core {
    constructor(core, uuid, content, player, network, replyingTo) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.content = content;
        this.player = player;
        this.network = network;
        this.replyingTo = replyingTo;
    }
    createReply(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                object: this.uuid,
                content: escape(content),
            }, "forum/create/reply/")
                .then(json => ForumReply.fromJSON(this.core, json));
        });
    }
    getReplies(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return new Call(this.core)
                .commit({
                object: this.uuid,
                page: page.toString(),
            }, "forum/get/reply/list/")
                .then(json => json.map(reply => ForumReply.fromJSON(this.core, reply)));
        });
    }
    getId() {
        return this.uuid;
    }
    getContent() {
        return this.content;
    }
    getPlayer() {
        return this.player;
    }
    getNetwork() {
        return this.network;
    }
    getReplyingTo() {
        return this.replyingTo;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.content = array.content;
        this.player = Player.fromJSON(this.core, array.player);
        this.network = Network.fromJSON(this.core, array.network);
        this.replyingTo = "title" in array.responseTo ? ForumPost.fromJSON(this.core, array.responseTo) :
            ForumReply.fromJSON(this.core, array.responseTo);
        return this;
    }
    static fromJSON(core, json) {
        return new ForumReply(core, json.uuid, json.content, Player.fromJSON(core, json.player), Network.fromJSON(core, json.network), "title" in json.responseTo ? ForumPost.fromJSON(core, json.responseTo) :
            ForumReply.fromJSON(core, json.responseTo));
    }
}
class ForumSection extends Core {
    constructor(core, uuid, name, description, network) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
    }
    getId() {
        return this.uuid;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getNetwork() {
        return this.network;
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ section: this.uuid }, "forum/get/category/list/")
                .then(json => json.map(category => ForumCategory.fromJSON(this.core, category)));
        });
    }
    createCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                section: this.uuid,
                name: name,
                description: description,
            }, "forum/create/category/")
                .then(json => ForumCategory.fromJSON(this.core, json));
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = Network.fromJSON(this.core, array.network);
        return this;
    }
    static fromJSON(core, json) {
        return new ForumSection(core, json.uuid, json.name, json.description, Network.fromJSON(core, json.network));
    }
}
class Instance extends Core {
    constructor(core, uuid, name, type) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.type = type;
    }
    closeOpenConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ instance: this.uuid }, "instance/connections/close/all/")
                .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
        });
    }
    getOpenConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ instance: this.uuid }, "instance/connections/open/list/")
                .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
        });
    }
    getGrowthAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                instance: this.uuid,
                span: span,
            }, "instance/growth/analytics/")
                .then(json => json.map(growthAnalytic => new GrowthAnalytic().fromArray(growthAnalytic)));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ instance: this.uuid }, "instance/delete/")
                .then(() => true); //TODO: process return
        });
    }
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ instance: this.uuid }, "instance/key/list/")
                .then(json => json.map(key => Key.fromJSON(this.core, key)));
        });
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.uuid;
    }
    getType() {
        return this.type;
    }
    asNetwork() {
        return new Network(this.core, this);
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ instance: this.uuid }, "instance/info/")
                .then(json => {
                if (json.server == null) {
                    this.type = "NTW";
                    this.uuid = json.network.uuid;
                    this.name = json.network.name;
                }
                else {
                    this.type = "SVR";
                    this.uuid = json.server.uuid;
                    this.name = json.server.name;
                }
                return this;
            });
        });
    }
    static fromJSON(core, json, type) {
        return new Instance(core, json.uuid, json.name, type == undefined ? "UNK" : type //TODO: check api calls for json.type
        );
    }
}
class InstanceVital {
}
class Network extends Core {
    constructor(core, instance) {
        super(core.getTool());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
    }
    getStore() {
        return new Store(this);
    }
    getForum() {
        return new Forum(this);
    }
    getId() {
        return this.uuid;
    }
    getDevKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "key/get/dev/")
                .then(json => Key.fromJSON(this.core, json));
        });
    }
    getKeyFromId(keyid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ keyid: keyid }, "key/from/id/")
                .then(json => Key.fromJSON(this.core, json));
        });
    }
    createServer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ name: name }, "instance/server/create/")
                .then(json => Instance.fromJSON(this.core, json, "SVR"));
        });
    }
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "instance/server/list/")
                .then(json => json.map(server => Instance.fromJSON(this.core, server, "SVR")));
        });
    }
    asInstance() {
        return new Instance(this.core, this.uuid, this.name, "NTW");
    }
    getVotingAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                span: span,
            }, "instance/network/voting/analytics/")
                .then(json => json.map(analytic => new VoteAnalytic().fromArray(analytic)));
        });
    }
    getVotingSites() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "instance/network/voting/site/list/")
                .then(json => json.map(site => VotingSite.fromJSON(this.core, site)));
        });
    }
    getSetupVotingSites(displaySetup = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "instance/network/voting/site/list/setup/" +
                (displaySetup ? "config" : ""))
                .then(json => displaySetup ? json.map(site => VotingSiteConfig.fromJSON(this.core, site)) :
                json.map(site => VotingSite.fromJSON(this.core, site)));
        });
    }
    getGuild() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "instance/network/discord/get/guild/")
                .then(json => DiscordGuild.fromJSON(this, json));
        });
    }
    setGuild(discordGuildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ guildid: discordGuildId }, "/instance/network/discord/setguild/")
                .then(() => true); //TODO: process response
        });
    }
    setSessionChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ channelid: channelId }, "instance/network/discord/setchannel/session/")
                .then(() => true); //TODO: process response
        });
    }
    setDonationChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ channelid: channelId }, "instance/network/discord/setchannel/donation/")
                .then(() => true); //TODO: process response
        });
    }
    getHashes() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({}, "session/hash/list/")
                .then(json => json.map(connection => ConnectionHash.fromJSON(this.core, connection)));
        });
    }
    getOffences() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "punishment/offence/list/")
                .then(json => json.map(offence => Offence.fromJSON(this.core, offence)));
        });
    }
    getOffenceActions() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "punishment/action/list/")
                .then(json => json.map(action => OffenceAction.fromJSON(this.core, action)));
        });
    }
    searchPlayers(username, uuid, coreid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                username: username,
            }, "player/from/minecraft/username/search/")
                .then(json => json.map(player => Player.fromJSON(this.core, player)));
        });
    }
    getPlayer(coreid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ player: coreid }, "player/from/core/id/")
                .then(json => Player.fromJSON(this.core, json));
        });
    }
    getPlayers(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                page: page,
            }, "instance/network/list/players/")
                .then(json => json.map(player => Player.fromJSON(this.core, player)));
        });
    }
    getPunishments(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                page: page,
            }, "punishment/list/")
                .then(json => json.map(punishment => Punishment.fromJSON(this.core, punishment)));
        });
    }
    static fromJSON(core, json) {
        return new Network(core, new Instance(core, json.uuid, json.name, "NTW"));
    }
}
class GeoRestriction {
    constructor(index, country, state, city) {
        this.index = index;
        this.country = country;
        this.state = state;
        this.city = city;
    }
    getIndex() {
        return this.index;
    }
    getCountry() {
        return this.country;
    }
    getState() {
        return this.state;
    }
    getCity() {
        return this.city;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.index = array.index;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        return this;
    }
    static fromJSON(json) {
        return new GeoRestriction(json.index, json.country, json.state, json.city);
    }
}
class Key extends Core {
    constructor(core, type, uuid, hash, instance, restrict, allowedReferrers, allowedRegions) {
        super(core.getTool());
        this.core = core;
        this.type = type;
        this.uuid = uuid;
        this.hash = hash;
        this.instance = instance;
    }
    getType() {
        return this.type;
    }
    getId() {
        return this.uuid;
    }
    getHash() {
        return this.hash;
    }
    getInstance() {
        return this.instance;
    }
    isRestricted() {
        return this.restrict;
    }
    getAllowedReferrers() {
        return this.allowedReferrers;
    }
    getAllowedRegions() {
        return this.allowedRegions;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
            }, "key/from/id/")
                .then(json => Key.fromJSON(this.core, json));
        });
    }
    setRestrict(restrict) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                enable: restrict,
            }, "key/restriction/enable/")
                .then(json => Key.fromJSON(this.core, json));
        });
    }
    addReferer(ipOrHostname) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                host: ipOrHostname,
            }, "key/restriction/host/add/")
                .then(json => RefererRestriction.fromJSON(json));
        });
    }
    removeReferer(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                index: index,
            }, "restriction/host/remove/")
                .then(json => RefererRestriction.fromJSON(json));
        });
    }
    addGeo(country, state, city) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {};
            args["keyid"] = this.uuid;
            args["country"] = country;
            if (state != null)
                args["state"] = state;
            if (city != null)
                args["city"] = city;
            return new Call(this.core)
                .commit(args, "restriction/geo/add/")
                .then(json => GeoRestriction.fromJSON(json));
        });
    }
    removeGeo(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                index: index,
            }, "key/restriction/geo/remove/")
                .then(json => GeoRestriction.fromJSON(json));
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.type = array.type;
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        this.restrict = array.restrict;
        this.allowedReferrers = array.allowedReferrers.map(RefererRestriction.fromJSON);
        this.allowedRegions = array.allowedRegions.map(GeoRestriction.fromJSON);
        return this;
    }
    static fromJSON(core, json) {
        return new Key(core, json.type, json.uuid, json.hash, new Instance(core, json.instance.uuid, json.instance.name, json.instance.type), json.restrict, json.allowedReferrers.map(RefererRestriction.fromJSON), json.allowedRegions.map(GeoRestriction.fromJSON));
    }
}
class RefererRestriction {
    constructor(index, domain, ip) {
        this.index = index;
        this.domain = domain;
        this.ip = ip;
    }
    getIndex() {
        return this.index;
    }
    getDomain() {
        return this.domain;
    }
    getIP() {
        return this.ip;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.index = array.index;
        this.domain = array.domain;
        this.ip = array.ip;
        return this;
    }
    static fromJSON(json) {
        return new RefererRestriction(json.index, json.domain, json.ip);
    }
}
class BIOS {
    constructor(vendor, version) {
        this.vendor = vendor;
        this.version = version;
    }
    asArray() {
        return {
            vendor: this.vendor,
            version: this.version
        };
    }
    getVendor() {
        return this.vendor;
    }
    getVersion() {
        return this.version;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.vendor = array.vendor;
        this.version = array.version;
        return this;
    }
    static fromJSON(json) {
        return new BIOS(json.vendor, json.version);
    }
}
class CPU {
    constructor(manufacturer, brand, vendor, speed, maxSpeed, physicalCores, virtualCores) {
        this.manufacturer = manufacturer;
        this.brand = brand;
        this.vendor = vendor;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.physicalCores = physicalCores;
        this.virtualCores = virtualCores;
    }
    getManufacturer() {
        return this.manufacturer;
    }
    getBrand() {
        return this.brand;
    }
    getVendor() {
        return this.vendor;
    }
    getSpeed() {
        return this.speed;
    }
    getMaxSpeed() {
        return this.maxSpeed;
    }
    getPhysicalCores() {
        return this.physicalCores;
    }
    getVirtualCores() {
        return this.virtualCores;
    }
    asArray() {
        return {
            manufacturer: this.manufacturer,
            brand: this.brand,
            vendor: this.vendor,
            speed: this.speed,
            maxSpeed: this.maxSpeed,
            physicalCores: this.physicalCores,
            virtualCores: this.virtualCores,
        };
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.manufacturer = array.manufacturer;
        this.brand = array.brand;
        this.vendor = array.vendor;
        this.speed = array.speed;
        this.maxSpeed = array.maxSpeed;
        this.physicalCores = array.physicalCores;
        this.virtualCores = array.virtualCores;
        return this;
    }
    static fromJSON(json) {
        return new CPU(json.manufacturer, json.brand, json.vendor, json.speed, json.maxSpeed, json.physicalCores, json.virtualCores);
    }
}
class CPUUsage {
    constructor(clockSpeed, relativeUsage, mainThreadSlip) {
        this.clockSpeed = clockSpeed;
        this.relativeUsage = relativeUsage;
        this.mainThreadSlip = mainThreadSlip;
    }
    getClockSpeed() {
        return this.clockSpeed;
    }
    getRelativeUsage() {
        return this.relativeUsage;
    }
    getMainThreadSlip() {
        return this.mainThreadSlip;
    }
}
class Drive {
    constructor(size, name, type, interfaceType, serialNum) {
        this.size = size;
        this.name = name;
        this.type = type;
        this.interfaceType = interfaceType;
        this.serialNum = serialNum;
    }
    getSize() {
        return this.size;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getInterfaceType() {
        return this.interfaceType;
    }
    getSerialNumber() {
        return this.serialNum;
    }
    asArray() {
        return {
            size: this.size,
            name: this.name,
            type: this.type,
            interfaceType: this.interfaceType,
            serialNum: this.serialNum,
        };
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.size = array.size;
        this.name = array.name;
        this.type = array.type;
        this.interfaceType = array.interfaceType;
        this.serialNum = array.serialNum;
        return this;
    }
    static fromJSON(json) {
        return new Drive(json.size, json.name, json.type, json.interfaceType, json.serialNum);
    }
}
class DriveUsage {
    constructor(max, used) {
        this.max = max;
        this.used = used;
    }
    getMax() {
        return this.max;
    }
    getUsed() {
        return this.used;
    }
}
class Machine {
    constructor(uuid, hash, owner, ipv4, ipv6, port, bios, motherboard, cpu, ram, drives, adapters) {
        this.uuid = uuid;
        this.hash = hash;
        this.owner = owner;
        this.ipv4 = ipv4;
        this.ipv6 = ipv6;
        this.port = port;
        this.bios = bios;
        this.motherboard = motherboard;
        this.cpu = cpu;
        this.ram = ram;
        this.drives = drives;
        this.adapters = adapters;
    }
    setIPV6(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(new Core(null, this.owner.core.dev))
                .commit({ ipv6: ip, hash: this.hash }, "machine/update/")
                .then(() => ip);
        });
    }
    setIPV4(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(new Core(null, this.owner.core.dev))
                .commit({ ipv4: ip, hash: this.hash }, "machine/update/")
                .then(() => ip);
        });
    }
    //TODO: si better name and type
    updateComponents(si, bios, motherboard, cpu, ram, drives, adapters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (si != null) {
                bios = BIOS.fromJSON(si.bios);
                motherboard = Motherboard.fromJSON(si.baseboard);
                cpu = CPU.fromJSON(si.cpu);
                ram = si.memLayout.map(RAM.fromJSON);
                drives = si.diskLayout.map(Drive.fromJSON);
                adapters = si.net.map(NetworkAdapter.fromJSON);
            }
            let params = {};
            if (bios != null) {
                this.bios = bios;
                params["bios"] = JSON.stringify(bios.asArray());
            }
            if (motherboard != null) {
                this.motherboard = motherboard;
                params["motherboard"] = JSON.stringify(motherboard.asArray());
            }
            if (cpu != null) {
                this.cpu = cpu;
                params["cpu"] = JSON.stringify(cpu.asArray());
            }
            if (ram != null) {
                this.ram = ram;
                params["ram"] = JSON.stringify(ram.map(stick => stick.asArray()));
            }
            if (drives != null) {
                this.drives = drives;
                params["drives"] = JSON.stringify(drives.map(drives => drives.asArray()));
            }
            if (adapters != null) {
                this.adapters = adapters;
                params["adapters"] = JSON.stringify(adapters.map(adapter => adapter.asArray()));
            }
            params["hash"] = this.hash;
            return yield new Call(new Core(null, this.owner.core.dev))
                .commit(params, "machine/update/")
                .then(() => this);
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.owner = Owner.fromJSON(new Core(), array); //TODO: new Core()?
        this.ipv4 = array.ipv4;
        this.ipv6 = array.ipv6;
        this.port = array.port;
        this.bios = BIOS.fromJSON(array.bios);
        this.motherboard = Motherboard.fromJSON(array.motherboard);
        this.cpu = CPU.fromJSON(array.cpu);
        this.ram = array.ram.map(RAM.fromJSON);
        this.drives = array.drives.map(Drive.fromJSON);
        this.adapters = array.adapters.map(NetworkAdapter.fromJSON);
        return this;
    }
    static fromJSON(json) {
        return new Machine(json.uuid, json.hash, Owner.fromJSON(new Core(), json), json.ipv4, json.ipv6, json.port, BIOS.fromJSON(json.bios), Motherboard.fromJSON(json.motherboard), CPU.fromJSON(json.cpu), json.ram.map(RAM.fromJSON), json.drives.map(Drive.fromJSON), json.adapters.map(NetworkAdapter.fromJSON));
    }
}
class Motherboard {
    constructor(manufacturer, model) {
        this.manufacturer = manufacturer;
        this.model = model;
    }
    getManufacturer() {
        return this.manufacturer;
    }
    getModel() {
        return this.model;
    }
    asArray() {
        return {
            manufacturer: this.manufacturer,
            model: this.model
        };
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.manufacturer = array.manufacturer;
        this.model = array.model;
        return this;
    }
    static fromJSON(json) {
        return new Motherboard(json.manufacturer, json.model);
    }
}
class NetworkAdapter {
    constructor(speed, name) {
        this.speed = speed;
        this.name = name;
    }
    getSpeed() {
        return this.speed;
    }
    getName() {
        return this.name;
    }
    asArray() {
        return {
            speed: this.speed,
            name: this.name
        };
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.speed = array.speed;
        this.name = array.name;
        return this;
    }
    static fromJSON(json) {
        return new NetworkAdapter(json.speed, json.name);
    }
}
class RAM {
    constructor(size, clockSpeed, manufacturer, voltage) {
        this.size = size;
        this.clockSpeed = clockSpeed;
        this.manufacturer = manufacturer;
        this.voltage = voltage;
    }
    getSize() {
        return this.size;
    }
    getClockSpeed() {
        return this.clockSpeed;
    }
    getManufacturer() {
        return this.manufacturer;
    }
    getVoltage() {
        return this.voltage;
    }
    asArray() {
        return {
            size: this.size,
            clockSpeed: this.clockSpeed,
            manufacturer: this.manufacturer,
            voltage: this.voltage,
        };
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.size = array.size;
        this.clockSpeed = array.clockSpeed;
        this.manufacturer = array.manufacturer;
        this.voltage = array.voltage;
        return this;
    }
    static fromJSON(json) {
        return new RAM(json.size, json.clockSpeed, json.manufacturer, json.voltage);
    }
}
class RAMUsage {
    constructor(max, used) {
        this.max = max;
        this.used = used;
    }
    getMax() {
        return this.max;
    }
    getUsed() {
        return this.used;
    }
}
class Appeal extends Core {
    constructor(core, uuid, punishment, content, staffResponse, staffMember, accepted) {
        super(core.getTool());
        this.uuid = uuid;
        this.punishment = punishment;
        this.content = content;
        this.staffResponse = staffResponse;
        this.staffMember = staffMember;
        this.accepted = accepted;
    }
    getId() {
        return this.uuid;
    }
    getPunishment() {
        return this.punishment;
    }
    getContext() {
        return this.content;
    }
    getStaffResponse() {
        return this.staffResponse;
    }
    getStaffMember() {
        return this.staffMember;
    }
    isAccepted() {
        return this.accepted;
    }
}
class AppealStatus extends Core {
    constructor(core, status, appealId) {
        super(core.getTool());
        this.status = status;
        this.appealId = appealId;
    }
    getAppeal() {
        //TODO: appeal fetching
    }
    getStatus() {
        return this.status;
    }
    getAppealId() {
        return this.appealId;
    }
    toString() {
        return this.status;
    }
    static fromJSON(core, json) {
        return new AppealStatus(core, json.status, json.appealId);
    }
}
class Offence extends Core {
    constructor(core, uuid, type, network, name, description, negativePoints) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.type = type;
        this.network = network;
        this.name = name;
        this.description = description;
        this.negativePoints = negativePoints;
    }
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getNegativePoints() {
        return this.negativePoints;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.type = array.type;
        this.network = Network.fromJSON(this.core, array.network);
        this.name = array.name;
        this.description = array.description;
        this.negativePoints = parseInt(array.negativePoints);
        return this;
    }
    static fromJSON(core, json) {
        return new Offence(core, json.uuid, json.type, Network.fromJSON(core, json.network), json.name, json.description, parseInt(json.negativePoints));
    }
}
class OffenceAction extends Core {
    constructor(core, uuid, cmd, requiredPoints, network, pointsType, punishmentType, name, description) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.cmd = cmd;
        this.requiredPoints = requiredPoints;
        this.network = network;
        this.pointsType = pointsType;
        this.punishmentType = punishmentType;
        this.name = name;
        this.description = description;
    }
    getId() {
        return this.uuid;
    }
    getCommand() {
        return this.cmd;
    }
    getRequiredPoints() {
        return this.requiredPoints;
    }
    getNetwork() {
        return this.network;
    }
    getPointsType() {
        return this.pointsType;
    }
    getPunishmentType() {
        return this.punishmentType;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.network = Network.fromJSON(this.core, array.network);
        this.cmd = new Command(array.cmd.cmdId, array.cmd.cmdString, this.network);
        this.requiredPoints = parseInt(array.requiredPoints);
        this.pointsType = array.pointsType;
        this.punishmentType = array.punishmentType;
        this.name = array.name;
        this.description = array.description;
        return this;
    }
    static fromJSON(core, json) {
        const network = Network.fromJSON(core, json.network);
        return new OffenceAction(core, json.uuid, Command.fromJSON(network, json.cmd), parseInt(json.requiredPoints), network, json.pointsType, json.punishmentType, json.name, json.description);
    }
}
class Punishment extends Core {
    constructor(core, uuid, player, offenceList, moderator, network, pointsChat, pointsGameplay, report, notes, appealStatus) {
        super(core.getTool());
        this.core = core;
        this.player = player;
        this.offenceList = offenceList;
        this.moderator = moderator;
        this.network = network;
        this.pointsChat = pointsChat;
        this.pointsGameplay = pointsGameplay;
        this.report = report;
        this.notes = notes;
        this.appealStatus = appealStatus;
    }
    getId() {
        return this.uuid;
    }
    getPlayer() {
        return this.player;
    }
    getOffenceList() {
        return this.offenceList;
    }
    getModerator() {
        return this.moderator;
    }
    getNetwork() {
        return this.network;
    }
    getPointsChat() {
        return this.pointsChat;
    }
    getPointsGameplay() {
        return this.pointsGameplay;
    }
    getReport() {
        return this.report;
    }
    getNotes() {
        return this.notes;
    }
    getAppealStatus() {
        return this.appealStatus;
    }
    getPoints(type) {
        if (type === "GMT") {
            return this.pointsGameplay;
        }
        else if (type === "CHT") {
            return this.pointsChat;
        }
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.player = Player.fromJSON(this.core, array.player);
        this.offenceList = array.offenceList.map(offence => Offence.fromJSON(this.core, offence));
        this.moderator = Player.fromJSON(this.core, array.createdBy);
        this.network = Network.fromJSON(this.core, array.network);
        this.pointsChat = array.pointsAddedChat;
        this.pointsGameplay = array.pointsAddedGameplay;
        if (array.report == null) {
            this.report = null;
        }
        else {
            // to-do: report implementation
        }
        this.appealStatus = AppealStatus.fromJSON(this.core, array.appealStatus);
        return this;
    }
    static fromJSON(core, json) {
        return new Punishment(core, json.uuid, Player.fromJSON(core, json.player), json.offenceList.map(offence => Offence.fromJSON(core, offence)), Player.fromJSON(core, json.createdBy), Network.fromJSON(core, json.network), json.pointsAddedChat, json.pointsAddedGameplay, null, //TODO: report
        json.notes, AppealStatus.fromJSON(core, json.appealStatus));
    }
}
class Report {
    constructor(parameters) {
    }
}
class Session extends Core {
    constructor(core, uuid, hash, device, location, usage, network, user) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.hash = hash;
        this.device = device;
        this.location = location;
        this.usage = usage;
        this.network = network;
        if (user instanceof Player) {
            this.player = user;
        }
        else if (user instanceof Owner) {
            this.owner = user;
        }
        this.user = user;
    }
    getUser() {
        return this.user;
    }
    fromHash(sessionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({ hash: sessionHash }, "session/get/")
                .then(json => new Session(this.core).fromArray(json));
        });
    }
    getId() {
        return this.uuid;
    }
    getHash() {
        return this.hash;
    }
    getPlayer() {
        return this.player;
    }
    getMachines() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({ hash: this.getHash() }, "machine/list/")
                .then(json => json.map(machine => new Machine().fromArray(machine)));
        });
    }
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "instance/network/list/")
                .then(json => json.map(network => Network.fromJSON(this.core, network)));
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.device = SessionDevice.fromJSON(array.device);
        this.location = SessionLocation.fromJSON(array.location);
        this.usage = SessionUsage.fromJSON(array.usage);
        if ("network" in array) {
            this.network = Network.fromJSON(this.core, array.network);
            this.core = new Core(this, this.core.dev);
        }
        else {
            this.core = new Core(this, this.core.dev);
        }
        if ("player" in array) {
            this.player = Player.fromJSON(this.core, array.player);
        }
        else if ("owner" in array) {
            this.owner = Owner.fromJSON(this.core, array.owner);
        }
        return this;
    }
    static fromJSON(core, json) {
        return new Session(core, json.uuid, json.hash, SessionDevice.fromJSON(json.device), SessionLocation.fromJSON(json.location), SessionUsage.fromJSON(json.usage), "network" in json ? Network.fromJSON(core, json.network) : null, "player" in json ? Player.fromJSON(core, json.network) : Owner.fromJSON(core, json.owner));
    }
}
class SessionDevice {
    constructor(brand, device, model, os) {
        this.brand = brand;
        this.device = device;
        this.model = model;
        this.os = os;
    }
    getBrand() {
        return this.brand;
    }
    getDevice() {
        return this.device;
    }
    getModel() {
        return this.model;
    }
    getOs() {
        return this.os;
    }
    static fromJSON(json) {
        return new SessionDevice(json.brand, json.device, json.model, json.os);
    }
}
class SessionLocation {
    constructor(city, state, country_code) {
        this.city = city;
        this.state = state;
        this.country_code = country_code;
    }
    getCity() {
        return this.city;
    }
    getState() {
        return this.state;
    }
    getCountry() {
        return this.country_code;
    }
    getOs() {
        return this.os;
    }
    static fromJSON(json) {
        return new SessionLocation(json.city, json.state, json.country_code);
    }
}
class SessionRequest extends Core {
    constructor(core, uuid, token, validated, player, network, type) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.token = token;
        this.validated = validated;
        this.player = player;
        this.network = network;
        this.type = type;
    }
    isValidated() {
        return this.validated;
    }
    getValidationUrl() {
        return `https://api.purecore.io/link/discord/redirect/?uuid=${this.uuid}&hash=${this.token};`;
    }
    getToken() {
        return this.token;
    }
    getSession() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({ token: this.token }, "session/hash/token/exchange/")
                .then(json => new Session(this.core).fromArray(json));
        });
    }
    static fromJSON(core, json) {
        return new SessionRequest(core, json.uuid, json.token, json.validated, Player.fromJSON(core, json.player), Network.fromJSON(core, json.network), "player");
    }
}
class SessionUsage {
    constructor(creation, uses) {
        this.creation = creation;
        this.uses = uses;
    }
    getCreation() {
        return this.creation;
    }
    getUses() {
        return this.uses;
    }
    static fromJSON(json) {
        return new SessionUsage(json.creation, json.uses);
    }
}
class StoreCategory extends Core {
    constructor(core, uuid, name, description, network, upgradable) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }
    createItem(name, description, price) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.network.uuid,
                name: name,
                description: description,
                category: this.uuid,
                price: price,
            }, "store/item/create/")
                .then(item => StoreItem.fromJSON(this.core, item));
        });
    }
    getId() {
        return this.uuid;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getNetwork() {
        return this.network;
    }
    isUpgradable() {
        return this.upgradable;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = Network.fromJSON(this.core, array.network);
        this.upgradable = array.upgradable;
        return this;
    }
    static fromJSON(core, json) {
        return new StoreCategory(core, json.uuid, json.name, json.description, Network.fromJSON(core, json.network), json.upgradable);
    }
}
class StoreItem extends Core {
    constructor(core, uuid, name, description, category, network, price, contextualizedPerks) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = contextualizedPerks;
    }
    addPerk(perk, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.network.uuid,
                item: this.uuid,
                perk: typeof perk == "string" ? perk : perk.getUuid(),
                quantity: quantity,
            }, "store/item/add/perk/")
                .then(json => PerkContextualized.fromJSON(this.core, json));
        });
    }
    getOrganizedPerks() {
        const perkOrganized = {};
        this.perks.forEach((perk) => {
            const uuid = perk.getPerk().getCategory().getId();
            if (uuid in perkOrganized) {
                perkOrganized[uuid].push(perk);
            }
            else {
                perkOrganized[uuid] = new Array();
                perkOrganized[uuid].push(perk);
            }
        });
        return Object.keys(perkOrganized)
            .map(key => {
            let category = null;
            perkOrganized[key].forEach((conperk) => {
                if (conperk.perk.category.uuid == key) {
                    category = conperk.perk.category;
                }
            });
            return new OrganizedPerkCategory(category, perkOrganized[key]);
        });
    }
    getId() {
        return this.uuid;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getCategory() {
        return this.category;
    }
    getNetwork() {
        return this.network;
    }
    getPrice() {
        return this.price;
    }
    getPerks() {
        return this.perks;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.category = StoreCategory.fromJSON(this.core, array.category);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.price = array.price;
        if (array.perks != null) {
            this.perks = array.perks.map(perk => PerkContextualized.fromJSON(this.core, perk));
        }
        else {
            this.perks = new Array();
        }
        return this;
    }
    static fromJSON(core, json) {
        return new StoreItem(core, json.uuid, json.name, json.description, StoreCategory.fromJSON(core, json.category), Network.fromJSON(core, json.network), json.price, json.perks.map(perk => PerkContextualized.fromJSON(core, perk)));
    }
}
class NestedItem extends Core {
    constructor(core, uuid, items, category) {
        super(core.getTool());
        this.core = core;
    }
    getId() {
        return this.uuid;
    }
    getCategory() {
        return this.category;
    }
    getItems() {
        return this.items;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.category = StoreCategory.fromJSON(this.core, array.category);
        this.uuid = this.category.getId();
        this.items = array.products.map(product => StoreItem.fromJSON(this.core, product));
        return this;
    }
    static fromJSON(core, json) {
        const category = StoreCategory.fromJSON(core, json.category);
        return new NestedItem(core, category.getId(), json.products.map(product => StoreItem.fromJSON(core, product)), category);
    }
}
class OrganizedPerkCategory {
    constructor(category, perk) {
        this.perkCategory = category;
        this.perkList = perk;
    }
    getPerks() {
        return this.perkList;
    }
    getCategory() {
        return this.perkCategory;
    }
}
class Perk extends Core {
    constructor(core, uuid, network, name, description, type, category, commands) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
        this.commands = commands;
    }
    addCmd(cmd, needsOnline, executeOn) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = executeOn.map(instance => instance.uuid);
            return new Call(this.core)
                .commit({
                network: this.uuid,
                perk: this.uuid,
                cmd: cmd,
                needsOnline: needsOnline,
                instances: JSON.stringify(ids),
            }, "store/perk/cmd/add/")
                .then(json => json.map(command => StoreCommand.fromJSON(this.core, command)));
        });
    }
    getUuid() {
        return this.uuid;
    }
    getNetwork() {
        return this.network;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getType() {
        return this.type;
    }
    getCategory() {
        return this.category;
    }
    getCommands() {
        return this.commands;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.network = Network.fromJSON(this.core, array.network);
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = PerkCategory.fromJSON(this.core, array.category);
        this.commands = array.commands.map(command => StoreCommand.fromJSON(this.core, command));
        return this;
    }
    static fromJSON(core, json) {
        return new Perk(core, json.uuid, Network.fromJSON(core, json.network), json.name, json.description, json.type, PerkCategory.fromJSON(core, json.category), json.commands.map(command => StoreCommand.fromJSON(core, command)));
    }
}
class PerkCategory extends Core {
    constructor(core, id, name, network) {
        super(core.getTool());
        this.core = core;
        this.uuid = id;
        this.name = name;
        this.network = network;
    }
    createPerk(name, description, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                name: name,
                description: description,
                type: type.toUpperCase(),
                category: this.uuid,
            }, "store/perk/create/")
                .then(json => Perk.fromJSON(this.core, json));
        });
    }
    getId() {
        return this.uuid;
    }
    getName() {
        return this.name;
    }
    getNetwork() {
        return this.network;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.network = Network.fromJSON(this.core, array.network);
        return this;
    }
    static fromJSON(core, json) {
        return new PerkCategory(core, json.uuid, json.name, Network.fromJSON(core, json.network));
    }
}
class PerkContextualized extends Core {
    constructor(core, perk, quantity) {
        super(core.getTool());
        this.core = core;
        this.perk = perk;
        this.quantity = quantity;
    }
    getPerk() {
        return this.perk;
    }
    getQuantity() {
        return this.quantity;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.perk = Perk.fromJSON(this.core, array.perk);
        this.quantity = array.quantity;
        return this;
    }
    static fromJSON(core, json) {
        return new PerkContextualized(core, Perk.fromJSON(core, json.perk), json.quantity);
    }
}
class Store extends Network {
    constructor(network) {
        super(network.core, network.asInstance());
        this.network = network;
    }
    getIncomeAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                span: span,
            }, "store/income/analytics/")
                .then(json => json.map(new IncomeAnalytic().fromArray));
        });
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                item: id,
            }, "store/item/")
                .then(item => StoreItem.fromJSON(this.core, item));
        });
    }
    getPerks() {
        return __awaiter(this, void 0, void 0, function* () {
            let args = {
                network: this.uuid
            };
            if (this.core.getTool() instanceof Session) {
                args.hash = this.core.getCoreSession().getHash();
            }
            return new Call(this.core)
                .commit(args, "perk/list/")
                .then(json => json.map(perk => Perk.fromJSON(this.core, perk)));
        });
    }
    getPerkCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let args = {
                network: this.uuid
            };
            if (this.core.getTool() instanceof Session) {
                args.hash = this.core.getCoreSession().getHash();
            }
            return new Call(this.core)
                .commit(args, "store/perk/category/list/")
                .then(json => json.map(perk => PerkCategory.fromJSON(this.core, perk)));
        });
    }
    getGateways() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "store/gateway/list/")
                .then(json => json.map(gateway => new Gateway(gateway.name, null, null, null)));
        });
    }
    itemIdList(array) {
        return array.map(item => new StoreItem(new Core(), item.getId()));
    }
    itemIdListFromJSON(json) {
        return json.map(item => new StoreItem(new Core(), item.uuid));
    }
    getStripeWalletLink() {
        return `https://api.purecore.io/link/stripe/wallet/?hash=
        ${this.network.core.getCoreSession().getHash()}&network=${this.network.getId()}`;
    }
    getPayPalWalletLink() {
        return `https://api.purecore.io/link/paypal/wallet/?hash=
        ${this.network.core.getCoreSession().getHash()}&network=${this.network.getId()}`;
    }
    requestPayment(itemList, username, billingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                username: username,
                products: escape(JSON.stringify(itemList.map(item => item.getId()))),
                billing: JSON.stringify(billingAddress),
            }, "payment/request/")
                .then(json => CorePaymentRequest.fromJSON(this.core, json));
        });
    }
    getNetwork() {
        return this.network;
    }
    getPayments(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                page: page,
            }, "/payment/list/")
                .then(json => json.map(payment => Payment.fromJSON(this.core, payment)));
        });
    }
    unlinkGateway(gatewayName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                gateway: gatewayName,
            }, "store/gateway/unlink/")
                .then(json => json.success);
        });
    }
    createPerkCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                name: name,
            }, "store/perk/category/create/")
                .then(json => PerkCategory.fromJSON(this.core, json));
        });
    }
    createCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                name: name,
                description: description,
            }, "store/category/create/")
                .then(json => StoreCategory.fromJSON(this.core, json));
        });
    }
    //TODO: return type
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getPackages()
                    .then((nestedItems) => resolve(nestedItems.map(item => item.getCategory())))
                    .catch(reject);
            });
        });
    }
    getPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ network: this.uuid }, "store/item/list/")
                .then(json => json.map(item => NestedItem.fromJSON(this.core, item)));
        });
    }
    static fromJSON(core, json) {
        return new Store(Network.fromJSON(core, json.network));
    }
}
class StoreCommand extends Core {
    constructor(core, network, cmd, needsOnline, executeOn, listId) {
        super(core.getTool());
        this.core = core;
        this.network = network;
        this.cmd = cmd;
        this.needsOnline = needsOnline;
        this.executeOn = executeOn;
        this.listId = listId;
    }
    getNetwork() {
        return this.network;
    }
    isNeedsOnline() {
        return this.needsOnline;
    }
    getExecuteOn() {
        return this.executeOn;
    }
    getListId() {
        return this.listId;
    }
    getCommand() {
        return this.cmd;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.network = Network.fromJSON(this.core, array.network);
        if (typeof array.command == "string") {
            this.cmd = new Command(array.command, null, this.network);
        }
        else {
            this.cmd = new Command(array.command.cmdId, array.command.cmdString, this.network);
        }
        this.needsOnline = array.needs_online;
        this.listId = array.listid;
        this.executeOn = array.execute_on.map(instance => {
            if (typeof instance == "string") {
                return new Instance(this.core, instance, null, "UNK");
            }
            else {
                return Instance.fromJSON(this.core, instance);
            }
        });
        return this;
    }
    static fromJSON(core, json) {
        const network = Network.fromJSON(core, json.network);
        return new StoreCommand(core, network, typeof json.command == "string" ? new Command(json.command, null, network) :
            Command.fromJSON(network, json.command), json.needs_online, json.execute_on.map(instance => typeof instance == "string" ? new Instance(core, instance, null, "UNK") :
            Instance.fromJSON(core, json.instance)), json.listid);
    }
}
class BillingAddress {
    constructor(name, email, country, state, city, postalCode, line1, line2) {
        this.name = name;
        this.email = email;
        this.city = city;
        this.country = country;
        this.state = state;
        this.postalcode = postalCode;
        this.line1 = line1;
        this.line2 = line2;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getCountry() {
        return this.country;
    }
    getState() {
        return this.state;
    }
    getCity() {
        return this.city;
    }
    getPostalCode() {
        return this.postalcode;
    }
    getLine1() {
        return this.line1;
    }
    getLine2() {
        return this.line2;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.name = array.name;
        this.email = array.email;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        this.postalcode = array.postalcode;
        this.line1 = array.line1;
        this.line2 = array.line2 == "" ? null : array.line2;
        return this;
    }
    static fromJSON(json) {
        return new BillingAddress(json.name, json.email, json.country, json.state, json.city, json.postalcode, json.line1, json.line2 == "" ? null : json.line2);
    }
}
class Discount {
    constructor(type, id, description, amount) {
        this.type = type;
        this.id = id;
        this.description = description;
        this.amount = amount;
    }
    getType() {
        return this.type;
    }
    getId() {
        return this.id;
    }
    getDescription() {
        return this.description;
    }
    getAmount() {
        return this.amount;
    }
    static fromJSON(json) {
        return new Discount(json.type, json.id, json.description, json.amount);
    }
}
class Gateway {
    constructor(name, url, color, logo) {
        this.name = name;
        this.url = url;
        this.color = color;
        this.logo = logo;
    }
    getName() {
        return this.name;
    }
    getUrl() {
        return this.url;
    }
    getColor() {
        return this.color;
    }
    getLogo() {
        return this.logo;
    }
    static fromJSON(json) {
        return new Gateway(json.name, json.url, json.color, json.logo);
    }
}
class Payment extends Core {
    constructor(core, uuid, request, gateway, metadata, network, legacyUsername, player, sessions) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.request = request;
        this.gateway = gateway;
        this.metadata = metadata;
        this.network = network;
        this.legacyUsername = legacyUsername;
        this.player = player;
        this.sessions = sessions;
    }
    getId() {
        return this.uuid;
    }
    getRequest() {
        return this.request;
    }
    getGateway() {
        return this.gateway;
    }
    getMetadata() {
        return this.metadata;
    }
    getNetwork() {
        return this.network;
    }
    getLegacyUsername() {
        return this.legacyUsername;
    }
    getPlayer() {
        return this.player;
    }
    getSessions() {
        return this.sessions;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.request = CorePaymentRequest.fromJSON(this.core, array.request);
        this.gateway = Gateway.fromJSON(array.gateway);
        this.metadata = array.metadata;
        this.network = Network.fromJSON(this.core, array.network);
        this.legacyUsername = array.legacyUsername;
        this.player = Player.fromJSON(this.core, array.player);
        this.sessions = new Array();
        // this.sessions = ... (TODO)
        return this;
    }
    static fromJSON(core, json) {
        return new Payment(core, json.uuid, CorePaymentRequest.fromJSON(core, json.request), Gateway.fromJSON(json.gateway), json.metadata, Network.fromJSON(core, json.network), json.legacyUsername, Player.fromJSON(core, json.player), new Array() //TODO: add connections parsing
        );
    }
}
class CorePaymentRequest extends Core {
    constructor(core, uuid, store, products, username, player, sessionList, warnings, discounts, gateways, due, currency) {
        super(core.getTool());
        this.core = new Core(core.getTool());
        this.uuid = uuid;
        this.store = store;
        this.products = products == null ? new Array() : products;
        this.username = username;
        this.sessionList = sessionList == null ? new Array() : sessionList;
        this.warnings = warnings == null ? new Array() : warnings;
        this.discounts = discounts == null ? new Array() : discounts;
        this.gateways = gateways == null ? new Array() : gateways;
        this.due = due;
        this.currency = currency;
    }
    isPaid() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({ request: this.uuid }, "payment/request/isPaid/")
                .then(json => json.paid);
        });
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.store = Store.fromJSON(this.core, array.store);
        this.products = array.products.map(product => StoreItem.fromJSON(this.core, product));
        this.username = array.username;
        this.player = Player.fromJSON(this.core, array.player);
        this.sessionList = array.sessionList.map(session => ConnectionHash.fromJSON(this.core, session)); //TODO: check implementation as it was a todo previously
        this.warnings = array.warnings.map(Warning.fromJSON);
        this.discounts = array.discounts.map(Discount.fromJSON);
        this.gateways = array.gateways.map(Gateway.fromJSON);
        this.due = array.due;
        this.currency = array.currency;
        return this;
    }
    static fromJSON(core, json) {
        return new CorePaymentRequest(core, json.uuid, Store.fromJSON(core, json.store), json.products.map(product => StoreItem.fromJSON(core, product)), json.username, Player.fromJSON(core, json.player), json.sessionList.map(session => ConnectionHash.fromJSON(core, session)), json.warnings.map(Warning.fromJSON), json.discounts.map(Discount.fromJSON), json.gateways.map(Gateway.fromJSON), json.due, json.currency);
    }
}
class Warning {
    constructor(cause, text) {
        this.cause = cause;
        this.text = text;
    }
    getCause() {
        return this.cause;
    }
    getText() {
        return this.text;
    }
    static fromJSON(json) {
        return new Warning(json.cause, json.text);
    }
}
///<reference path="StripePaymentMethodType.ts"/>
class Owner extends Core {
    constructor(core, id, name, surname, email) {
        super(core.getTool());
        this.core = core;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
    getName() {
        return this.name;
    }
    getSurname() {
        return this.surname;
    }
    getEmail() {
        return this.email;
    }
    getId() {
        return this.id;
    }
    getSession() {
        return this.core.getTool();
    }
    stripeSubscribe(plan, billingAddress, pm) {
        return __awaiter(this, void 0, void 0, function* () {
            let args;
            if (pm == null) {
                args = {
                    plan: plan,
                    billing: JSON.stringify(billingAddress),
                };
            }
            else {
                let pmid;
                if (typeof pm == "string") {
                    pmid = pm;
                }
                else {
                    pmid = pm.paymentMethod.id;
                }
                args = {
                    plan: plan,
                    billing: JSON.stringify(billingAddress),
                    pm: pmid,
                };
            }
            return yield new Call(this.core)
                .commit(args, "account/subscribe/stripe/")
                .then(json => StripeSubscription.fromJSON(json));
        });
    }
    paypalSubscribe(plan, billingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({
                plan: plan,
                billing: JSON.stringify(billingAddress),
            }, "account/subscribe/paypal/")
                .then(json => PayPalSubscription.fromJSON(json));
        });
    }
    getBillingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "account/billing/get/")
                .then(BillingAddress.fromJSON);
        });
    }
    //TODO: add types
    addPaymentMethod(pm) {
        return __awaiter(this, void 0, void 0, function* () {
            let pmid;
            if (typeof pm == "string") {
                pmid = pm;
            }
            else {
                pmid = pm.paymentMethod.id;
            }
            return yield new Call(this.core)
                .commit({ pm: pmid }, "account/card/add/")
                .then(json => json);
        });
    }
    //TODO: add types
    removePaymentMethod(pm) {
        return __awaiter(this, void 0, void 0, function* () {
            let pmid = null;
            if (typeof pm == "string") {
                pmid = pm;
            }
            else {
                pmid = pm.paymentMethod.id;
            }
            return yield new Call(this.core)
                .commit({ pm: pmid }, "account/card/remove/")
                .then(json => json.success);
        });
    }
    /**
     * @see https://stripe.com/docs/api/payment_methods/object
     */
    getPaymentMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "account/card/list/")
                .then(json => json);
        });
    }
    createNetwork(name, game, cname, ip, port) {
        return __awaiter(this, void 0, void 0, function* () {
            let args = {
                name: name,
                game: game,
                cname: cname,
            };
            if (ip != undefined)
                args.id = ip;
            if (port != undefined)
                args.port = port;
            return yield new Call(this.core)
                .commit(args, "instance/network/create/")
                .then(json => Network.fromJSON(this.core, json));
        });
    }
    static fromJSON(core, json) {
        return new Owner(core, json.id, json.name, json.surname, json.email);
    }
}
class Player extends Core {
    constructor(core, id, username, uuid, verified) {
        super(core.getKey(), core.dev);
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }
    closeConnections(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({ instance: instance.getId() }, "connection/close/all/")
                .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
        });
    }
    openConnection(ip, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({
                instance: instance.getId(),
                ip: ip,
                username: this.username,
                uuid: this.uuid,
            }, "connection/new/")
                .then(json => Connection.fromJSON(this.core, json));
        });
    }
    getBillingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "player/billing/get/")
                .then(BillingAddress.fromJSON);
        });
    }
    getPunishments(network, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            let args = {
                player: this.id,
                page: page.toString(),
            };
            if (network != null)
                args.network = network.getId();
            return yield new Call(this.core)
                .commit(args, "player/punishment/list/")
                .then(json => json.map(punishment => Punishment.fromJSON(this.core, punishment)));
        });
    }
    getPayments(store, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return yield new Call(this.core)
                .commit({
                network: store.getNetwork().getId(),
                page: page.toString(),
                player: this.id,
            }, "player/payment/list/")
                .then(json => json.map(payment => Payment.fromJSON(this.core, payment)));
        });
    }
    getDiscordId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "player/payment/list/")
                .then(json => json.id);
        });
    }
    getConnections(instance, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            let args = {
                page: page,
                player: this.id
            };
            if (instance != null)
                args.instance = instance.getId();
            return yield new Call(this.core)
                .commit(args, "player/connection/list/")
                .then(json => json.map(connection => Connection.fromJSON(this.core, connection)));
        });
    }
    getMatchingConnections(instance, page, playerList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == undefined)
                page = 0;
            return yield new Call(this.core)
                .commit({
                instance: instance.getId(),
                page: page,
                players: JSON.stringify(playerList.map(player => player.getId())),
                player: this.id,
            }, "connection/list/match/players/")
                .then(json => json.map(activity => ActivityMatch.fromJSON(activity)));
        });
    }
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getUsername() {
        return this.username;
    }
    isVerified() {
        return this.verified;
    }
    static fromJSON(core, json) {
        return new Player(core, json.id, json.username, json.uuid, json.verified);
    }
}
class VotingSite extends Core {
    constructor(core, uuid, supervisor, resetTimes, timezone, name, url, technicalName) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.supervisor = supervisor;
        this.resetTimes = resetTimes;
        this.timezone = timezone;
        this.name = name;
        this.url = url;
        this.technicalName = technicalName;
    }
    getConfig(network, empty = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (empty) {
                return new VotingSiteConfig(this.core, network, this, null);
            }
            else {
                throw new Error("to be implemented");
                // to-do fetch from server
            }
        });
    }
    getId() {
        return this.uuid;
    }
    getSupervisor() {
        return this.supervisor;
    }
    getResetTimes() {
        return this.resetTimes;
    }
    getTimezone() {
        return this.timezone;
    }
    getName() {
        return this.name;
    }
    getUrl() {
        return this.url;
    }
    getTechnicalName() {
        return this.technicalName;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.uuid = array.uuid;
        this.supervisor = Owner.fromJSON(this.core, array.supervisor);
        this.resetTimes = array.resetTimes;
        this.timezone = array.timezone;
        this.name = array.name;
        this.url = array.url;
        this.technicalName = array.technicalName;
        return this;
    }
    static fromJSON(core, json) {
        return new VotingSite(core, json.uuid, Owner.fromJSON(core, json.supervisor), json.resetTimes, json.timezone, json.name, json.url, json.technicalName);
    }
}
class VotingSiteConfig extends Core {
    constructor(core, network, votingSite, url) {
        super(core.getTool());
        this.core = core;
        this.network = network;
        this.votingSite = votingSite;
        this.url = url;
    }
    setURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.network.uuid,
                url: url,
                site: this.votingSite.getId(),
            }, "instance/network/voting/site/setup/")
                .then((json) => {
                this.url = json.url;
                return this;
            });
        });
    }
    getNetwork() {
        return this.network;
    }
    getVotingSite() {
        return this.votingSite;
    }
    getUrl() {
        return this.url;
    }
    /**
     * @deprecated use static method fromJSON
     */
    fromArray(array) {
        this.votingSite = VotingSite.fromJSON(this.core, array.votingSite);
        this.network = Network.fromJSON(this.core, array.network);
        this.url = array.url;
        return this;
    }
    static fromJSON(core, json) {
        return new VotingSiteConfig(core, Network.fromJSON(core, json.network), VotingSite.fromJSON(core, json.votingSite), json.url);
    }
}
