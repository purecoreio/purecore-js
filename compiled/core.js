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
var Network = /** @class */ (function () {
    function Network() {
    }
    return Network;
}());
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
