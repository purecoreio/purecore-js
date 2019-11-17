var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Core = /** @class */ (function () {
    function Core(key) {
        this.key = key;
    }
    Core.prototype.getKey = function () {
        return this.key;
    };
    Core.prototype.getElements = function () {
        return new Elements(this);
    };
    Core.prototype.getInstance = function (instanceId, name, type) {
        new Instance(this, instanceId, name, type);
    };
    return Core;
}());
var CheckoutElement = /** @class */ (function (_super) {
    __extends(CheckoutElement, _super);
    function CheckoutElement(core, products, successFunction) {
        var _this = _super.call(this, core.getKey()) || this;
        _this.core = core;
        _this.products = products;
        document.addEventListener("paymentSuccess", successFunction);
        return _this;
    }
    CheckoutElement.prototype.getJSON = function () {
        var finalProducts = new Array();
        this.products.forEach(function (product) {
            finalProducts.push(product.getId());
        });
        return JSON.stringify(finalProducts);
    };
    CheckoutElement.prototype.loadInto = function (selector) {
        var key = this.core.getKey();
        var products = this.getJSON();
        $.getScript("https://js.stripe.com/v3/", function (data, textStatus, jqxhr) {
            $(selector).load("https://api.purecore.io/rest/2/element/checkout/?key=" + key + "&items=" + products);
        });
    };
    return CheckoutElement;
}(Core));
var Elements = /** @class */ (function (_super) {
    __extends(Elements, _super);
    function Elements(core) {
        var _this = _super.call(this, core.getKey()) || this;
        _this.core = core;
        return _this;
    }
    Elements.prototype.getCheckoutElement = function (products, successFunction) {
        return new CheckoutElement(this.core, products, successFunction);
    };
    return Elements;
}(Core));
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(core, uuid, name, type) {
        var _this = _super.call(this, core.getKey()) || this;
        _this.core = core;
        _this.uuid = uuid;
        _this.name = name;
        _this.type = type;
        return _this;
    }
    Instance.prototype.getName = function () {
        return this.name;
    };
    Instance.prototype.getId = function () {
        return this.uuid;
    };
    Instance.prototype.asNetwork = function () {
        return new Network(this.core, this);
    };
    return Instance;
}(Core));
var Network = /** @class */ (function (_super) {
    __extends(Network, _super);
    function Network(core, instance) {
        var _this = _super.call(this, core.getKey()) || this;
        _this.core = core;
        _this.uuid = instance.getId();
        _this.name = instance.getName();
        return _this;
    }
    Network.prototype.setGuild = function (discordGuildId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch("https://api.purecore.io/rest/2/instance/network/setguild/?key=" + this.core.getKey() + "&guildid=" + discordGuildId, { method: "GET" }).then(function (response) {
                                return response.json();
                            }).then(function (jsonresponse) {
                                if ("error" in jsonresponse) {
                                    throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                                }
                                else {
                                    return true;
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Network;
}(Core));
var StoreCategory = /** @class */ (function () {
    function StoreCategory(uuid, name, description, network, upgradable) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }
    return StoreCategory;
}());
var StoreItem = /** @class */ (function () {
    function StoreItem(uuid, name, description, category, network, price, contextualizedPerks) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = contextualizedPerks;
    }
    StoreItem.prototype.getId = function () {
        return this.uuid;
    };
    return StoreItem;
}());
var Perk = /** @class */ (function () {
    function Perk(uuid, network, name, description, type, category) {
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
    }
    return Perk;
}());
var PerkCategory = /** @class */ (function () {
    function PerkCategory(uuid, name, network) {
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }
    return PerkCategory;
}());
var PerkContextualized = /** @class */ (function () {
    function PerkContextualized(perk, quantity) {
        this.perk = perk;
        this.quantity = quantity;
    }
    return PerkContextualized;
}());
