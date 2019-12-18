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
                this.session = new Session(new Core()).fromArray(tool);
            }
            else {
                if (tool instanceof Session) {
                    this.session = tool;
                }
                else {
                    this.key = null;
                }
            }
        }
        // if not start with fromdiscord or fromtoken
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
    getKey() {
        return this.key;
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
class Command {
    constructor(uuid, cmd, network) {
        this.uuid = uuid;
        this.cmd = cmd;
        this.network = network;
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
class Instance extends Core {
    constructor(core, uuid, name, type) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.type = type;
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
}
class Network extends Core {
    constructor(core, instance) {
        super(core.getTool());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
    }
    getId() {
        return this.uuid;
    }
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            var session = this.core.getCoreSession();
            var network = this;
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/instance/server/list/?hash=" + session.getCoreSession().getHash() + "&network=" + network.getId(), { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            reject(new Error(jsonresponse.error + ". " + jsonresponse.msg));
                        }
                        else {
                            var servers = [];
                            jsonresponse.forEach(serverInstance => {
                                servers.push(new Instance(this.core, serverInstance.uuid, serverInstance.name, "SVR"));
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
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });
        });
    }
    getOffences() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/punishment/offence/list/?key=" + key, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(offenceData => {
                                var offence = new Offence(new Core(key));
                                response.push(offence.fromArray(offenceData));
                            });
                            resolve(response);
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
    getOffenceActions() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/punishment/action/list/?key=" + key, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(actionData => {
                                var offence = new OffenceAction(new Core(key));
                                response.push(offence.fromArray(actionData));
                            });
                            resolve(response);
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
    getPunishments() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/punishment/list/?key=" + key, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(punishmentData => {
                                var punishment = new Punishment(new Core(key));
                                response.push(punishment.fromArray(punishmentData));
                            });
                            resolve(response);
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
class Machine {
}
class VirtualMachine {
}
class Appeal extends Core {
    constructor(core, uuid, punishment, content, staffResponse, staffMember, accepted) {
        super(core.getKey());
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
        super(core.getKey());
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
        super(core.getKey());
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
        super(core.getKey());
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
        super(core.getKey());
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
            return this.owner;
        }
        else {
            return this.player;
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
                        var newSession = new Session(core);
                        newSession = newSession.fromArray(jsonresponse);
                        resolve(newSession);
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
                    return fetch("https://api.purecore.io/rest/2/session/hash/token/exchange/?key=" + key + "&token=" + token, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            resolve(new Session(core).fromArray(jsonresponse));
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
class SessionUsage {
    constructor(creation, uses) {
        this.creation = creation;
        this.uses = uses;
    }
}
class StoreCategory {
    constructor(uuid, name, description, network, upgradable) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }
}
class StoreItem {
    constructor(uuid, name, description, category, network, price, contextualizedPerks) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = contextualizedPerks;
    }
    getId() {
        return this.uuid;
    }
}
class Perk {
    constructor(uuid, network, name, description, type, category) {
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
    }
}
class PerkCategory {
    constructor(uuid, name, network) {
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }
}
class PerkContextualized {
    constructor(perk, quantity) {
        this.perk = perk;
        this.quantity = quantity;
    }
}
class Owner extends Core {
    constructor(core, id, name, surname, email) {
        super(core.getKey());
        this.core = core;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
    getId() {
        return this.id;
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
