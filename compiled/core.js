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
                    this.session = new Session(new Core()).fromArray(tool);
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
        super(core.getTool());
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
    getId() {
        return this.uuid;
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
        return new Instance(new Core(this.core.getTool()), this.uuid, this.name, "NTW");
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
            else {
                url = "https://api.purecore.io/rest/2/punishment/offence/list/?key=" + this.core.getKey() + "&network=" + this.getId();
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
    constructor(manufacturer, vendor, speed, maxSpeed, physicalCores, virtualCores) {
        this.manufacturer = manufacturer;
        this.vendor = vendor;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.physicalCores = physicalCores;
        this.virtualCores = virtualCores;
    }
    fromArray(array) {
        this.manufacturer = array.manufacturer;
        this.vendor = array.vendor;
        this.speed = array.speed;
        this.maxSpeed = array.maxSpeed;
        this.physicalCores = array.physicalCores;
        this.virtualCores = array.virtualCores;
        return this;
    }
    asArray() {
        return { "manufacturer": this.manufacturer, "vendor": this.vendor, "speed": this.speed, "maxSpeed": this.maxSpeed, "physicalCores": this.physicalCores, "virtualCores": this.virtualCores };
    }
}
class Drive {
    constructor(size, uuid, model, serial, mount) {
        this.size = size;
        this.uuid = uuid;
        this.model = model;
        this.serial = serial;
        this.mount = mount;
    }
    fromArray(array) {
        this.size = array.size;
        this.uuid = array.uuid;
        this.model = array.model;
        this.serial = array.serial;
        this.mount = array.mount;
        return this;
    }
    asArray() {
        return { "size": this.size, "uuid": this.uuid, "model": this.model, "serial": this.serial, "mount": this.mount };
    }
}
class Machine {
    constructor(uuid, hash, owner, ipv4, ipv6, port, motherboard, cpu, ram, drives, adapters) {
        this.uuid = uuid;
        this.hash = hash;
        this.owner = owner;
        this.ipv4 = ipv4;
        this.ipv6 = ipv6;
        this.port = port;
        this.motherboard = motherboard;
        this.cpu = cpu;
        this.ram = ram;
        this.drives = drives;
        this.adapters = adapters;
    }
    updateComponents(motherboard, cpu, ram, drives, adapters) {
        var updateParams = "";
        var hash = this.hash;
        var mainObj = this;
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
                return fetch("https://api.purecore.io/rest/2/machine/update/?hash=" + hash + updateParams, { method: "GET" }).then(function (response) {
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
        this.name = array.speed;
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
class Perk extends Core {
    constructor(core, uuid, network, name, description, type, category) {
        super(core.getTool());
        this.core = core;
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.name = array.name;
        this.description = array.description;
        this.type = array.type;
        this.category = new PerkCategory(this.core).fromArray(array.category);
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
        else {
            url = "https://api.purecore.io/rest/2/store/item/list/?key=" + core.getKey() + "&network=" + instance.getId();
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
                        var response = new Array();
                        jsonresponse.forEach(nestedData => {
                            response.push(new NestedItem(core).fromArray(nestedData));
                        });
                        resolve(response);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
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
