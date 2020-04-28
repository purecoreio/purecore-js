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
    constructor(tool) {
        if (tool != undefined) {
            if (typeof tool == "string") {
                this.key = tool;
            }
            else if (typeof tool == "object") {
                if (tool instanceof Session) {
                    this.session = tool;
                }
                else {
                    this.session = new Session(new Core(this.session)).fromArray(tool);
                }
            }
        }
        // if not start with fromdiscord or fromtoken
    }
    getPlans() {
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/plan/list/", { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error);
                    }
                    else {
                        var response = new Array();
                        jsonresponse.forEach(planData => {
                            var plan = new Plan().fromArray(planData);
                            response.push(plan);
                        });
                        resolve(response);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    requestGlobalHash() {
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/session/hash/list/", { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error);
                    }
                    else {
                        var response = new Array();
                        jsonresponse.forEach(hashData => {
                            var hash = new ConnectionHashGlobal(new Core());
                            response.push(hash.fromArray(hashData));
                        });
                        resolve(response);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPlayersFromIds(ids) {
        var playerList = new Array();
        ids.forEach(id => {
            playerList.push(new Player(this, id));
        });
        return playerList;
    }
    getMachine(hash) {
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/machine/?hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(new Machine().fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    fromToken(GoogleToken) {
        var obj = this;
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/session/from/google/?token=" + GoogleToken, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    if ("error" in response) {
                        throw new Error(response.error + ". " + response.msg);
                    }
                    else {
                        var session = new Session(new Core(null)).fromArray(response);
                        obj.session = session;
                        resolve(obj);
                    }
                }).catch(function (error) {
                    throw error;
                });
            }
            catch (e) {
                reject(e.message);
            }
        });
    }
    asBillingAddress(array) {
        return new BillingAddress().fromArray(array);
    }
    getWorkbench() {
        return new Workbench();
    }
    pushFCM(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this;
            var url;
            if (core.getCoreSession() != null) {
                if (this.getTool() instanceof Session) {
                    url = "https://api.purecore.io/rest/2/account/push/fcm/?hash=" + core.getCoreSession().getHash() + "&token=" + token;
                }
                try {
                    return yield fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            return true;
                        }
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
            }
            else {
                throw new Error("invalid account");
            }
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
    fromDiscord(guildId, botToken, devkey) {
        return __awaiter(this, void 0, void 0, function* () {
            var obj = this;
            return new Promise(function (resolve, reject) {
                try {
                    var params = "";
                    if (devkey == true) {
                        params = "?guildid=" + guildId + "&token=" + botToken + "&devkey=true";
                    }
                    else {
                        params = "?guildid=" + guildId + "&token=" + botToken;
                    }
                    return fetch("https://api.purecore.io/rest/2/key/from/discord/?token=" + params, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (response) {
                        if ("error" in response) {
                            throw new Error(response.error + ". " + response.msg);
                        }
                        else {
                            obj.key = response.hash;
                            resolve(obj);
                        }
                    }).catch(function (error) {
                        throw error;
                    });
                }
                catch (e) {
                    reject(e.message);
                }
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
            this.fields.forEach(element => {
                if (element.getName().includes("%")) {
                    final.push(element);
                }
            });
        }
        else {
            this.fields.forEach(element => {
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
        array.forEach(element => {
            var analytic = element.getLegacy();
            final.push(analytic);
        });
        return final;
    }
    stack(analytics = new Array(), maxSeconds = 0) {
        var finalAnalytics = new Array();
        var timestampStart = null;
        var itemBeingWorkedOn = null;
        analytics.forEach(analytic => {
            if (timestampStart == null) {
                timestampStart = analytic.getTimestamp();
                itemBeingWorkedOn = analytic;
            }
            else {
                if ((analytic.getTimestamp() - timestampStart) >= maxSeconds) {
                    finalAnalytics.push(itemBeingWorkedOn);
                    itemBeingWorkedOn = analytic;
                    timestampStart = analytic.getTimestamp();
                }
                else {
                    if (itemBeingWorkedOn.getOriginal() instanceof VoteAnalytic || itemBeingWorkedOn.getOriginal() instanceof IncomeAnalytic) {
                        var fields = itemBeingWorkedOn.getFields();
                        var newFields = new Array();
                        fields.forEach(field => {
                            analytic.getFields().forEach(fieldTemporal => {
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
                        fields.forEach(field => {
                            analytic.getFields().forEach(fieldTemporal => {
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
        analyticArray.forEach(analytic => {
            var timestamp = analytic.getTimestamp();
            analytic.getFields(onlyRelative).forEach(field => {
                if (!(field.getTechnicalName() in fieldData)) {
                    fieldData[field.getTechnicalName()] = {};
                    fieldData[field.getTechnicalName()]["values"] = [];
                    fieldData[field.getTechnicalName()]["name"] = field.getName();
                }
                fieldData[field.getTechnicalName()].values.push({
                    x: timestamp,
                    y: field.getValue()
                });
            });
        });
        var finalSeries = [];
        for (const key in fieldData) {
            if (fieldData.hasOwnProperty(key)) {
                const element = fieldData[key];
                var finalSerie = {
                    name: element.name,
                    data: element.values
                };
                finalSeries.push(finalSerie);
            }
        }
        return finalSeries;
    }
}
class Plan {
    constructor(uuid, name, price, features) {
        this.uuid = uuid;
        this.name = name;
        this.price = price;
        this.features = features;
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.price = array.price;
        this.features = new Array();
        array.features.forEach(planSectionJSON => {
            var planSection = new PlanSection().fromArray(planSectionJSON);
            this.features.push(planSection);
        });
        return this;
    }
}
class PlanFeature {
    constructor(technicalName, value, displayValue, name) {
        this.technicalName = technicalName;
        this.value = value;
        this.displayValue = displayValue;
        this.name = name;
    }
    fromArray(array) {
        this.technicalName = array.technical_name;
        this.value = array.value;
        this.displayValue = array.displayValue;
        this.name = array.name;
        return this;
    }
}
class PlanSection {
    constructor(name, features) {
        this.name = name;
        this.features = features;
    }
    fromArray(array) {
        this.name = array.name;
        this.features = new Array();
        array.features.forEach(planFeatureJSON => {
            var planFeature = new PlanFeature().fromArray(planFeatureJSON);
            this.features.push(planFeature);
        });
        return this;
    }
}
class Command {
    constructor(uuid, cmd, network) {
        this.uuid = uuid;
        this.cmd = cmd;
        this.network = network;
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
    fromArray(array) {
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        this.location = new ConnectionLocation().fromArray(array.location);
        this.status = new ConnectionStatus().fromArray(array.status);
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
    fromArray(array) {
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
            var key = this.core.getKey();
            var core = this.core;
            var hash = this.hash;
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/session/hash/token/?key=" + key + "&hash=" + hash, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var player = new Player(core, jsonresponse.player.coreid, jsonresponse.player.username, jsonresponse.player.uuid, jsonresponse.player.verified);
                            var instance = new Network(core, new Instance(core, jsonresponse.network.uuid, jsonresponse.network.name, "NTW"));
                            var sessionRequest = new SessionRequest(core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, instance, "player");
                            resolve(sessionRequest);
                        }
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
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
    fromArray(array) {
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
            var key = this.core.getKey();
            var core = this.core;
            var hash = this.hash;
            return new Promise(function (resolve, reject) {
                try {
                    var url = "https://api.purecore.io/rest/2/session/hash/token/?key=" + key + "&hash=" + hash;
                    if (key == null) {
                        url = "https://api.purecore.io/rest/2/session/hash/token/?hash=" + hash;
                    }
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var player = new Player(core, jsonresponse.player.coreid, jsonresponse.player.username, jsonresponse.player.uuid, jsonresponse.player.verified);
                            if (key != null) {
                                var instance = new Network(core, new Instance(core, jsonresponse.network.uuid, jsonresponse.network.name, "NTW"));
                                var sessionRequest = new SessionRequest(core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, instance, "player");
                                resolve(sessionRequest);
                            }
                            else {
                                var sessionRequest = new SessionRequest(core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, null, "masterplayer");
                                resolve(sessionRequest);
                            }
                        }
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
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
    fromArray(array) {
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
    fromArray(array) {
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
    fromArray(array) {
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
        this.products.forEach(product => {
            finalProducts.push(product.getId());
        });
        return JSON.stringify(finalProducts);
    }
    loadInto(selector) {
        var key = this.core.getKey();
        var products = this.getJSON();
        $.getScript("https://js.stripe.com/v3/", function (data, textStatus, jqxhr) {
            $(selector).load("https://api.purecore.io/rest/2/element/checkout/?key=" + key + "&items=" + products);
        });
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.section = new ForumSection(this.core).fromArray(array.section);
        return this;
    }
    getPosts(page = 0) {
        if (page == null || page == undefined) {
            page = 0;
        }
        var catid = this.uuid;
        var core = this.network.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/post/list/?hash=" + core.getCoreSession().getHash() + "&category=" + catid + "&page=" + page;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/post/list/?key=" + core.getKey() + "&category=" + catid + "&page=" + page;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/post/list/?category=" + catid + "&page=" + page;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var finalResponse = new Array();
                        jsonresponse.forEach(postJSON => {
                            finalResponse.push(new ForumPost(core).fromArray(postJSON));
                        });
                        resolve(finalResponse);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    createPost(title, content) {
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/post/?hash=" + core.getCoreSession().getHash() + "&category=" + this.uuid + "&title=" + title + "&content=" + escape(content);
        }
        else {
            throw new Error("You're not logged in");
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumPost(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
class Forum {
    constructor(network) {
        this.network = network;
    }
    getSections() {
        var core = this.network.core;
        var network = this.network;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/section/list/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId();
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/section/list/?key=" + core.getKey();
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/section/list/?network=" + network.getId();
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var finalResponse = new Array();
                        jsonresponse.forEach(sectionJSON => {
                            finalResponse.push(new ForumSection(core).fromArray(sectionJSON));
                        });
                        resolve(finalResponse);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getCategory(catid) {
        var core = this.network.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/category/?hash=" + core.getCoreSession().getHash() + "&category=" + catid;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/category/?key=" + core.getKey() + "&category=" + catid;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/category/?category=" + catid;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumCategory(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPost(postid) {
        var core = this.network.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/post/?hash=" + core.getCoreSession().getHash() + "&post=" + postid;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/post/?key=" + core.getKey() + "&post=" + postid;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/post/?post=" + postid;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumPost(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    createSection(name, description) {
        var core = this.network.core;
        var network = this.network;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/section/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId() + "&name=" + name + "&description=" + description;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/create/section/?key=" + core.getKey() + "&name=" + name + "&description=" + description;
            ;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/create/section/?network=" + network.getId() + "&name=" + name + "&description=" + description;
            ;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumSection(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.title = array.title;
        this.content = array.content;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.open = array.open;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.category = new ForumCategory(this.core).fromArray(array.category);
        return this;
    }
    createReply(content) {
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/reply/?hash=" + core.getCoreSession().getHash() + "&object=" + this.uuid + "&content=" + escape(content);
        }
        else {
            throw new Error("You're not logged in");
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumReply(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getReplies(page = 0) {
        if (page == null || page == undefined) {
            page = 0;
        }
        var objid = this.uuid;
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?hash=" + core.getCoreSession().getHash() + "&object=" + objid + "&page=" + page;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?key=" + core.getKey() + "&object=" + objid + "&page=" + page;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?object=" + objid + "&page=" + page;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var finalResponse = new Array();
                        jsonresponse.forEach(replyJSON => {
                            finalResponse.push(new ForumReply(core).fromArray(replyJSON));
                        });
                        resolve(finalResponse);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.content = array.content;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        if ("title" in array.responseTo) {
            this.replyingTo = new ForumPost(this.core).fromArray(array.responseTo);
        }
        else {
            this.replyingTo = new ForumReply(this.core).fromArray(array.responseTo);
        }
        return this;
    }
    createReply(content) {
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/reply/?hash=" + core.getCoreSession().getHash() + "&object=" + this.uuid + "&content=" + escape(content);
        }
        else {
            throw new Error("You're not logged in");
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumReply(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getReplies(page = 0) {
        if (page == null || page == undefined) {
            page = 0;
        }
        var objid = this.uuid;
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?hash=" + core.getCoreSession().getHash() + "&object=" + objid + "&page=" + page;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?key=" + core.getKey() + "&object=" + objid + "&page=" + page;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/reply/list/?object=" + objid + "&page=" + page;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var finalResponse = new Array();
                        jsonresponse.forEach(replyJSON => {
                            finalResponse.push(new ForumReply(core).fromArray(replyJSON));
                        });
                        resolve(finalResponse);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
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
        var secid = this.uuid;
        var core = this.network.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/get/category/list/?hash=" + core.getCoreSession().getHash() + "&section=" + secid;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/get/category/list/?key=" + core.getKey() + "&section=" + secid;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/get/category/list/?section=" + secid;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var finalResponse = new Array();
                        jsonresponse.forEach(categoryJSON => {
                            finalResponse.push(new ForumCategory(core).fromArray(categoryJSON));
                        });
                        resolve(finalResponse);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        return this;
    }
    createCategory(name, description) {
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/forum/create/category/?hash=" + core.getCoreSession().getHash() + "&section=" + this.uuid + "&name=" + name + "&description=" + description;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/forum/create/category/?key=" + core.getKey() + "&section=" + this.uuid + "&name=" + name + "&description=" + description;
            ;
        }
        else {
            url = "https://api.purecore.io/rest/2/forum/create/category/?section=" + this.uuid + "&name=" + name + "&description=" + description;
            ;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(new ForumCategory(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
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
    getGrowthAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/growth/analytics/?hash=" + core.getCoreSession().getHash() + "&instance=" + main.uuid + "&span=" + span;
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/growth/analytics/?key=" + core.getKey() + "&span=" + span;
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        var growthAnalytics = new Array();
                        jsonresponse.forEach(growthAnalyticJSON => {
                            var growthAnalytic = new GrowthAnalytic().fromArray(growthAnalyticJSON);
                            growthAnalytics.push(growthAnalytic);
                        });
                        return growthAnalytics;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    delete() {
        var core = this.core;
        var instance = this;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/delete/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId();
        }
        else {
            url = "https://api.purecore.io/rest/2/instance/delete/?key=" + core.getKey() + "&instance=" + instance.getId();
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(true);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getKeys() {
        var core = this.core;
        var instance = this;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/key/list/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId();
        }
        else {
            url = "https://api.purecore.io/rest/2/instance/key/list/?key=" + core.getKey() + "&instance=" + instance.getId();
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var keyList = new Array();
                        jsonresponse.forEach(jsonKey => {
                            keyList.push(new Key(core).fromArray(jsonKey));
                        });
                        resolve(keyList);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
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
    update() {
        var core = this.core;
        var instance = this;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/info/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId();
        }
        else {
            url = "https://api.purecore.io/rest/2/instance/info/?key=" + core.getKey() + "&instance=" + instance.getId();
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        if (jsonresponse.server == null) {
                            instance.type = "NTW";
                            instance.uuid = jsonresponse.network.uuid;
                            instance.name = jsonresponse.network.name;
                        }
                        else {
                            instance.type = "SVR";
                            instance.uuid = jsonresponse.server.uuid;
                            instance.name = jsonresponse.server.name;
                        }
                        resolve(instance);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
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
    createServer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            var network = this;
            var url;
            if (this.core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/server/create/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId() + "&name=" + name;
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/server/create/?key=" + core.getKey() + "&name=" + name;
            }
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error));
                        }
                        else {
                            resolve(new Instance(core, jsonresponse.uuid, jsonresponse.name, "SVR"));
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            var network = this;
            var url;
            if (this.core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/server/list/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId();
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/server/list/?key=" + core.getKey() + "&network=" + network.getId();
            }
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                        }
                        else {
                            var servers = [];
                            jsonresponse.forEach(serverInstance => {
                                servers.push(new Instance(core, serverInstance.uuid, serverInstance.name, "SVR"));
                            });
                            resolve(servers);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    asInstance() {
        return new Instance(this.core, this.uuid, this.name, "NTW");
    }
    getVotingAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/analytics/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&span=" + span;
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/network/voting/analytics/?key=" + core.getKey() + "&span=" + span;
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        var votingAnalytics = new Array();
                        jsonresponse.forEach(votingAnalyticJSON => {
                            var votingAnalytic = new VoteAnalytic().fromArray(votingAnalyticJSON);
                            votingAnalytics.push(votingAnalytic);
                        });
                        return votingAnalytics;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getVotingSites() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/?key=" + core.getKey();
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        var siteArray = new Array();
                        jsonresponse.forEach(votingSite => {
                            var site = new VotingSite(core).fromArray(votingSite);
                            siteArray.push(site);
                        });
                        return siteArray;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getSetupVotingSites(displaySetup = true) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (displaySetup) {
                if (core.getTool() instanceof Session) {
                    url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/config/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
                }
                else if (core.getKey() != null) {
                    url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/config/?key=" + core.getKey();
                }
                else {
                    url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/config/?network=" + main.getId();
                }
            }
            else {
                if (core.getTool() instanceof Session) {
                    url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
                }
                else if (core.getKey() != null) {
                    url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/?key=" + core.getKey();
                }
                else {
                    url = "https://api.purecore.io/rest/2/instance/network/voting/site/list/setup/?network=" + main.getId();
                }
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        if (displaySetup) {
                            var configArray = new Array();
                            jsonresponse.forEach(votingSite => {
                                var siteConfig = new VotingSiteConfig(core).fromArray(votingSite);
                                configArray.push(siteConfig);
                            });
                            return configArray;
                        }
                        else {
                            var siteArray = new Array();
                            jsonresponse.forEach(votingSite => {
                                var site = new VotingSite(core).fromArray(votingSite);
                                siteArray.push(site);
                            });
                            return siteArray;
                        }
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getGuild() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/network/discord/get/guild/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/network/discord/get/guild/?key=" + core.getKey();
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return new DiscordGuild(main).fromArray(jsonresponse);
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    setGuild(discordGuildId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            try {
                return yield fetch("https://api.purecore.io/rest/2/instance/network/discord/setguild/?key=" + key + "&guildid=" + discordGuildId, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return true;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    setSessionChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            try {
                return yield fetch("https://api.purecore.io/rest/2/instance/network/discord/setchannel/session/?key=" + key + "&channelid=" + channelId, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return true;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    setDonationChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            try {
                return yield fetch("https://api.purecore.io/rest/2/instance/network/discord/setchannel/donation/?key=" + key + "&channelid=" + channelId, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return true;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getHashes() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/session/hash/list/?key=" + key, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(hashData => {
                                var hash = new ConnectionHash(new Core(key));
                                response.push(hash.fromArray(hashData));
                            });
                            resolve(response);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getOffences() {
        return __awaiter(this, void 0, void 0, function* () {
            var url;
            var core = this.core;
            if (this.core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/punishment/offence/list/?hash=" + this.core.getCoreSession().getHash() + "&network=" + this.getId();
            }
            else if (this.core.getKey() != null) {
                url = "https://api.purecore.io/rest/2/punishment/offence/list/?key=" + this.core.getKey();
            }
            else {
                url = "https://api.purecore.io/rest/2/punishment/offence/list/?network=" + this.getId();
            }
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(offenceData => {
                                var offence = new Offence(core);
                                response.push(offence.fromArray(offenceData));
                            });
                            resolve(response);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getOffenceActions() {
        return __awaiter(this, void 0, void 0, function* () {
            var url;
            var core = this.core;
            if (this.core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/punishment/action/list/?hash=" + this.core.getCoreSession().getHash() + "&network=" + this.getId();
            }
            else {
                url = "https://api.purecore.io/rest/2/punishment/action/list/key=" + this.core.getKey() + "&network=" + this.getId();
            }
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(actionData => {
                                var offence = new OffenceAction(core);
                                response.push(offence.fromArray(actionData));
                            });
                            resolve(response);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    searchPlayers(username, uuid, coreid) {
        if (username != null) {
            var networkid = this.uuid;
            var core = this.core;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/player/from/minecraft/username/search/?hash=" + core.getCoreSession().getHash() + "&network=" + networkid + "&username=" + username;
            }
            else {
                url = "https://api.purecore.io/rest/2/player/from/minecraft/username/search/?key=" + core.getKey() + "&username=" + username;
            }
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                        }
                        else {
                            var finalPlayerList = new Array();
                            jsonresponse.forEach(playerData => {
                                var player = new Player(core, playerData.coreid, playerData.username, playerData.uuid, playerData.verified);
                                finalPlayerList.push(player);
                            });
                            resolve(finalPlayerList);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        else {
            return new Array();
        }
    }
    getPlayer(coreid) {
        var core = this.core;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/from/core/id/?hash=" + core.getCoreSession().getHash() + "&player=" + coreid;
        }
        else {
            if (core.getKey() != null) {
                url = "https://api.purecore.io/rest/2/player/from/core/id/?key=" + core.getKey() + "&player=" + coreid;
            }
            else {
                url = "https://api.purecore.io/rest/2/player/from/core/id/?player=" + coreid;
            }
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var player = new Player(core, jsonresponse.coreid, jsonresponse.username, jsonresponse.uuid, jsonresponse.verified);
                        resolve(player);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPlayers(page) {
        var core = this.core;
        var instance = this.asInstance();
        var queryPage = 0;
        if (page != undefined && page != null) {
            queryPage = page;
        }
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/instance/network/list/players/?hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId() + "&page=" + queryPage;
        }
        else {
            url = "https://api.purecore.io/rest/2/instance/network/list/players/?key=" + core.getKey() + "&page=" + queryPage;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var players = new Array();
                        jsonresponse.forEach(playerJson => {
                            var player = new Player(core, playerJson.coreid, playerJson.username, playerJson.uuid, playerJson.verified);
                            players.push(player);
                        });
                        resolve(players);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPunishments(page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            var url;
            var core = this.core;
            if (this.core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/punishment/list/?hash=" + this.core.getCoreSession().getHash() + "&network=" + this.getId() + "&page=" + page.toString();
            }
            else {
                url = "https://api.purecore.io/rest/2/punishment/list/key=" + this.core.getKey() + "&network=" + this.getId() + "&page=" + page.toString();
            }
            var key = this.core.getKey();
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(punishmentData => {
                                var punishment = new Punishment(core);
                                response.push(punishment.fromArray(punishmentData));
                            });
                            resolve(response);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
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
    fromArray(array) {
        this.type = array.type;
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.instance = new Instance(this.core, array.instance.uuid, array.instance.name, array.instance.type);
        return this;
    }
}
class BIOS {
    constructor(vendor, version) {
        this.vendor = vendor;
        this.version = version;
    }
    fromArray(array) {
        this.vendor = array.vendor;
        this.version = array.version;
        return this;
    }
    asArray() {
        return { "vendor": this.vendor, "version": this.version };
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
    asArray() {
        return { "manufacturer": this.manufacturer, "brand": this.brand, "vendor": this.vendor, "speed": this.speed, "maxSpeed": this.maxSpeed, "physicalCores": this.physicalCores, "virtualCores": this.virtualCores };
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
    fromArray(array) {
        this.size = array.size;
        this.name = array.name;
        this.type = array.type;
        this.interfaceType = array.interfaceType;
        this.serialNum = array.serialNum;
        return this;
    }
    asArray() {
        return { "size": this.size, "name": this.name, "type": this.type, "interfaceType": this.interfaceType, "serialNum": this.serialNum };
    }
}
class DriveUsage {
    constructor(max, used) {
        this.max = max;
        this.used = used;
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
        var hash = this.hash;
        return new Promise(function (resolve, reject) {
            try {
                return fetch(encodeURI("https://api.purecore.io/rest/2/machine/update/?hash=" + hash + "&ipv6=" + ip), { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(ip);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    setIPV4(ip) {
        var hash = this.hash;
        return new Promise(function (resolve, reject) {
            try {
                return fetch(encodeURI("https://api.purecore.io/rest/2/machine/update/?hash=" + hash + "&ipv4=" + ip), { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(ip);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    fromArray(array) {
        if (array.uuid != null && array.uuid != undefined) {
            this.uuid = array.uuid;
        }
        if (array.hash != null && array.hash != undefined) {
            this.hash = array.hash;
        }
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
            this.bios = new BIOS().fromArray(array.bios);
        }
        if (array.motherboard != null && array.motherboard != undefined) {
            this.motherboard = new Motherboard().fromArray(array.motherboard);
        }
        if (array.cpu != null && array.cpu != undefined) {
            this.cpu = new CPU().fromArray(array.cpu);
        }
        this.ram = new Array();
        array.ram.forEach(ramDim => {
            this.ram.push(new RAM().fromArray(ramDim));
        });
        this.drives = new Array();
        array.drives.forEach(drive => {
            this.drives.push(new Drive().fromArray(drive));
        });
        this.adapters = new Array();
        array.adapters.forEach(adapter => {
            this.adapters.push(new NetworkAdapter().fromArray(adapter));
        });
        return this;
    }
    updateComponents(si, bios, motherboard, cpu, ram, drives, adapters) {
        var updateParams = "";
        var hash = this.hash;
        var mainObj = this;
        if (si != null) {
            bios = new BIOS(si.bios.vendor, si.bios.version);
            motherboard = new Motherboard(si.baseboard.manufacturer, si.baseboard.model);
            cpu = new CPU(si.cpu.manufacturer, si.cpu.brand, si.cpu.vendor, si.cpu.speed, si.cpu.speedmax, si.cpu.physicalCores, si.cpu.cores);
            ram = new Array();
            si.memLayout.forEach(ramStick => {
                ram.push(new RAM(ramStick.size, ramStick.clockSpeed, ramStick.manufacturer));
            });
            drives = new Array();
            si.diskLayout.forEach(disk => {
                drives.push(new Drive(disk.size, disk.name, disk.type, disk.interfaceType, disk.serialNum));
            });
            adapters = new Array();
            si.net.forEach(adapter => {
                adapters.push(new NetworkAdapter(adapter.speed, adapter.ifaceName));
            });
        }
        if (bios != null && bios != undefined) {
            this.bios = bios;
            updateParams += "&bios=" + JSON.stringify(bios.asArray());
        }
        if (motherboard != null && motherboard != undefined) {
            this.motherboard = motherboard;
            updateParams += "&motherboard=" + JSON.stringify(motherboard.asArray());
        }
        if (cpu != null && cpu != undefined) {
            this.cpu = cpu;
            updateParams += "&cpu=" + JSON.stringify(cpu.asArray());
        }
        if (ram != null && ram != undefined) {
            this.ram = ram;
            var ramDims = [];
            ram.forEach(ramDim => {
                ramDims.push(ramDim.asArray());
            });
            updateParams += "&ram=" + JSON.stringify(ramDims);
        }
        if (drives != null && drives != undefined) {
            this.drives = drives;
            var drivesArray = [];
            drives.forEach(drive => {
                drivesArray.push(drive.asArray());
            });
            updateParams += "&drives=" + JSON.stringify(drivesArray);
        }
        if (adapters != null && adapters != undefined) {
            this.adapters = adapters;
            var adapterArray = [];
            adapters.forEach(adapter => {
                adapterArray.push(adapter.asArray());
            });
            updateParams += "&adapters=" + JSON.stringify(adapterArray);
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(encodeURI("https://api.purecore.io/rest/2/machine/update/?hash=" + hash + updateParams), { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(mainObj);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
class Motherboard {
    constructor(manufacturer, model) {
        this.manufacturer = manufacturer;
        this.model = model;
    }
    fromArray(array) {
        this.manufacturer = array.manufacturer;
        this.model = array.model;
        return this;
    }
    asArray() {
        return { "manufacturer": this.manufacturer, "model": this.model };
    }
}
class NetworkAdapter {
    constructor(speed, name) {
        this.speed = speed;
        this.name = name;
    }
    fromArray(array) {
        this.speed = array.speed;
        this.name = array.name;
        return this;
    }
    asArray() {
        return { "speed": this.speed, "name": this.name };
    }
}
class RAM {
    constructor(size, clockSpeed, manufacturer, voltage) {
        this.size = size;
        this.clockSpeed = clockSpeed;
        this.manufacturer = manufacturer;
        this.voltage = voltage;
    }
    fromArray(array) {
        this.size = array.size;
        this.clockSpeed = array.clockSpeed;
        this.manufacturer = array.manufacturer;
        this.voltage = array.voltage;
        return this;
    }
    asArray() {
        return { "size": this.size, "clockSpeed": this.clockSpeed, "manufacturer": this.manufacturer, "voltage": this.voltage };
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
    fromArray(array) {
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.cmd = new Command(array.cmd.cmdId, array.cmd.cmdString, this.network);
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        var finalOffenceList = new Array();
        array.offenceList.forEach(offenceArray => {
            var offence = new Offence(this.core);
            finalOffenceList.push(offence.fromArray(offenceArray));
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
    constructor(parameters) {
    }
}
class Session extends Core {
    constructor(core, uuid, hash, device, location, usage, network, user) {
        super(core.getTool());
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
    getUser() {
        if (this.player == undefined && this.owner != undefined) {
            return new Owner(this.core, this.owner.getId(), this.owner.getName(), this.owner.getSurname(), this.owner.getEmail());
        }
        else {
            return new Player(this.core, this.player.getId(), this.player.getUsername(), this.player.getUuid(), this.player.verified);
        }
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.device = new SessionDevice(array.device.brand, array.device.device, array.device.model, array.device.os);
        this.location = new SessionLocation(array.location.city, array.location.state, array.location.country_code);
        this.usage = new SessionUsage(array.usage.creation, array.usage.uses);
        if ("network" in array) {
            this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
            this.core = new Core(new Session(new Core(), this.uuid, this.hash, this.device, this.location, this.usage, this.network, null));
        }
        else {
            this.core = new Core(new Session(new Core(), this.uuid, this.hash, this.device, this.location, this.usage, null, null));
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
        var key = this.core.getKey();
        var core = this.core;
        var hash = sessionHash;
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/session/get/?key=" + key + "&hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(new Session(core).fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(new Error(e.message));
            }
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
        var hash = this.hash;
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/machine/list/?hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var machines = [];
                        jsonresponse.forEach(machineJSON => {
                            machines.push(new Machine().fromArray(machineJSON));
                        });
                        resolve(machines);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getNetworks() {
        var hash = this.hash;
        var core = this.core;
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/instance/network/list/?hash=" + hash, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    if ("error" in response) {
                        throw new Error(response.error + ". " + response.msg);
                    }
                    else {
                        var networks = [];
                        response.forEach(network => {
                            networks.push(new Network(core, new Instance(core, network.uuid, network.name, "NTW")));
                        });
                        resolve(networks);
                    }
                }).catch(function (error) {
                    throw error;
                });
            }
            catch (e) {
                reject(e.message);
            }
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
        return "https://api.purecore.io/link/discord/redirect/?uuid=" + this.uuid + "&hash=" + this.token;
    }
    getToken() {
        return this.token;
    }
    getSession() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            var core = this.core;
            var token = this.token;
            return new Promise(function (resolve, reject) {
                try {
                    var url = "https://api.purecore.io/rest/2/session/hash/token/exchange/?key=" + key + "&token=" + token;
                    if (key == null) {
                        url = "https://api.purecore.io/rest/2/session/hash/token/exchange/?token=" + token;
                    }
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error);
                        }
                        else {
                            resolve(new Session(core).fromArray(jsonresponse));
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                catch (e) {
                    reject(e);
                }
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
    fromArray(array) {
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
    getId() {
        return this.uuid;
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.name = array.name;
        this.description = array.description;
        this.category = new StoreCategory(this.core).fromArray(array.category);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.price = array.price;
        array.perks.forEach(perkJson => {
            this.perks.push(new PerkContextualized(this.core).fromArray(perkJson));
        });
        return this;
    }
    getOrganizedPerks() {
        var perkOrganized = [];
        this.perks.forEach(perk => {
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
            perkOrganized[key].forEach(conperk => {
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
    fromArray(array) {
        this.category = new StoreCategory(this.core).fromArray(array.category);
        this.uuid = this.category.getId();
        this.items = new Array();
        array.products.forEach(product => {
            this.items.push(new StoreItem(this.core).fromArray(product));
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = new PerkCategory(this.core).fromArray(array.category);
        var commands = new Array();
        return this;
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
    fromArray(array) {
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
}
class PerkContextualized extends Core {
    constructor(core, perk, quantity) {
        super(core.getTool());
        this.core = core;
        this.perk = perk;
        this.quantity = quantity;
    }
    fromArray(array) {
        this.perk = new Perk(this.core).fromArray(array.perk);
        this.quantity = array.quantity;
        return this;
    }
}
class Store extends Network {
    constructor(network) {
        super(network.core, network.asInstance());
        this.network = network;
    }
    getIncomeAnalytics(span = 3600 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/store/income/analytics/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&span=" + span;
            }
            else {
                url = "https://api.purecore.io/rest/2/store/income/analytics/?key=" + core.getKey() + "&span=" + span;
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        var IncomeAnalytics = new Array();
                        jsonresponse.forEach(IncomeAnalyticJSON => {
                            var IncomeAnalyticD = new IncomeAnalytic().fromArray(IncomeAnalyticJSON);
                            IncomeAnalytics.push(IncomeAnalyticD);
                        });
                        return IncomeAnalytics;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/store/item/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid + "&item=" + id;
            }
            else {
                url = "https://api.purecore.io/rest/2/store/item/?key=" + core.getKey() + "&item=" + id;
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return new StoreItem(core).fromArray(jsonresponse);
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getPerks() {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            var url;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/store/perk/list/?hash=" + core.getCoreSession().getHash() + "&network=" + main.uuid;
            }
            else {
                url = "https://api.purecore.io/rest/2/store/perk/list/?key=" + core.getKey();
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        var perklist = new Array();
                        jsonresponse.forEach(element => {
                            perklist.push(new Perk(core).fromArray(element));
                        });
                        return new StoreItem(core).fromArray(jsonresponse);
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getGateways() {
        let hash = this.network.core.getCoreSession().getHash();
        let ntwid = this.network.getId();
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/store/gateway/list/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: "hash=" + hash + "&network=" + ntwid
                }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var methods = [];
                        jsonresponse.forEach(gtw => {
                            var gtf = new Gateway(gtw.name, null, null, null);
                            methods.push(gtf);
                        });
                        resolve(methods);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    itemIdList(list) {
        var finalList = new Array();
        list.forEach(item => {
            finalList.push(new StoreItem(new Core(), item.uuid));
        });
        return finalList;
    }
    itemIdListFromJSON(json) {
        var finalList = new Array();
        json.forEach(item => {
            finalList.push(new StoreItem(new Core(), item.uuid));
        });
        return finalList;
    }
    getStripeWalletLink() {
        var hash = this.network.core.getCoreSession().getHash();
        var ntwid = this.network.getId();
        return "https://api.purecore.io/link/stripe/wallet/?hash=" + hash + "&network=" + ntwid;
    }
    getPayPalWalletLink() {
        var hash = this.network.core.getCoreSession().getHash();
        var ntwid = this.network.getId();
        return "https://api.purecore.io/link/paypal/wallet/?hash=" + hash + "&network=" + ntwid;
    }
    requestPayment(itemList, username, billingAddress) {
        if (billingAddress == null) {
            billingAddress = new BillingAddress();
        }
        var core = this.network.core;
        var instance = this.network.asInstance();
        var idList = [];
        itemList.forEach(item => {
            idList.push(item.uuid);
        });
        var body = "";
        if (core.getTool() instanceof Session) {
            body = "hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId() + "&products=" + escape(JSON.stringify(idList)) + "&username=" + username + "&billing=" + JSON.stringify(billingAddress);
        }
        else if (core.getKey() != null) {
            body = "key=" + core.getKey() + "&products=" + escape(JSON.stringify(idList)) + "&username=" + username + "&billing=" + JSON.stringify(billingAddress);
        }
        else {
            body = "network=" + instance.getId() + "&products=" + escape(JSON.stringify(idList)) + "&username=" + username + "&billing=" + JSON.stringify(billingAddress);
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch("https://api.purecore.io/rest/2/payment/request/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: body
                }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        var paymentRequest = new CorePaymentRequest(core).fromArray(jsonresponse);
                        resolve(paymentRequest);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getNetwork() {
        return this.network;
    }
    getPayments(page) {
        var core = this.network.core;
        var instance = this.network.asInstance();
        var queryPage = 0;
        if (page != undefined || page != null) {
            queryPage = page;
        }
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/payment/list/?hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId() + "&page=" + page;
        }
        else {
            url = "https://api.purecore.io/rest/2/payment/list/?key=" + core.getKey() + "&network=" + instance.getId() + "&page=" + page;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var payments = new Array();
                        jsonresponse.forEach(paymentJson => {
                            payments.push(new Payment(core).fromArray(paymentJson));
                        });
                        resolve(payments);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPackages() {
        var core = this.network.core;
        var instance = this.network.asInstance();
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/store/item/list/?hash=" + core.getCoreSession().getHash() + "&network=" + instance.getId();
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/store/item/list/?key=" + core.getKey() + "&network=" + instance.getId();
        }
        else {
            url = "https://api.purecore.io/rest/2/store/item/list/?network=" + instance.getId();
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error);
                    }
                    else {
                        var response = new Array();
                        jsonresponse.forEach(nestedData => {
                            response.push(new NestedItem(core).fromArray(nestedData));
                        });
                        resolve(response);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
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
    fromArray(array) {
        this.network = new Instance(this.core, array.network.uuid, array.network.name, "NTW").asNetwork();
        if (typeof array.cmd == "string") {
            array.cmd = new Command(array.cmd, null, this.network);
        }
        else {
            array.cmd = new Command(array.cmd.cmdId, array.cmd.cmdString, this.network);
        }
        this.needsOnline = array.needs_online;
        var instances = new Array();
        array.execute_on.forEach(instance => {
            if (typeof instance == "string") {
                instances.push(new Instance(this.core, instance, null, "UNK"));
            }
            else {
                instances.push(new Instance(this.core, instance.uuid, instance.name, "UNK"));
            }
        });
        this.executeOn = instances;
        this.listId = array.lisdid;
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
    fromArray(array) {
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
    fromArray(array) {
        this.uuid = array.uuid;
        this.request = new CorePaymentRequest(this.core).fromArray(array.request);
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
        var core = this.core;
        var request = this.uuid;
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/payment/request/isPaid/?hash=" + core.getCoreSession().getHash() + "&request=" + request;
        }
        else if (core.getKey() != null) {
            url = "https://api.purecore.io/rest/2/payment/request/isPaid/?key=" + core.getKey() + "&request=" + request;
        }
        else {
            url = "https://api.purecore.io/rest/2/payment/request/isPaid/?request=" + request;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error));
                    }
                    else {
                        resolve(jsonresponse.paid);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.store = new Store(new Network(this.core, new Instance(this.core, array.store.network.uuid, array.store.network.name, "NTW")));
        array.products.forEach(product => {
            this.products.push(new StoreItem(this.core).fromArray(product));
        });
        this.username = array.username;
        try {
            this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        }
        catch (error) {
            this.player = null;
        }
        if (array.sessionList != null) {
            array.sessionList.forEach(session => {
                // TODO
            });
        }
        if (array.warnings != null) {
            array.warnings.forEach(warning => {
                try {
                    this.warnings.push(new Warning(warning.cause, warning.text));
                }
                catch (error) {
                    // ignore
                }
            });
        }
        if (array.discounts != null) {
            array.discounts.forEach(discount => {
                try {
                    this.discounts.push(new Discount(discount.type, discount.id, discount.description, discount.amount));
                }
                catch (error) {
                    // ignore
                }
            });
        }
        if (array.gateways != null) {
            array.gateways.forEach(gateway => {
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
    createNetwork(name, game, cname, ip, port) {
        if (this.core.getTool() instanceof Session) {
            var core = this.core;
            var url;
            if (ip == null) {
                url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname;
            }
            else {
                if (port == null) {
                    url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname + "&ip=" + ip;
                }
                else {
                    url = "https://api.purecore.io/rest/2/instance/network/create/?hash=" + core.getCoreSession().getHash() + "&name=" + name + "&game=" + game + "&cname=" + cname + "&ip=" + ip + "&port=" + port;
                }
            }
            return new Promise(function (resolve, reject) {
                try {
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error));
                        }
                        else {
                            var network = new Network(core, new Instance(core, jsonresponse.uuid, jsonresponse.name, "NTW"));
                            resolve(network);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        else {
            throw new Error("Invalid tool type, got: " + core.getTool());
        }
    }
}
class Player extends Core {
    constructor(core, id, username, uuid, verified) {
        super(core.getKey());
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }
    getBillingAddress() {
        var core = this.core;
        var url = "";
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/billing/get/?hash=" + core.getCoreSession().getHash();
        }
        else {
            throw new Error("unsupported");
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(new BillingAddress().fromArray(jsonresponse));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPunishments(network, page) {
        var id = this.id;
        var core = this.core;
        var queryPage = 0;
        if (page != undefined || page != null) {
            queryPage = page;
        }
        var url;
        if (core.getTool() instanceof Session) {
            if (network == null || network == undefined) {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?hash=" + core.getCoreSession().getHash() + "&page=" + queryPage + "&player=" + id;
            }
            else {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?hash=" + core.getCoreSession().getHash() + "&network=" + network.getId() + "&page=" + queryPage + "&player=" + id;
            }
        }
        else {
            if (network == null || network == undefined) {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?key=" + core.getKey() + "&page=" + queryPage + "&player=" + id;
                ;
            }
            else {
                url = "https://api.purecore.io/rest/2/player/punishment/list/?key=" + core.getKey() + "&network=" + network.getId() + "&page=" + queryPage + "&player=" + id;
                ;
            }
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var punishments = new Array();
                        jsonresponse.forEach(punishmentJson => {
                            punishments.push(new Punishment(core).fromArray(punishmentJson));
                        });
                        resolve(punishments);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getPayments(store, page) {
        var id = this.id;
        var core = this.core;
        var queryPage = 0;
        if (page != undefined || page != null) {
            queryPage = page;
        }
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/payment/list/?hash=" + core.getCoreSession().getHash() + "&network=" + store.getNetwork().getId() + "&page=" + queryPage + "&player=" + id;
        }
        else {
            url = "https://api.purecore.io/rest/2/player/payment/list/?key=" + core.getKey() + "&network=" + store.getNetwork().getId() + "&page=" + queryPage + "&player=" + id;
            ;
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var payments = new Array();
                        jsonresponse.forEach(paymentJson => {
                            payments.push(new Payment(core).fromArray(paymentJson));
                        });
                        resolve(payments);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getDiscordId() {
        var url = "";
        if (this.core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/get/discord/id/?hash=" + this.core.getCoreSession().getHash();
        }
        else {
            throw new Error("only sessions are supported in this call");
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        resolve(jsonresponse.id);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getConnections(instance, page) {
        var id = this.id;
        var core = this.core;
        var queryPage = 0;
        if (page != undefined || page != null) {
            queryPage = page;
        }
        var url;
        if (core.getTool() instanceof Session) {
            if (instance == null) {
                url = "https://api.purecore.io/rest/2/player/connection/list/?hash=" + core.getCoreSession().getHash() + "&page=" + queryPage + "&player=" + id;
            }
            else {
                url = "https://api.purecore.io/rest/2/player/connection/list/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id;
            }
        }
        else {
            if (instance == null) {
                url = "https://api.purecore.io/rest/2/player/connection/list/?key=" + core.getKey() + "&page=" + queryPage + "&player=" + id;
                ;
            }
            else {
                url = "https://api.purecore.io/rest/2/player/connection/list/?key=" + core.getKey() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id;
                ;
            }
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var connections = new Array();
                        jsonresponse.forEach(connectionJson => {
                            connections.push(new Connection(core).fromArray(connectionJson));
                        });
                        resolve(connections);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    getMatchingConnections(instance, page, playerList) {
        var id = this.id;
        var core = this.core;
        var queryPage = 0;
        var playerListIds = [];
        playerList.forEach(player => {
            playerListIds.push(player.getId());
        });
        if (page != undefined || page != null) {
            queryPage = page;
        }
        var url;
        if (core.getTool() instanceof Session) {
            url = "https://api.purecore.io/rest/2/player/connection/list/match/players/?hash=" + core.getCoreSession().getHash() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id + "&players=" + JSON.stringify(playerListIds);
        }
        else {
            url = "https://api.purecore.io/rest/2/player/connection/list/match/players/?key=" + core.getKey() + "&instance=" + instance.getId() + "&page=" + queryPage + "&player=" + id + "&players=" + JSON.stringify(playerListIds);
        }
        return new Promise(function (resolve, reject) {
            try {
                return fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                    }
                    else {
                        var activityMatch = new Array();
                        jsonresponse.forEach(activity => {
                            var matchingRanges = new Array();
                            activity.matchList.forEach(matchingRangeJson => {
                                var matchingRange = new MatchingRange(new Date(matchingRangeJson.startedOn * 1000), new Date(matchingRangeJson.finishedOn * 1000), matchingRangeJson.matchWith);
                                matchingRanges.push(matchingRange);
                            });
                            activityMatch.push(new ActivityMatch(new Date(activity.startedOn * 1000), new Date(activity.finishedOn * 1000), activity.activity, matchingRanges));
                        });
                        resolve(activityMatch);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
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
    fromArray(array) {
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
    fromArray(array) {
        this.votingSite = new VotingSite(this.core).fromArray(array.votingSite);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.url = array.url;
        return this;
    }
    setURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var core = this.core;
            let main = this;
            if (core.getTool() instanceof Session) {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/setup/?hash=" + core.getCoreSession().getHash() + "&network=" + main.network.getId() + "&url=" + url + "&site=" + main.votingSite.uuid;
            }
            else {
                url = "https://api.purecore.io/rest/2/instance/network/voting/site/setup/?key=" + core.getKey() + "&url=" + url + "&site=" + main.votingSite.uuid;
            }
            try {
                return yield fetch(url, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        main.url = jsonresponse.url;
                        return this;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
}
