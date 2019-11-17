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
    constructor(key) {
        this.key = key;
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
    fromDiscord(guildId, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var obj = this;
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/key/from/discord/?guildid=" + guildId + "&token=" + botToken, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            obj.key = jsonresponse.hash;
                            resolve(obj);
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
module.exports = Core;
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
module.exports.CheckoutElement;
class Elements extends Core {
    constructor(core) {
        super(core.getKey());
        this.core = core;
    }
    getCheckoutElement(products, successFunction) {
        return new CheckoutElement(this.core, products, successFunction);
    }
}
module.exports.Elements;
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
module.exports.Instance;
class Network extends Core {
    constructor(core, instance) {
        super(core.getKey());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
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
}
module.exports.Network;
class StoreCategory {
    constructor(uuid, name, description, network, upgradable) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }
}
module.exports.StoreCategory;
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
module.exports.StoreItem;
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
module.exports.Perk;
class PerkCategory {
    constructor(uuid, name, network) {
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }
}
module.exports.PerkCategory;
class PerkContextualized {
    constructor(perk, quantity) {
        this.perk = perk;
        this.quantity = quantity;
    }
}
module.exports.PerkContextualized;
