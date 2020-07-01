class PerkContextualized extends Core {
  core: Core;
  perk: Perk;
  quantity;

  constructor(core: Core, perk?: Perk, quantity?) {
    super(core.getTool());
    this.core = core;
    this.perk = perk;
    this.quantity = quantity;
  }

  fromArray(array): PerkContextualized {
    this.perk = new Perk(this.core).fromArray(array.perk);
    this.quantity = array.quantity;
    return this;
  }
}
