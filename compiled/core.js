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
                    this.session = new Session(new Core(this.session, this.dev)).fromObject(tool);
                }
            }
        }
        // if not start with fromdiscord or fromtoken
    }
    getCacheCollection() {
        return new CacheCollection(this.dev);
    }
    requestGlobalHash() {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this;
            return yield new Call(this)
                .commit({}, "session/hash/list/")
                .then((json) => {
                var response = new Array();
                json.forEach((hashData) => {
                    var hash = new ConnectionHashGlobal(core);
                    response.push(hash.fromObject(hashData));
                });
                return response;
            });
        });
    }
    getPlayersFromIds(ids) {
        var playerList = new Array();
        ids.forEach((id) => {
            playerList.push(new Player(this, id));
        });
        return playerList;
    }
    getMachine(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this)
                .commit({ hash: hash }, "machine")
                .then((data) => { return new Machine(this, hash).fromObject(data); });
        });
    }
    fromToken(googleToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this)
                .commit({ token: googleToken }, "session/from/google")
                .then(json => {
                const session = new Session(this).fromObject(json);
                this.session = session;
                return session;
            });
        });
    }
    asBillingAddress(array) {
        return new BillingAddress().fromObject(array);
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
        if (this.key != null && this.key != undefined) {
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
    getHostingManager() {
        return new HostingManager(this);
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
    const fetch = require('node-fetch');
    if (!global.fetch) {
        global.fetch = fetch;
    }
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
class AnalyticGroup {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    fromObject(object) {
        this.key = object.key;
        this.value = object.value;
        return this;
    }
}
class AnalyticGroupBase {
    constructor(groupSize, values) {
        this.groupSize = groupSize;
        this.values = values;
    }
    fromObject(object) {
        this.groupSize = object.groupSize;
        var values = new Array();
        object.values.forEach(value => {
            values.push(new AnalyticGroup().fromObject(value));
        });
        this.values = values;
        return this;
    }
    toApexHeatmap() {
        let series = [];
        let current = [];
        this.values.forEach(value => {
            current.push({
                x: value.key,
                y: value.value
            });
            if (current.length >= this.groupSize) {
                series.push({
                    name: (series.length + 1).toString(),
                    data: current
                });
                current = [];
            }
            else if (series.length * this.groupSize + current.length == this.values.length) {
                series.push({
                    name: (series.length + 1).toString(),
                    data: current
                });
            }
        });
        return series;
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
    fromObject(array) {
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
    fromObject(array) {
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
    fromObject(array) {
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
}
class BillingPreview {
    constructor(now, days, monthly) {
        this.now = now;
        this.days = days;
        this.monthly = monthly;
    }
    fromObject(object) {
        this.now = object.now;
        this.days = object.days;
        this.monthly = object.monthly;
        return this;
    }
}
class StripeSubscription {
    constructor(id) {
        this.id = id;
    }
    getID() {
        return this.id;
    }
}
class CacheCollection {
    constructor(dev, instanceCaches, uuidAssociation, socketAssociation) {
        // events
        this.onCommandEvent = new LiteEvent();
        this.onCommandsLoadingEvent = new LiteEvent();
        this.onCommandsLoadedEvent = new LiteEvent();
        if (dev == null) {
            this.dev = false;
        }
        else {
            this.dev = dev;
        }
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
        this.executions = new Array();
        this.loadingExecutions = new Array();
        this.loadedExecutions = new Array();
        this.executors = {};
    }
    get onCommand() { return this.onCommandEvent.expose(); }
    get onCommandsLoading() { return this.onCommandsLoadingEvent.expose(); }
    get onCommandsLoaded() { return this.onCommandsLoadedEvent.expose(); }
    // CONNECTION AND DISCONNECT
    disconnect(socketId) {
        if (this.getCacheBySocket(socketId) != null) {
            this.removeCache(this.getCacheBySocket(socketId).createdOn.getTime());
        }
    }
    getExecutors(instance) {
        var executors = new Array();
        if (instance.uuid in executors) {
            executors[instance.uuid].forEach(socketId => {
                executors.push(socketId);
            });
        }
        return executors;
    }
    connect(socketId, keyStr) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var credentials = new Core(keyStr, this.dev);
            return yield credentials
                .getLegacyKey()
                .update()
                .then(function (keyData) {
                var cache = new InstanceCache(credentials, keyData.instance);
                main.socketAssociation[socketId] = cache.createdOn.getTime();
                if (!(cache.instance.uuid in main.uuidAssociation)) {
                    main.uuidAssociation[cache.instance.uuid] = [];
                }
                main.uuidAssociation[cache.instance.uuid].push(cache.createdOn.getTime());
                main.instanceCaches.push(cache);
                return true;
            });
        });
    }
    // DATA REMOVAL
    removeCache(epoch) {
        var cache = this.getCacheByEpoch(epoch);
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
            // remove possible executor
            if (cache.instance.uuid in this.executors) {
                if (this.executors[cache.instance.uuid].length > 1) {
                    this.executors[cache.instance.uuid].splice(this.executors[cache.instance.uuid].indexOf(socketId), 1);
                }
                else {
                    delete this.executors[cache.instance.uuid];
                }
            }
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
        // remove cache
        this.instanceCaches.splice(this.instanceCaches.indexOf(cache), 1);
    }
    // DATA QUERY
    setExecutor(socketId) {
        let cache = this.getCacheBySocket(socketId);
        if (cache != null) {
            if (cache.instance.uuid in this.executors) {
                this.executors[cache.instance.uuid].push(socketId);
            }
            else {
                this.executors[cache.instance.uuid] = [socketId];
                this.sendCommandBatch(this.executions, socketId);
                this.loadExecutions(cache.instance, "offline", 0);
            }
        }
    }
    loadExecutions(instance, type, page, exclude) {
        // if the executions have not been loaded or are being loaded already...
        if (exclude == null)
            exclude = new Array();
        let firstRun = (type == "offline" && page == 0 && this.loadingExecutions.indexOf(instance) === -1 && this.loadedExecutions.indexOf(instance) === -1);
        let continuation = ((type == "offline" && page > 0) || type != "offline");
        if (firstRun)
            this.onCommandsLoadingEvent.trigger();
        if (firstRun || continuation) {
            if (firstRun) {
                // ignore already loaded or loading instances, as they will be buffered or they have already been buffered
                this.loadingExecutions.forEach(instance => {
                    if (!exclude.includes(instance))
                        exclude.push(instance);
                });
                this.loadedExecutions.forEach(instance => {
                    if (!exclude.includes(instance))
                        exclude.push(instance);
                });
                // add to loading list to prevent new instance loads to parallel buffer the same data
                this.loadingExecutions.push(instance);
            }
            instance.getPendingExecutions(type, page, exclude).then((executions) => {
                executions.forEach(execution => {
                    if (!this.executions.includes(execution)) {
                        this.executions.push(execution);
                    }
                });
                this.sendCommandBatch(executions);
                if (executions.length >= 20) {
                    this.loadExecutions(instance, type, page + 1, exclude);
                }
                else if (type == "offline") {
                    this.loadExecutions(instance, "online", 0, exclude);
                }
                else {
                    this.loadingExecutions.splice(this.loadingExecutions.indexOf(instance), 1);
                    this.loadedExecutions.push(instance);
                    this.onCommandsLoadedEvent.trigger();
                }
            });
        }
    }
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
        if (instance.uuid in this.uuidAssociation) {
            this.uuidAssociation[instance.uuid].forEach((epoch) => {
                var cache = this.getCacheByEpoch(epoch);
                if (cache != null) {
                    cacheList.push(cache);
                }
            });
        }
        return cacheList;
    }
    // DATA SENDING
    sendCommandBatch(executions, exclusiveTo) {
        let organizedDestinations = {};
        executions.forEach(execution => {
            let executedOnList = [];
            execution.executedOn.forEach(executedOn => {
                executedOnList.push(executedOn.uuid);
            });
            execution.instances.forEach(expectedInstance => {
                if (!executedOnList.includes(expectedInstance.uuid) && this.getCachesByInstance(expectedInstance).length > 0) {
                    if (!(expectedInstance.uuid in organizedDestinations)) {
                        organizedDestinations[expectedInstance.uuid] = new Array();
                    }
                    organizedDestinations[expectedInstance.uuid].push(execution);
                }
            });
        });
        for (var key in organizedDestinations) {
            // skip loop if the property is from prototype
            if (!organizedDestinations.hasOwnProperty(key))
                continue;
            var instanceExecutions = organizedDestinations[key];
            if (key in this.executors) {
                // get every available executor for that instance
                this.executors[key].forEach(executor => {
                    if (exclusiveTo != null && executor == exclusiveTo) {
                        this.onCommandEvent.trigger(new CommandEvent(executor, instanceExecutions));
                    }
                    else if (exclusiveTo == null) {
                        this.onCommandEvent.trigger(new CommandEvent(executor, instanceExecutions));
                    }
                    // send oncommand event for every available executor for that instance
                });
            }
        }
    }
}
class CommandEvent {
    constructor(socketId, commands) {
        this.socketId = socketId;
        this.commands = commands;
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
class LiteEvent {
    constructor() {
        this.handlers = [];
    }
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    trigger(data) {
        this.handlers.slice(0).forEach(h => h(data));
    }
    expose() {
        return this;
    }
}
class Call extends Core {
    constructor(core) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.baseURL = "https://api.purecore.io/rest/2";
    }
    commit(args, endpoint, request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args == null)
                args = {};
            if (request == null)
                request = { method: "POST" };
            if (this.core.getCoreSession() != null && args.hash == null) {
                args.hash = this.core.getCoreSession().getHash();
            }
            else if (this.core.getKey() != null) {
                args.key = this.core.getKey();
            }
            const url = this.baseURL +
                Call.formatEndpoint(endpoint) +
                "?" +
                Object.keys(args)
                    .filter((key) => args.hasOwnProperty(key))
                    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(args[key]))
                    .join("&");
            if (this.core.dev) {
                var visibleArgs = args;
                if (args.key != null)
                    visibleArgs.key = "***";
                if (args.hash != null)
                    visibleArgs.hash = "***";
                console.log(this.baseURL +
                    Call.formatEndpoint(endpoint), visibleArgs);
            }
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
class Command extends Core {
    constructor(core, uuid, cmd, network) {
        super(core.getTool, core.dev);
        this.core = core;
        this.uuid = uuid;
        this.cmd = cmd;
        this.network = network;
    }
    fromObject(object) {
        this.uuid = object.cmdId;
        this.cmd = object.cmdString;
        this.network = new Network(this.core).fromObject(object.network);
        return this;
    }
}
class CommandContext extends Core {
    constructor(core, player, legacyUsername, legacyUuid, originType, originName, originId, causedBy, quantity) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.player = player;
        this.legacyUsername = legacyUsername;
        this.legacyUuid = legacyUuid;
        this.originType = originType;
        this.originName = originName;
        this.originId = originId;
        this.causedBy = causedBy;
        this.quantity = quantity;
    }
    fromObject(object) {
        this.player = null;
        if (object.player != null)
            this.player = new Player(this.core).fromObject(object.player);
        this.legacyUsername = object.legacyUsername;
        this.legacyUuid = object.legacyUuid;
        this.originType = object.originType;
        this.originName = object.originName;
        this.originId = object.originId;
        this.causedBy = object.causedBy;
        this.quantity = object.quantity;
        return this;
    }
}
class Execution extends Core {
    constructor(core, uuid, network, command, commandContext, instances, needsOnline, executedOn, executed) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.command = command;
        this.commandContext = commandContext;
        this.instances = instances;
        this.needsOnline = needsOnline;
        this.executedOn = executedOn;
        this.executed = executed;
    }
    fromObject(object) {
        this.uuid = object.uuid;
        this.network = new Network(this.core).fromObject(object.network);
        this.command = new Command(this.core).fromObject(object.command);
        this.commandContext = new CommandContext(this.core).fromObject(object.commandContext);
        this.instances = new Array();
        if (Array.isArray(object.instances)) {
            object.instances.forEach(element => {
                if (typeof "element" === "string") {
                    this.instances.push(new Instance(this.core, element, null, null));
                }
                else {
                    this.instances.push(new Instance(this.core).fromObject(element));
                }
            });
        }
        this.needsOnline = object.needsOnline;
        this.executedOn = new Array();
        if (Array.isArray(object.executedOn)) {
            object.executedOn.forEach(element => {
                if (typeof "element" === "string") {
                    this.executedOn.push(new Instance(this.core, element, null, null));
                }
                else {
                    this.executedOn.push(new Instance(this.core).fromObject(element));
                }
            });
        }
        this.executed = object.executed;
        return this;
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
    getMatchList() {
        return this.matchList;
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
    fromObject(array) {
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        this.location = new ConnectionLocation().fromObject(array.location);
        this.status = new ConnectionStatus().fromObject(array.status);
        this.uuid = array.uuid;
        return this;
    }
    getStatus() {
        return this.status;
    }
    getInstance() {
        return this.instance;
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
    fromObject(array) {
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        return this;
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
    requestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                hash: this.hash,
            }, "session/hash/token/")
                .then((jsonresponse) => {
                var player = new Player(main.core, jsonresponse.player.coreid, jsonresponse.player.username, jsonresponse.player.uuid, jsonresponse.player.verified);
                var instance = new Network(main.core, new Instance(main.core, jsonresponse.network.uuid, jsonresponse.network.name, "NTW"));
                return new SessionRequest(main.core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, instance, "player");
            });
        });
    }
}
class ConnectionHashGlobal extends Core {
    constructor(core, hash, player) {
        super(core.getKey());
        this.core = core;
        this.hash = hash;
        this.player = player;
    }
    fromObject(array) {
        this.hash = array.hash;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        return this;
    }
    getPlayer() {
        return this.player;
    }
    getHash() {
        return this.hash;
    }
    requestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                hash: this.hash,
            }, "session/hash/token/")
                .then((jsonresponse) => {
                var player = new Player(main.core, jsonresponse.player.coreid, jsonresponse.player.username, jsonresponse.player.uuid, jsonresponse.player.verified);
                if (main.core.getTool() != null) {
                    var instance = new Network(main.core, new Instance(main.core, jsonresponse.network.uuid, jsonresponse.network.name, "NTW"));
                    var sessionRequest = new SessionRequest(main.core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, instance, "player");
                    return sessionRequest;
                }
                else {
                    var sessionRequest = new SessionRequest(main.core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, null, "masterplayer");
                    return sessionRequest;
                }
            });
        });
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
    fromObject(array) {
        this.city = array.city;
        this.region = array.region;
        this.country = array.country;
        this.lat = array.lat;
        this.long = array.long;
        return this;
    }
}
class ConnectionStatus {
    constructor(openedOn, closedOn) {
        this.openedOn = openedOn;
        this.closedOn = closedOn;
    }
    fromObject(array) {
        this.openedOn = new Date(array.openedOn * 1000);
        this.closedOn = new Date(array.closedOn * 1000);
        return this;
    }
    getOpenedOn() {
        return this.openedOn;
    }
    isActive() {
        if (this.closedOn == undefined || this.closedOn == null) {
            return true;
        }
        else {
            return false;
        }
    }
    isClosed() {
        return !this.isActive();
    }
    getClosedOn() {
        return this.closedOn;
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
    fromObject(array) {
        this.name = array.name;
        this.uuid = array.uuid;
        this.memberCount = array.memberCount;
        return this;
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
        var finalProducts = new Array();
        this.products.forEach((product) => {
            finalProducts.push(product.getId());
        });
        return JSON.stringify(finalProducts);
    }
    loadInto(selector) {
        var key = this.core.getKey();
        var products = this.getJSON();
        /*
        $.getScript("https://js.stripe.com/v3/", function (
          data,
          textStatus,
          jqxhr
        ) {
          $(selector).load(
            "https://api.purecore.io/rest/2/element/checkout/?key=" +
              key +
              "&items=" +
              products
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.section = new ForumSection(this.core).fromObject(array.section);
        return this;
    }
    getPosts(page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == null || page == undefined) {
                page = 0;
            }
            let main = this;
            return new Call(this.core)
                .commit({
                category: this.uuid,
                page: page.toString(),
            }, "forum/get/post/list/")
                .then((jsonresponse) => {
                var finalResponse = new Array();
                jsonresponse.forEach((postJSON) => {
                    finalResponse.push(new ForumPost(main.network.core).fromObject(postJSON));
                });
                return finalResponse;
            });
        });
    }
    createPost(title, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                category: this.uuid,
                title: title,
                content: escape(content),
            }, "forum/create/post/")
                .then((jsonresponse) => {
                return new ForumPost(main.core).fromObject(jsonresponse);
            });
        });
    }
}
class Forum {
    constructor(network) {
        this.network = network;
    }
    getSections() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.network.core)
                .commit({
                network: this.network.uuid,
            }, "forum/get/section/list/")
                .then((jsonresponse) => {
                var finalResponse = new Array();
                jsonresponse.forEach((sectionJSON) => {
                    finalResponse.push(new ForumSection(main.network.core).fromObject(sectionJSON));
                });
                return finalResponse;
            });
        });
    }
    getCategory(catid) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.network.core)
                .commit({
                category: catid,
            }, "forum/get/category/")
                .then((jsonresponse) => {
                return new ForumCategory(main.network.core).fromObject(jsonresponse);
            });
        });
    }
    getPost(postid) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.network.core)
                .commit({
                post: postid,
            }, "forum/get/post/")
                .then((jsonresponse) => {
                return new ForumPost(main.network.core).fromObject(jsonresponse);
            });
        });
    }
    createSection(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.network.core)
                .commit({
                network: this.network.uuid,
                name: name,
                description: description,
            }, "forum/create/section/")
                .then((jsonresponse) => {
                return new ForumSection(main.network.core).fromObject(jsonresponse);
            });
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.title = array.title;
        this.content = array.content;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.open = array.open;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.category = new ForumCategory(this.core).fromObject(array.category);
        return this;
    }
    createReply(content) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                object: this.uuid,
                content: escape(content),
            }, "forum/create/reply/")
                .then((jsonresponse) => {
                return new ForumReply(main.core).fromObject(jsonresponse);
            });
        });
    }
    getReplies(page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == null || page == undefined) {
                page = 0;
            }
            let main = this;
            return new Call(this.core)
                .commit({
                object: this.uuid,
                page: page.toString(),
            }, "forum/get/reply/list/")
                .then((jsonresponse) => {
                var replies = new Array();
                jsonresponse.forEach((response) => {
                    replies.push(new ForumReply(main.core).fromObject(response));
                });
                return replies;
            });
        });
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.content = array.content;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        if ("title" in array.responseTo) {
            this.replyingTo = new ForumPost(this.core).fromObject(array.responseTo);
        }
        else {
            this.replyingTo = new ForumReply(this.core).fromObject(array.responseTo);
        }
        return this;
    }
    createReply(content) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                object: this.uuid,
                content: escape(content),
            }, "forum/create/reply/")
                .then((jsonresponse) => {
                return new ForumReply(main.core).fromObject(jsonresponse);
            });
        });
    }
    getReplies(page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == null || page == undefined) {
                page = 0;
            }
            let main = this;
            return new Call(this.core)
                .commit({
                object: this.uuid,
                page: page.toString(),
            }, "forum/get/reply/list/")
                .then((jsonresponse) => {
                var replies = new Array();
                jsonresponse.forEach((response) => {
                    replies.push(new ForumReply(main.core).fromObject(response));
                });
                return replies;
            });
        });
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
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                section: this.uuid,
            }, "forum/get/category/list/")
                .then((jsonresponse) => {
                var finalResponse = new Array();
                jsonresponse.forEach((categoryJSON) => {
                    finalResponse.push(new ForumCategory(main.core).fromObject(categoryJSON));
                });
                return finalResponse;
            });
        });
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        return this;
    }
    createCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.network.core)
                .commit({
                section: this.uuid,
                name: name,
                description: description,
            }, "forum/create/category/")
                .then((jsonresponse) => {
                return new ForumCategory(main.core).fromObject(jsonresponse);
            });
        });
    }
}
class Host extends Core {
    constructor(core, uuid, instance, machine, owner, createdOn, disabledOn, template, port, additionalPorts, image) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.instance = instance;
        this.machine = machine;
        this.owner = owner;
        this.createdOn = createdOn;
        this.disabledOn = disabledOn;
        this.template = template;
        this.port = port;
        this.additionalPorts = additionalPorts;
        this.image = image;
    }
    fromObject(object) {
        this.uuid = object.uuid;
        this.instance = new Instance(this.core).fromObject(object.instance);
        this.machine = new Machine(this.core).fromObject(object.machine);
        this.owner = new Owner(this.core, object.owner.id, object.owner.name, object.owner.surname, object.owner.email);
        this.createdOn = object.createdOn;
        this.disabledOn = object.disabledOn;
        this.template = new HostingTemplate(this.core).fromObject(object.template);
        this.port = object.port;
        let additionalPorts = new Array();
        object.additionalPorts.forEach(port => {
            additionalPorts.push(port);
        });
        this.additionalPorts = additionalPorts;
        this.image = object.image;
        return this;
    }
}
class HostingAvailability extends Core {
    constructor(core, template, machine, count) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.template = template;
        this.machine = machine;
        this.count = count;
    }
    fromObject(object) {
        this.template = new HostingTemplate(this.core).fromObject(object.template);
        this.machine = new Machine(this.core).fromObject(object.machine);
        this.count = object.count;
        return this;
    }
    use(instance, image) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.template.use(instance, image, this.machine);
        });
    }
}
class HostingManager extends Core {
    constructor(core) {
        super(core.getTool(), core.dev);
        this.core = core;
    }
    getRecommended(countries) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return yield new Call(this.core)
                .commit({
                countries: Array.isArray(countries) ? JSON.stringify(countries) : JSON.stringify([])
            }, "hosting/recommended/")
                .then(function (jsonresponse) {
                let availabilityList = new Array();
                jsonresponse.forEach(element => {
                    availabilityList.push(new HostingAvailability(main.core).fromObject(element));
                });
                return availabilityList;
            });
        });
    }
    preview(template) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof template == "string")
                template = new HostingTemplate(this.core).fromId(template, false);
            return yield new Call(this.core)
                .commit({
                template: template.uuid
            }, "hosting/template/use/preview/")
                .then(function (jsonresponse) {
                return new BillingPreview().fromObject(jsonresponse);
            });
        });
    }
    getTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return yield new Call(this.core)
                .commit({
                template: id
            }, "hosting/template/get/")
                .then(function (jsonresponse) {
                return new HostingTemplate(main.core).fromObject(jsonresponse);
            });
        });
    }
    getMachineFromId(id) {
        return new Machine(this.core, null, null, null, null, null, null, null, null, null, id);
    }
}
class HostingTemplate extends Core {
    constructor(core) {
        super(core.getTool(), core.dev);
        this.core = core;
    }
    fromId(id, query) {
        if (query) {
            //todo
        }
        this.uuid = id;
        return this;
    }
    fromObject(object) {
        this.owner = new Owner(this.core, object.owner.id, object.owner.name, object.owner.surname, object.owner.email);
        this.uuid = object.uuid;
        this.supportedImages = object.supportedImages;
        this.memory = object.memory;
        this.size = object.size;
        this.cores = object.cores;
        this.price = object.price;
        return this;
    }
    addTo(machine) {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this.core;
            return yield new Call(this.core)
                .commit({
                machine: machine.uuid,
                template: this.uuid
            }, "hosting/template/add/")
                .then(function (jsonresponse) {
                return new Machine(core).fromObject(jsonresponse);
            });
        });
    }
    use(instance, image, machine) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({
                machine: machine.uuid,
                template: this.uuid,
                instance: instance.uuid,
                image: image
            }, "hosting/template/use/")
                .then(function (jsonresponse) {
                return new BillingPreview().fromObject(jsonresponse);
            });
        });
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
    fromObject(object) {
        this.uuid = object.uuid;
        this.name = object.name;
        this.type = object.type;
        return this;
    }
    closeOpenConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                instance: this.uuid,
            }, "instance/connections/close/all/")
                .then((jsonresponse) => {
                var connectionList = new Array();
                jsonresponse.forEach((connectionJson) => {
                    var connection = new Connection(main.core).fromObject(connectionJson);
                    connectionList.push(connection);
                });
                return connectionList;
            });
        });
    }
    getOpenConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                instance: this.uuid,
            }, "instance/connections/open/list/")
                .then((jsonresponse) => {
                var connectionList = new Array();
                jsonresponse.forEach((connectionJson) => {
                    var connection = new Connection(main.core).fromObject(connectionJson);
                    connectionList.push(connection);
                });
                return connectionList;
            });
        });
    }
    getGrowthAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                instance: this.uuid,
                span: span,
            }, "instance/growth/analytics/")
                .then((jsonresponse) => {
                var growthAnalytics = new Array();
                jsonresponse.forEach((growthAnalyticJSON) => {
                    var growthAnalytic = new GrowthAnalytic().fromObject(growthAnalyticJSON);
                    growthAnalytics.push(growthAnalytic);
                });
                return growthAnalytics;
            });
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                instance: this.uuid,
            }, "instance/delete/")
                .then(() => {
                return true;
            });
        });
    }
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                instance: this.uuid,
            }, "instance/key/list/")
                .then((jsonresponse) => {
                var keyList = new Array();
                jsonresponse.forEach((jsonKey) => {
                    keyList.push(new Key(main.core).fromObject(jsonKey));
                });
                return keyList;
            });
        });
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.uuid;
    }
    asNetwork() {
        return new Network(this.core, this);
    }
    getPendingExecutions(type, page, exclude) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page == null)
                page = 0;
            if (type == null)
                type = "any";
            if (exclude == null)
                exclude = new Array();
            let ids = new Array();
            exclude.forEach(excludedInstance => {
                ids.push(excludedInstance.uuid);
            });
            var args = {};
            if (ids.length > 0) {
                args = {
                    instance: this.uuid,
                    page: page.toString(),
                    type: type,
                    excluded: JSON.stringify(ids)
                };
            }
            else {
                args = {
                    instance: this.uuid,
                    page: page.toString(),
                    type: type,
                };
            }
            return new Call(this.core)
                .commit(args, "cmds/get/pending/")
                .then((jsonresponse) => {
                let executions = new Array();
                jsonresponse.forEach(jsonObject => {
                    executions.push(new Execution(this.core).fromObject(jsonObject));
                });
                return executions;
            });
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                instance: this.uuid,
            }, "instance/info/")
                .then((jsonresponse) => {
                if (jsonresponse.server == null) {
                    main.type = "NTW";
                    main.uuid = jsonresponse.network.uuid;
                    main.name = jsonresponse.network.name;
                }
                else {
                    main.type = "SVR";
                    main.uuid = jsonresponse.server.uuid;
                    main.name = jsonresponse.server.name;
                }
                return main;
            });
        });
    }
}
class InstanceVital {
}
class Network extends Core {
    constructor(core, instance) {
        super(core.getTool());
        this.core = core;
        if (instance != null) {
            this.uuid = instance.getId();
            this.name = instance.getName();
        }
    }
    fromObject(object) {
        this.uuid = object.uuid;
        this.name = object.name;
        return this;
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
    /**
     * @param group hour, day, month, year
     */
    getVoteHeatmap(group) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                group: group
            }, "instance/network/voting/analytics/group")
                .then((jsonresponse) => {
                return new AnalyticGroupBase().fromObject(jsonresponse);
            });
        });
    }
    getDevKey() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "key/get/dev/")
                .then((jsonresponse) => {
                return new Key(main.core).fromObject(jsonresponse);
            });
        });
    }
    getKeyFromId(keyid) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                keyid: keyid,
            }, "key/from/id/")
                .then((jsonresponse) => {
                return new Key(main.core).fromObject(jsonresponse);
            });
        });
    }
    createServer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                name: name,
                network: this.uuid
            }, "instance/server/create/")
                .then((jsonresponse) => {
                return new Instance(main.core, jsonresponse.uuid, jsonresponse.name, "SVR");
            });
        });
    }
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "instance/server/list/")
                .then((jsonresponse) => {
                var servers = new Array();
                jsonresponse.forEach((serverInstance) => {
                    servers.push(new Instance(main.core, serverInstance.uuid, serverInstance.name, "SVR"));
                });
                return servers;
            });
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
                .then((jsonresponse) => {
                var votingAnalytics = new Array();
                jsonresponse.forEach((votingAnalyticJSON) => {
                    var votingAnalytic = new VoteAnalytic().fromObject(votingAnalyticJSON);
                    votingAnalytics.push(votingAnalytic);
                });
                return votingAnalytics;
            });
        });
    }
    getVotingSites() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "instance/network/voting/site/list/")
                .then((jsonresponse) => {
                var siteArray = new Array();
                jsonresponse.forEach((votingSite) => {
                    var site = new VotingSite(main.core).fromObject(votingSite);
                    siteArray.push(site);
                });
                return siteArray;
            });
        });
    }
    getSetupVotingSites(displaySetup = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var url;
            if (displaySetup) {
                url = "instance/network/voting/site/list/setup/config/";
            }
            else {
                url = "instance/network/voting/site/list/setup/";
            }
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, url)
                .then((jsonresponse) => {
                if (displaySetup) {
                    var configArray = new Array();
                    jsonresponse.forEach((votingSite) => {
                        var siteConfig = new VotingSiteConfig(main.core).fromObject(votingSite);
                        configArray.push(siteConfig);
                    });
                    return configArray;
                }
                else {
                    var siteArray = new Array();
                    jsonresponse.forEach((votingSite) => {
                        var site = new VotingSite(main.core).fromObject(votingSite);
                        siteArray.push(site);
                    });
                    return siteArray;
                }
            });
        });
    }
    getGuild() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "instance/network/discord/get/guild/")
                .then((jsonresponse) => {
                return new DiscordGuild(main).fromObject(jsonresponse);
            });
        });
    }
    setGuild(discordGuildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                guildid: discordGuildId,
            }, "/instance/network/discord/setguild/")
                .then(() => {
                return true;
            });
        });
    }
    setSessionChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            return new Call(this.core)
                .commit({
                channelid: channelId,
            }, "instance/network/discord/setchannel/session/")
                .then(() => {
                return true;
            });
        });
    }
    setDonationChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                channelid: channelId,
            }, "instance/network/discord/setchannel/donation/")
                .then(() => {
                return true;
            });
        });
    }
    getHashes() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({}, "session/hash/list/")
                .then((jsonresponse) => {
                var response = new Array();
                jsonresponse.forEach((hashData) => {
                    var hash = new ConnectionHash(main.core);
                    response.push(hash.fromObject(hashData));
                });
                return response;
            });
        });
    }
    getOffences() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "punishment/offence/list/")
                .then((jsonresponse) => {
                var response = new Array();
                jsonresponse.forEach((offenceData) => {
                    var offence = new Offence(main.core);
                    response.push(offence.fromObject(offenceData));
                });
                return response;
            });
        });
    }
    getOffenceActions() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "punishment/action/list/")
                .then((jsonresponse) => {
                var response = new Array();
                jsonresponse.forEach((actionData) => {
                    var offence = new OffenceAction(main.core);
                    response.push(offence.fromObject(actionData));
                });
                return response;
            });
        });
    }
    searchPlayers(username, uuid, coreid) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                username: username,
            }, "player/from/minecraft/username/search/")
                .then((jsonresponse) => {
                var finalPlayerList = new Array();
                jsonresponse.forEach((playerData) => {
                    var player = new Player(main.core, playerData.coreid, playerData.username, playerData.uuid, playerData.verified);
                    finalPlayerList.push(player);
                });
                return finalPlayerList;
            });
        });
    }
    getPlayer(coreid) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                player: coreid,
            }, "player/from/core/id/")
                .then((jsonresponse) => {
                var player = new Player(main.core, jsonresponse.coreid, jsonresponse.username, jsonresponse.uuid, jsonresponse.verified);
                return player;
            });
        });
    }
    getPlayers(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var queryPage = 0;
            if (page != undefined && page != null) {
                queryPage = page;
            }
            return new Call(this.core)
                .commit({
                network: this.uuid,
                page: queryPage,
            }, "instance/network/list/players/")
                .then((jsonresponse) => {
                var players = new Array();
                jsonresponse.forEach((playerJson) => {
                    var player = new Player(main.core, playerJson.coreid, playerJson.username, playerJson.uuid, playerJson.verified);
                    players.push(player);
                });
                return players;
            });
        });
    }
    getPunishments(page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var queryPage = 0;
            if (page != undefined && page != null) {
                queryPage = page;
            }
            return new Call(this.core)
                .commit({
                network: this.uuid,
                page: queryPage,
            }, "punishment/list/")
                .then((jsonresponse) => {
                var response = new Array();
                jsonresponse.forEach((punishmentData) => {
                    var punishment = new Punishment(main.core);
                    response.push(punishment.fromObject(punishmentData));
                });
                return response;
            });
        });
    }
}
class GeoRestriction {
    constructor(index, country, state, city) {
        this.index = index;
        this.country = country;
        this.state = state;
        this.city = city;
    }
    fromObject(array) {
        this.index = array.index;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        return this;
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
}
class Key extends Core {
    constructor(core, type, uuid, hash, instance) {
        super(core.getTool());
        this.core = core;
        this.type = type;
        this.uuid = uuid;
        this.hash = hash;
        this.instance = instance;
    }
    fromObject(array) {
        this.type = array.type;
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        this.restrict = array.restrict;
        this.allowedReferrers = new Array();
        array.allowedReferrers.forEach((referrerJSON) => {
            this.allowedReferrers.push(new RefererRestriction().fromObject(referrerJSON));
        });
        this.allowedRegions = new Array();
        array.allowedRegions.forEach((regionJSON) => {
            this.allowedRegions.push(new GeoRestriction().fromObject(regionJSON));
        });
        return this;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            if (this.uuid != null) {
                return new Call(this.core)
                    .commit({
                    keyid: this.uuid,
                }, "key/from/id/")
                    .then((jsonresponse) => {
                    return new Key(main.core).fromObject(jsonresponse);
                });
            }
            else {
                return new Call(this.core)
                    .commit({
                    keyid: this.uuid,
                }, "key/from/hash/")
                    .then((jsonresponse) => {
                    return new Key(main.core).fromObject(jsonresponse);
                });
            }
        });
    }
    setRestrict(restrict) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var enableStr = "false";
            if (restrict) {
                enableStr = "true";
            }
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                enable: enableStr,
            }, "key/restriction/enable/")
                .then((jsonresponse) => {
                return new Key(main.core).fromObject(jsonresponse);
            });
        });
    }
    addReferer(ipOrHostname) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                host: ipOrHostname,
            }, "key/restriction/host/add/")
                .then((jsonresponse) => {
                return new RefererRestriction().fromObject(jsonresponse);
            });
        });
    }
    removeReferer(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                index: index,
            }, "restriction/host/remove/")
                .then((jsonresponse) => {
                return new RefererRestriction().fromObject(jsonresponse);
            });
        });
    }
    addGeo(country, state, city) {
        return __awaiter(this, void 0, void 0, function* () {
            var args = {};
            args["keyid"] = this.uuid;
            args["country"] = country;
            if (state != null) {
                args["state"] = state;
            }
            if (city != null) {
                args["city"] = city;
            }
            return new Call(this.core)
                .commit(args, "restriction/geo/add/")
                .then((jsonresponse) => {
                return new GeoRestriction().fromObject(jsonresponse);
            });
        });
    }
    removeGeo(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                keyid: this.uuid,
                index: index,
            }, "key/restriction/geo/remove/")
                .then((jsonresponse) => {
                return new GeoRestriction().fromObject(jsonresponse);
            });
        });
    }
}
class RefererRestriction {
    constructor(index, domain, ip) {
        this.index = index;
        this.domain = domain;
        this.ip = ip;
    }
    fromObject(array) {
        this.index = array.index;
        this.domain = array.domain;
        this.ip = array.ip;
        return this;
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
}
class BIOS {
    constructor(vendor, version) {
        this.vendor = vendor;
        this.version = version;
    }
    fromObject(array) {
        this.vendor = array.vendor;
        this.version = array.version;
        return this;
    }
    asArray() {
        return { vendor: this.vendor, version: this.version };
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
    fromObject(array) {
        this.manufacturer = array.manufacturer;
        this.brand = array.brand;
        this.vendor = array.vendor;
        this.speed = array.speed;
        this.maxSpeed = array.maxSpeed;
        this.physicalCores = array.physicalCores;
        this.virtualCores = array.virtualCores;
        return this;
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
}
class CPUUsage {
    constructor(clockSpeed, relativeUsage, mainThreadSlip) {
        this.clockSpeed = clockSpeed;
        this.relativeUsage = relativeUsage;
        this.mainThreadSlip = mainThreadSlip;
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
    fromObject(array) {
        this.size = array.size;
        this.name = array.name;
        this.type = array.type;
        this.interfaceType = array.interfaceType;
        this.serialNum = array.serialNum;
        return this;
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
}
class DriveUsage {
    constructor(max, used) {
        this.max = max;
        this.used = used;
    }
}
class Machine extends Core {
    constructor(core, hash, templates, cpuOverlap, publicm, country, state, city, lat, long, uuid, owner, ipv4, ipv6, port, bios, motherboard, cpu, ram, drives, adapters) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.templates = templates;
        this.cpuOverlap = cpuOverlap;
        this.public = publicm;
        this.country = country;
        this.state = state;
        this.city = city;
        this.lat = lat;
        this.long = long;
        this.hash = hash;
        this.uuid = uuid;
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
                .then(function () {
                return ip;
            });
        });
    }
    setIPV4(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(new Core(null, this.owner.core.dev))
                .commit({ ipv4: ip, hash: this.hash }, "machine/update/")
                .then(function () {
                return ip;
            });
        });
    }
    fromObject(array) {
        if (array.uuid != null && array.uuid != undefined) {
            this.uuid = array.uuid;
        }
        this.templates = new Array();
        array.templates.forEach(template => {
            this.templates.push(new HostingTemplate(this.core).fromObject(template));
        });
        this.cpuOverlap = array.cpuOverlap;
        this.public = array.public;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        this.lat = array.lat;
        this.long = array.long;
        if (array.owner != null && array.owner != undefined) {
            this.owner = new Owner(new Core(), array.id, array.name, array.surname, array.email);
        }
        if (array.ipv4 != null && array.ipv4 != undefined) {
            this.ipv4 = array.ipv4;
        }
        if (array.ipv6 != null && array.ipv6 != undefined) {
            this.ipv6 = array.ipv6;
        }
        if (array.port != null && array.port != undefined) {
            this.port = array.port;
        }
        if (array.bios != null && array.bios != undefined) {
            this.bios = new BIOS().fromObject(array.bios);
        }
        if (array.motherboard != null && array.motherboard != undefined) {
            this.motherboard = new Motherboard().fromObject(array.motherboard);
        }
        if (array.cpu != null && array.cpu != undefined) {
            this.cpu = new CPU().fromObject(array.cpu);
        }
        this.ram = new Array();
        array.ram.forEach((ramDim) => {
            this.ram.push(new RAM().fromObject(ramDim));
        });
        this.drives = new Array();
        array.drives.forEach((drive) => {
            this.drives.push(new Drive().fromObject(drive));
        });
        this.adapters = new Array();
        array.adapters.forEach((adapter) => {
            this.adapters.push(new NetworkAdapter().fromObject(adapter));
        });
        return this;
    }
    updateComponents(si, bios, motherboard, cpu, ram, drives, adapters) {
        return __awaiter(this, void 0, void 0, function* () {
            let mainObj = this;
            if (si != null) {
                bios = new BIOS(si.bios.vendor, si.bios.version);
                motherboard = new Motherboard(si.baseboard.manufacturer, si.baseboard.model);
                cpu = new CPU(si.cpu.manufacturer, si.cpu.brand, si.cpu.vendor, si.cpu.speed, si.cpu.speedmax, si.cpu.physicalCores, si.cpu.cores);
                ram = new Array();
                si.memLayout.forEach((ramStick) => {
                    ram.push(new RAM(ramStick.size, ramStick.clockSpeed, ramStick.manufacturer));
                });
                drives = new Array();
                si.diskLayout.forEach((disk) => {
                    drives.push(new Drive(disk.size, disk.name, disk.type, disk.interfaceType, disk.serialNum));
                });
                adapters = new Array();
                si.net.forEach((adapter) => {
                    adapters.push(new NetworkAdapter(adapter.speed, adapter.ifaceName));
                });
            }
            var params = {};
            if (bios != null && bios != undefined) {
                this.bios = bios;
                params["bios"] = JSON.stringify(bios.asArray());
            }
            if (motherboard != null && motherboard != undefined) {
                this.motherboard = motherboard;
                params["motherboard"] = JSON.stringify(motherboard.asArray());
            }
            if (cpu != null && cpu != undefined) {
                this.cpu = cpu;
                params["cpu"] = JSON.stringify(cpu.asArray());
            }
            if (ram != null && ram != undefined) {
                this.ram = ram;
                var ramDims = [];
                ram.forEach((ramDim) => {
                    ramDims.push(ramDim.asArray());
                });
                params["ram"] = JSON.stringify(ramDims);
            }
            if (drives != null && drives != undefined) {
                this.drives = drives;
                var drivesArray = [];
                drives.forEach((drive) => {
                    drivesArray.push(drive.asArray());
                });
                params["drives"] = JSON.stringify(drivesArray);
            }
            if (adapters != null && adapters != undefined) {
                this.adapters = adapters;
                var adapterArray = [];
                adapters.forEach((adapter) => {
                    adapterArray.push(adapter.asArray());
                });
                params["adapters"] = JSON.stringify(adapterArray);
            }
            params["hash"] = this.hash;
            return yield new Call(new Core(null, this.owner.core.dev))
                .commit(params, "machine/update/")
                .then(function () {
                return mainObj;
            });
        });
    }
}
class Motherboard {
    constructor(manufacturer, model) {
        this.manufacturer = manufacturer;
        this.model = model;
    }
    fromObject(array) {
        this.manufacturer = array.manufacturer;
        this.model = array.model;
        return this;
    }
    asArray() {
        return { manufacturer: this.manufacturer, model: this.model };
    }
}
class NetworkAdapter {
    constructor(speed, name) {
        this.speed = speed;
        this.name = name;
    }
    fromObject(array) {
        this.speed = array.speed;
        this.name = array.name;
        return this;
    }
    asArray() {
        return { speed: this.speed, name: this.name };
    }
}
class RAM {
    constructor(size, clockSpeed, manufacturer, voltage) {
        this.size = size;
        this.clockSpeed = clockSpeed;
        this.manufacturer = manufacturer;
        this.voltage = voltage;
    }
    fromObject(array) {
        this.size = array.size;
        this.clockSpeed = array.clockSpeed;
        this.manufacturer = array.manufacturer;
        this.voltage = array.voltage;
        return this;
    }
    asArray() {
        return {
            size: this.size,
            clockSpeed: this.clockSpeed,
            manufacturer: this.manufacturer,
            voltage: this.voltage,
        };
    }
}
class RAMUsage {
    constructor(max, used) {
        this.max = max;
        this.used = used;
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
}
class AppealStatus extends Core {
    constructor(core, status, appealId) {
        super(core.getTool());
        this.status = status;
        this.appealId = appealId;
    }
    getAppeal() {
        // to-do
    }
    toString() {
        return this.status;
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.type = array.type;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.negativePoints = parseInt(array.negativePoints);
        return this;
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.cmd = new Command(this.core, array.cmd.cmdId, array.cmd.cmdString, this.network);
        this.requiredPoints = parseInt(array.requiredPoints);
        this.pointsType = array.pointsType;
        this.punishmentType = array.punishmentType;
        this.name = array.name;
        this.description = array.description;
        return this;
    }
}
class Punishment extends Core {
    constructor(core, player, offenceList, moderator, network, pointsChat, pointsGameplay, report, notes, appealStatus) {
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        var finalOffenceList = new Array();
        array.offenceList.forEach((offenceArray) => {
            var offence = new Offence(this.core);
            finalOffenceList.push(offence.fromObject(offenceArray));
        });
        this.offenceList = finalOffenceList;
        this.moderator = new Player(this.core, array.createdBy.coreid, array.createdBy.username, array.createdBy.uuid, array.createdBy.verified);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.pointsChat = array.pointsAddedChat;
        this.pointsGameplay = array.pointsAddedGameplay;
        if (array.report == null) {
            this.report = null;
        }
        else {
            // to-do: report implementation
        }
        this.appealStatus = new AppealStatus(this.core, array.appealStatus.status, array.appealStatus.appealId);
        return this;
    }
    getStatus() {
        return this.appealStatus;
    }
    getPlayer() {
        return this.player;
    }
    getOffenceList() {
        return this.offenceList;
    }
    getPoints(type) {
        if (type == "GMP") {
            return this.pointsGameplay;
        }
        else if (type == "CHT") {
            return this.pointsChat;
        }
        else {
            throw new Error("invalid point selection type");
        }
    }
}
class Report {
    constructor(parameters) { }
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
    }
    getOwner() {
        if (this.owner == null) {
            return new Owner(this.core, null, null, null, null);
        }
        else {
            return this.owner;
        }
    }
    getUser() {
        if (this.player == undefined && this.owner != undefined) {
            return new Owner(this.core, this.owner.getId(), this.owner.getName(), this.owner.getSurname(), this.owner.getEmail());
        }
        else {
            return new Player(this.core, this.player.getId(), this.player.getUsername(), this.player.getUuid(), this.player.verified);
        }
    }
    fromObject(array) {
        var core = this.core;
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.device = new SessionDevice(array.device.brand, array.device.device, array.device.model, array.device.os);
        this.location = new SessionLocation(array.location.city, array.location.state, array.location.country_code);
        this.usage = new SessionUsage(array.usage.creation, array.usage.uses);
        if ("network" in array) {
            this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
            this.core = new Core(new Session(new Core(null, core.dev), this.uuid, this.hash, this.device, this.location, this.usage, this.network, null), core.dev);
        }
        else {
            this.core = new Core(new Session(new Core(null, core.dev), this.uuid, this.hash, this.device, this.location, this.usage, null, null), core.dev);
        }
        if ("player" in array) {
            this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        }
        else if ("owner" in array) {
            this.owner = new Owner(this.core, array.owner.uuid, array.owner.name, array.owner.surname, array.owner.email);
        }
        return this;
    }
    fromHash(sessionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            var hash = sessionHash;
            return yield new Call(this.core)
                .commit({ hash: hash }, "session/get/")
                .then(function (jsonresponse) {
                return new Session(core).fromObject(jsonresponse);
            });
        });
    }
    getId() {
        return this.uuid;
    }
    getHash() {
        return this.hash;
    }
    getPlayer() {
        if (this.player == null) {
            return new Player(this.core, null);
        }
        else {
            return this.player;
        }
    }
    getMachines() {
        return __awaiter(this, void 0, void 0, function* () {
            var hash = this.hash;
            return yield new Call(this.core)
                .commit({ hash: hash }, "machine/list/")
                .then(function (jsonresponse) {
                var machines = new Array();
                jsonresponse.forEach((machineJSON) => {
                    machines.push(new Machine(this.core).fromObject(machineJSON));
                });
                return machines;
            });
        });
    }
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return yield new Call(this.core)
                .commit({}, "instance/network/list/")
                .then(function (jsonresponse) {
                var networks = new Array();
                jsonresponse.forEach((network) => {
                    networks.push(new Network(core, new Instance(core, network.uuid, network.name, "NTW")));
                });
                return networks;
            });
        });
    }
}
class SessionDevice {
    constructor(brand, device, model, os) {
        this.brand = brand;
        this.device = device;
        this.model = model;
        this.os = os;
    }
}
class SessionLocation {
    constructor(city, state, country_code) {
        this.city = city;
        this.state = state;
        this.country_code = country_code;
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
        return ("https://api.purecore.io/link/discord/redirect/?uuid=" +
            this.uuid +
            "&hash=" +
            this.token);
    }
    getToken() {
        return this.token;
    }
    getSession() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            var token = this.token;
            return yield new Call(this.core)
                .commit({ token: token }, "session/hash/token/exchange/")
                .then(function (jsonresponse) {
                return new Session(core).fromObject(jsonresponse);
            });
        });
    }
}
class SessionUsage {
    constructor(creation, uses) {
        this.creation = creation;
        this.uses = uses;
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
    fromObject(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.upgradable = array.upgradable;
        return this;
    }
    getId() {
        return this.uuid;
    }
    createItem(name, description, price) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.network.uuid,
                name: name,
                description: description,
                category: this.uuid,
                price: price,
            }, "store/item/create/")
                .then((jsonresponse) => {
                return new StoreItem(main.core).fromObject(jsonresponse);
            });
        });
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
        this.perks = new Array();
    }
    addPerk(perk, quantity = "undefined") {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            var perkId = null;
            if (typeof perk == "string") {
                perkId = perk;
            }
            else {
                perkId = perk.uuid;
            }
            return new Call(this.core)
                .commit({
                network: this.network.uuid,
                item: this.uuid,
                perk: perkId,
                quantity: quantity,
            }, "store/item/add/perk/")
                .then((jsonresponse) => {
                return new PerkContextualized(main.core).fromObject(jsonresponse);
            });
        });
    }
    getId() {
        return this.uuid;
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.category = new StoreCategory(this.core).fromObject(array.category);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.price = array.price;
        if (array.perks != null) {
            array.perks.forEach((perkJson) => {
                this.perks.push(new PerkContextualized(this.core).fromObject(perkJson));
            });
        }
        else {
            this.perks = new Array();
        }
        return this;
    }
    getOrganizedPerks() {
        var perkOrganized = [];
        this.perks.forEach((perk) => {
            if (perk.perk.category.uuid in perkOrganized) {
                perkOrganized[perk.perk.category.uuid].push(perk);
            }
            else {
                perkOrganized[perk.perk.category.uuid] = new Array();
                perkOrganized[perk.perk.category.uuid].push(perk);
            }
        });
        var organizedPerkCategories = new Array();
        for (const key in perkOrganized) {
            var category = null;
            perkOrganized[key].forEach((conperk) => {
                if (conperk.perk.category.uuid == key) {
                    category = conperk.perk.category;
                }
            });
            var organizedCat = new OrganizedPerkCategory(category, perkOrganized[key]);
            organizedPerkCategories.push(organizedCat);
        }
        return organizedPerkCategories;
    }
}
class NestedItem extends Core {
    constructor(core) {
        super(core.getTool());
        this.core = core;
    }
    fromObject(array) {
        this.category = new StoreCategory(this.core).fromObject(array.category);
        this.uuid = this.category.getId();
        this.items = new Array();
        array.products.forEach((product) => {
            this.items.push(new StoreItem(this.core).fromObject(product));
        });
        return this;
    }
    getCategory() {
        return this.category;
    }
    getItems() {
        return this.items;
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
class ParamRequirement {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
class Perk extends Core {
    constructor(core, uuid, network, name, description, type, category, commands, params) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
        this.commands = commands;
        this.params = params;
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = new PerkCategory(this.core).fromObject(array.category);
        var commands = new Array();
        array.commands.forEach((cmd) => {
            commands.push(new StoreCommand(this.core).fromObject(cmd));
        });
        this.commands = commands;
        this.params = new Array();
        if (array.params == null) {
            this.params = null;
        }
        else {
            array.params.forEach(param => {
                this.params.push(new PerkParam(this.core).fromObject(param));
            });
        }
        return this;
    }
    addParam(placeholder, name, description, type, mandatory, defaultv) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mandatory == null)
                mandatory = false;
            if (defaultv == null)
                defaultv = "null";
            var strMandatory = null;
            mandatory ? (strMandatory = 'true') : (strMandatory = 'false');
            return new Call(this.core)
                .commit({
                perk: this.uuid,
                placeholder: placeholder,
                name: name,
                description: description,
                type: type,
                mandatory: strMandatory,
                default: defaultv,
            }, "store/perk/param/add/")
                .then((jsonresponse) => {
                return new PerkParam(this.core).fromObject(jsonresponse);
            });
        });
    }
    addCmd(cmd, needsOnline, executeOn) {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this.core;
            var ids = [];
            executeOn.forEach((instance) => {
                ids.push(instance.uuid);
            });
            var needsOnlineStr = "false";
            if (needsOnline) {
                needsOnlineStr = "true";
            }
            return new Call(this.core)
                .commit({
                network: this.uuid,
                perk: this.uuid,
                cmd: cmd,
                needsOnline: needsOnline,
                instances: JSON.stringify(ids),
            }, "store/perk/cmd/add/")
                .then((jsonresponse) => {
                var commands = new Array();
                jsonresponse.forEach((cmd) => {
                    commands.push(new StoreCommand(core).fromObject(cmd));
                });
                return commands;
            });
        });
    }
}
class PerkCategory extends Core {
    constructor(core, uuid, name, network) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        try {
            this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        }
        catch (error) {
            this.network = null;
        }
        return this;
    }
    createPerk(name, description, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                name: name,
                description: description,
                type: type.toUpperCase(),
                category: this.uuid,
            }, "store/perk/create/")
                .then((jsonresponse) => {
                return new Perk(core).fromObject(jsonresponse);
            });
        });
    }
}
class PerkContextualized extends Core {
    constructor(core, perk, quantity) {
        super(core.getTool());
        this.core = core;
        this.perk = perk;
        this.quantity = quantity;
    }
    fromObject(array) {
        this.perk = new Perk(this.core).fromObject(array.perk);
        this.quantity = array.quantity;
        return this;
    }
}
class PerkParam extends Core {
    constructor(core, uuid, placeholder, perk, name, description, network, type, defaultv, mandatory, requirements) {
        super(core.getTool(), core.dev);
        this.core = core;
        this.uuid = uuid;
        this.placeholder = placeholder;
        this.perk = perk;
        this.name = name;
        this.description;
        this.network = network;
        this.type = type;
        this.default = defaultv;
        this.mandatory = mandatory;
        this.requirements = requirements;
    }
    fromObject(object) {
        this.uuid = object.uuid;
        this.placeholder = object.placeholder;
        this.perk = new Perk(this.core).fromObject(object.perk);
        this.name = object.name;
        this.description = object.description;
        this.network = new Network(this.core, new Instance(this.core, object.network.uuid, object.network.name, "NTW"));
        this.type = object.type;
        this.default = object.default;
        this.mandatory = object.mandatory;
        this.requirements = new Array();
        object.requirements.forEach(requirement => {
            this.requirements.push(new ParamRequirement(requirement.type, requirement.value));
        });
        return this;
    }
    /**
    * @param type the type of requirement: regex, size (img only), imgtype https://www.iana.org/assignments/media-types/media-types.xhtml#image)
    * @param value string when regex, array [width,height] for size, array ['image/png','image/jpg','class/type'...] for imgtype
    * if a requirement of that type is already present, it will overwrite its properties
    * for regex values, javascript ignores \ when followed by /, so use \\/ (double backslash)
    */
    addRequirement(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var finalv = value;
            if (typeof value != 'string')
                finalv = JSON.stringify(value);
            return new Call(this.core)
                .commit({
                param: this.uuid,
                type: type,
                value: finalv,
            }, "store/perk/param/requirement/add/")
                .then(() => {
                return new ParamRequirement(type, value);
            });
        });
    }
    /**
    * @param type the type of requirement to remove: regex, size, imgtype
    * throws error if there are no requirements of that type
    */
    removeRequirement(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                param: this.uuid,
                type: type,
            }, "store/perk/param/requirement/remove/")
                .then(() => {
                return true;
            });
        });
    }
    /**
    * @param value string or url to test
    * throws error if the tests are not passed
    */
    test(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                param: this.uuid,
                str: value,
            }, "store/perk/param/requirement/test/")
                .then(() => {
                return true;
            });
        });
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
                .then((jsonresponse) => {
                var IncomeAnalytics = new Array();
                jsonresponse.forEach((IncomeAnalyticJSON) => {
                    var IncomeAnalyticD = new IncomeAnalytic().fromObject(IncomeAnalyticJSON);
                    IncomeAnalytics.push(IncomeAnalyticD);
                });
                return IncomeAnalytics;
            });
        });
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                item: id,
            }, "store/item/")
                .then((jsonresponse) => {
                return new StoreItem(core).fromObject(jsonresponse);
            });
        });
    }
    getPerks() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "store/perk/list/")
                .then((jsonresponse) => {
                var perklist = new Array();
                jsonresponse.forEach((element) => {
                    perklist.push(new Perk(core).fromObject(element));
                });
                return perklist;
            });
        });
    }
    getPerkCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "store/perk/category/list/")
                .then((jsonresponse) => {
                var perklist = new Array();
                jsonresponse.forEach((element) => {
                    perklist.push(new PerkCategory(core).fromObject(element));
                });
                return perklist;
            });
        });
    }
    getGateways() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "store/gateway/list/")
                .then((jsonresponse) => {
                var methods = new Array();
                jsonresponse.forEach((gtw) => {
                    var gtf = new Gateway(gtw.name, null, null, null);
                    methods.push(gtf);
                });
                return methods;
            });
        });
    }
    itemIdList(list) {
        var finalList = new Array();
        list.forEach((item) => {
            finalList.push(new StoreItem(new Core(), item.uuid));
        });
        return finalList;
    }
    itemIdListFromJSON(json) {
        var finalList = new Array();
        json.forEach((item) => {
            finalList.push(new StoreItem(new Core(), item.uuid));
        });
        return finalList;
    }
    getStripeWalletLink() {
        var hash = this.network.core.getCoreSession().getHash();
        var ntwid = this.network.getId();
        return ("https://api.purecore.io/link/stripe/wallet/?hash=" +
            hash +
            "&network=" +
            ntwid);
    }
    getPayPalWalletLink() {
        var hash = this.network.core.getCoreSession().getHash();
        var ntwid = this.network.getId();
        return ("https://api.purecore.io/link/paypal/wallet/?hash=" +
            hash +
            "&network=" +
            ntwid);
    }
    requestPayment(itemList, username, billingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (billingAddress == null) {
                billingAddress = new BillingAddress();
            }
            let core = this.network.core;
            var idList = [];
            itemList.forEach((item) => {
                idList.push(item.uuid);
            });
            return new Call(this.core)
                .commit({
                network: this.uuid,
                username: username,
                products: escape(JSON.stringify(idList)),
                billing: JSON.stringify(billingAddress),
            }, "payment/request/")
                .then((jsonresponse) => {
                return new CorePaymentRequest(core).fromObject(jsonresponse);
            });
        });
    }
    getNetwork() {
        return this.network;
    }
    getPayments(page) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.network.core;
            var queryPage = 0;
            if (page != undefined || page != null) {
                queryPage = page;
            }
            return new Call(this.core)
                .commit({
                network: this.uuid,
                page: page,
            }, "/payment/list/")
                .then((jsonresponse) => {
                var payments = new Array();
                jsonresponse.forEach((paymentJson) => {
                    payments.push(new Payment(core).fromObject(paymentJson));
                });
                return payments;
            });
        });
    }
    unlinkGateway(gatewayName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                network: this.uuid,
                gateway: gatewayName,
            }, "store/gateway/unlink/")
                .then((jsonresponse) => {
                return jsonresponse.success;
            });
        });
    }
    createPerkCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                name: name,
            }, "store/perk/category/create/")
                .then((jsonresponse) => {
                return new PerkCategory(core).fromObject(jsonresponse);
            });
        });
    }
    createCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
                name: name,
                description: description,
            }, "store/category/create/")
                .then((jsonresponse) => {
                return new StoreCategory(core).fromObject(jsonresponse);
            });
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                try {
                    this.getPackages().then(function (nestedItems) {
                        var categories = new Array();
                        nestedItems.forEach((nestedItem) => {
                            categories.push(nestedItem.category);
                        });
                        resolve(categories);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            let core = this.network.core;
            return new Call(this.core)
                .commit({
                network: this.uuid,
            }, "store/item/list/")
                .then((jsonresponse) => {
                var response = new Array();
                jsonresponse.forEach((nestedData) => {
                    response.push(new NestedItem(core).fromObject(nestedData));
                });
                return response;
            });
        });
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
    fromObject(array) {
        this.network = new Instance(this.core, array.network.uuid, array.network.name, "NTW").asNetwork();
        if (typeof array.cmd == "string") {
            this.cmd = new Command(this.core, array.cmd, null, this.network);
        }
        else {
            this.cmd = new Command(this.core, array.cmd.cmdId, array.cmd.cmdString, this.network);
        }
        this.needsOnline = array.needs_online;
        this.listId = array.listid;
        var instances = new Array();
        array.execute_on.forEach((instance) => {
            if (typeof instance == "string") {
                instances.push(new Instance(this.core, instance, null, "UNK"));
            }
            else {
                instances.push(new Instance(this.core, instance.uuid, instance.name, "UNK"));
            }
        });
        this.executeOn = instances;
        return this;
    }
    getCommand() {
        return this.cmd;
    }
}
class BillingAddress {
    constructor(name, email, country, state, city, postalcode, line1, line2) {
        this.name = name;
        this.email = email;
        this.city = city;
        this.country = country;
        this.state = state;
        this.postalcode = postalcode;
        this.line1 = line1;
        this.line2 = line2;
    }
    fromObject(array) {
        this.name = array.name;
        this.email = array.email;
        this.country = array.country;
        this.state = array.state;
        this.city = array.city;
        this.postalcode = array.postalcode;
        this.line1 = array.line1;
        if (array.line2 != null && array.line2 != "") {
            this.line2 = array.line2;
        }
        else {
            this.line2 = null;
        }
        return this;
    }
}
class Discount {
    constructor(type, uuid, description, amount) {
        this.type = type;
        this.uuid = uuid;
        this.description = description;
        this.amount = amount;
    }
}
class Gateway {
    constructor(name, url, color, logo) {
        this.name = name;
        this.url = url;
        this.color = color;
        this.logo = logo;
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
        this.sessions = new Array();
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.request = new CorePaymentRequest(this.core).fromObject(array.request);
        this.gateway = new Gateway(array.gateway.name, array.gateway.url, array.gateway.color, array.gateway.logo);
        this.metadata = array.metadata;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.legacyUsername = array.legacyUsername;
        try {
            this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        }
        catch (error) {
            this.player = null;
        }
        // this.sessions = ... (TODO)
        return this;
    }
}
class CorePaymentRequest extends Core {
    constructor(core) {
        super(core.getTool());
        this.core = new Core(core.getTool());
        this.products = new Array();
        this.sessionList = new Array();
        this.warnings = new Array();
        this.discounts = new Array();
        this.gateways = new Array();
    }
    isPaid() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Call(this.core)
                .commit({
                request: this.uuid,
            }, "payment/request/isPaid/")
                .then((jsonresponse) => {
                return jsonresponse.paid;
            });
        });
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.store = new Store(new Network(this.core, new Instance(this.core, array.store.network.uuid, array.store.network.name, "NTW")));
        array.products.forEach((product) => {
            this.products.push(new StoreItem(this.core).fromObject(product));
        });
        this.username = array.username;
        try {
            this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        }
        catch (error) {
            this.player = null;
        }
        if (array.sessionList != null) {
            array.sessionList.forEach((session) => {
                // TODO
            });
        }
        if (array.warnings != null) {
            array.warnings.forEach((warning) => {
                try {
                    this.warnings.push(new Warning(warning.cause, warning.text));
                }
                catch (error) {
                    // ignore
                }
            });
        }
        if (array.discounts != null) {
            array.discounts.forEach((discount) => {
                try {
                    this.discounts.push(new Discount(discount.type, discount.id, discount.description, discount.amount));
                }
                catch (error) {
                    // ignore
                }
            });
        }
        if (array.gateways != null) {
            array.gateways.forEach((gateway) => {
                this.gateways.push(new Gateway(gateway.name, gateway.url, gateway.color, gateway.logo));
            });
        }
        this.due = array.due;
        this.currency = array.currency;
        return this;
    }
}
class Warning {
    constructor(cause, text) {
        this.cause = cause;
        this.text = text;
    }
}
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
            var args = {};
            if (pm == null) {
                args = {
                    plan: plan,
                    billing: JSON.stringify(billingAddress),
                };
            }
            else {
                var pmid = null;
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
                .commit({}, "account/subscribe/stripe/")
                .then(function (jsonresponse) {
                return new StripeSubscription(jsonresponse.id);
            });
        });
    }
    paypalSubscribe(plan, billingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({
                plan: plan,
                billing: JSON.stringify(billingAddress),
            }, "account/subscribe/paypal/")
                .then(function (jsonresponse) {
                return new PayPalSubscription(jsonresponse.url, jsonresponse.id);
            });
        });
    }
    getBillingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "account/billing/get/")
                .then(function (jsonresponse) {
                return new BillingAddress().fromObject(jsonresponse);
            });
        });
    }
    updateBillingAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({
                billing: JSON.stringify(address)
            }, "account/billing/update/")
                .then(function (jsonresponse) {
                return new BillingAddress().fromObject(jsonresponse);
            });
        });
    }
    addPaymentMethod(pm) {
        return __awaiter(this, void 0, void 0, function* () {
            var pmid = null;
            if (typeof pm == "string") {
                pmid = pm;
            }
            else {
                pmid = pm.paymentMethod.id;
            }
            return yield new Call(this.core)
                .commit({
                pm: pmid,
            }, "account/card/add/")
                .then(function (jsonresponse) {
                return jsonresponse;
            });
        });
    }
    removePaymentMethod(pm) {
        return __awaiter(this, void 0, void 0, function* () {
            var pmid = null;
            if (typeof pm == "string") {
                pmid = pm;
            }
            else {
                pmid = pm.paymentMethod.id;
            }
            return yield new Call(this.core)
                .commit({
                pm: pmid,
            }, "account/card/remove/")
                .then(function (jsonresponse) {
                return jsonresponse.success;
            });
        });
    }
    getPaymentMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "account/card/list/")
                .then(function (jsonresponse) {
                // array of https://stripe.com/docs/api/payment_methods/object
                return jsonresponse;
            });
        });
    }
    createTemplate(supportedImages, memory, size, cores, price) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            var args = {};
            if (price == null) {
                args = {
                    supportedImages: JSON.stringify(supportedImages),
                    memory: String(memory),
                    size: String(size),
                    cores: String(cores),
                    price: String(price)
                };
            }
            else {
                args = {
                    supportedImages: JSON.stringify(supportedImages),
                    memory: String(memory),
                    size: String(size),
                    cores: String(cores),
                };
            }
            return yield new Call(this.core)
                .commit(args, "hosting/template/create/")
                .then(function (jsonresponse) {
                return new HostingTemplate(core).fromObject(jsonresponse);
            });
        });
    }
    createNetwork(name, game, cname, ip, port) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            var args = {};
            if (ip == null) {
                args = {
                    name: name,
                    game: game,
                    cname: cname,
                };
            }
            else if (port == null) {
                args = {
                    name: name,
                    game: game,
                    cname: cname,
                    ip: ip,
                };
            }
            else {
                args = {
                    name: name,
                    game: game,
                    cname: cname,
                    ip: ip,
                    port: port,
                };
            }
            return yield new Call(this.core)
                .commit(args, "instance/network/create/")
                .then(function (jsonresponse) {
                var network = new Network(core, new Instance(core, jsonresponse.uuid, jsonresponse.name, "NTW"));
                return network;
            });
        });
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
    fromObject(object) {
        this.id = object.coreid;
        this.username = object.username;
        this.uuid = object.uuid;
        this.verified = object.verified;
        return this;
    }
    closeConnections(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return yield new Call(core)
                .commit({ instance: instance.getId(), uuid: this.uuid }, "connection/close/all/")
                .then(function (jsonresponse) {
                var connectionsClosed = new Array();
                jsonresponse.forEach((connectionJson) => {
                    connectionsClosed.push(new Connection(core).fromObject(connectionJson));
                });
                return connectionsClosed;
            });
        });
    }
    openConnection(ip, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return yield new Call(core)
                .commit({
                instance: instance.getId(),
                ip: ip,
                username: this.username,
                uuid: this.uuid,
            }, "connection/new/")
                .then(function (jsonresponse) {
                return new Connection(core).fromObject(jsonresponse);
            });
        });
    }
    getBillingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            return yield new Call(core)
                .commit({}, "player/billing/get/")
                .then(function (jsonresponse) {
                return new BillingAddress().fromObject(jsonresponse);
            });
        });
    }
    getPunishments(network, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = this.id;
            var core = this.core;
            var queryPage = 0;
            if (page != undefined || page != null) {
                queryPage = page;
            }
            var args = {};
            if (network != null) {
                args = {
                    page: page.toString(),
                    player: id,
                    network: network.getId(),
                };
            }
            else {
                args = {
                    player: id,
                    page: page.toString(),
                };
            }
            return yield new Call(core)
                .commit(args, "player/punishment/list/")
                .then(function (jsonresponse) {
                var punishments = new Array();
                jsonresponse.forEach((punishmentJson) => {
                    punishments.push(new Punishment(core).fromObject(punishmentJson));
                });
                return punishments;
            });
        });
    }
    getPayments(store, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = this.id;
            var core = this.core;
            var queryPage = 0;
            if (page != undefined || page != null) {
                queryPage = page;
            }
            return yield new Call(core)
                .commit({
                network: store.getNetwork().getId(),
                page: queryPage.toString(),
                player: id,
            }, "player/payment/list/")
                .then(function (jsonresponse) {
                var payments = new Array();
                jsonresponse.forEach((paymentJson) => {
                    payments.push(new Payment(core).fromObject(paymentJson));
                });
                return payments;
            });
        });
    }
    getDiscordId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Call(this.core)
                .commit({}, "player/payment/list/")
                .then(function (jsonresponse) {
                return String(jsonresponse.id);
            });
        });
    }
    getConnections(instance, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = this.id;
            var core = this.core;
            var queryPage = 0;
            if (page != undefined || page != null) {
                queryPage = page;
            }
            var args = {};
            if (instance != null) {
                args = { page: queryPage, player: id, instance: instance.getId() };
            }
            else {
                args = { page: queryPage, player: id };
            }
            return yield new Call(this.core)
                .commit(args, "player/connection/list/")
                .then(function (jsonresponse) {
                var connections = new Array();
                jsonresponse.forEach((connectionJson) => {
                    connections.push(new Connection(core).fromObject(connectionJson));
                });
                return connections;
            });
        });
    }
    getMatchingConnections(instance, page, playerList) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = this.id;
            var queryPage = 0;
            var playerListIds = [];
            playerList.forEach((player) => {
                playerListIds.push(player.getId());
            });
            if (page != undefined || page != null) {
                queryPage = page;
            }
            return yield new Call(this.core)
                .commit({
                instance: instance.getId(),
                page: queryPage,
                players: JSON.stringify(playerListIds),
                player: id,
            }, "connection/list/match/players/")
                .then(function (jsonresponse) {
                var activityMatch = new Array();
                jsonresponse.forEach((activity) => {
                    var matchingRanges = new Array();
                    activity.matchList.forEach((matchingRangeJson) => {
                        var matchingRange = new MatchingRange(new Date(matchingRangeJson.startedOn * 1000), new Date(matchingRangeJson.finishedOn * 1000), matchingRangeJson.matchWith);
                        matchingRanges.push(matchingRange);
                    });
                    activityMatch.push(new ActivityMatch(new Date(activity.startedOn * 1000), new Date(activity.finishedOn * 1000), activity.activity, matchingRanges));
                });
                return activityMatch;
            });
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
    }
    fromObject(array) {
        this.uuid = array.uuid;
        this.supervisor = new Owner(this.core, array.supervisor.id, array.supervisor.name, array.supervisor.surname, array.supervisor.email);
        this.resetTimes = array.resetTimes;
        this.timezone = array.timezone;
        this.name = array.name;
        this.url = array.url;
        this.technicalName = array.technicalName;
        return this;
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
}
class VotingSiteConfig extends Core {
    constructor(core, network, votingSite, url) {
        super(core.getTool());
        this.core = core;
        this.network = network;
        this.votingSite = votingSite;
        this.url = url;
    }
    fromObject(array) {
        this.votingSite = new VotingSite(this.core).fromObject(array.votingSite);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.url = array.url;
        return this;
    }
    setURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this;
            return new Call(this.core)
                .commit({
                network: this.network.uuid,
                url: url,
                site: this.votingSite.uuid,
            }, "instance/network/voting/site/setup/")
                .then((jsonresponse) => {
                main.url = jsonresponse.url;
                return this;
            });
        });
    }
}
