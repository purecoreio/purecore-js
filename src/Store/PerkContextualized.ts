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

  fromObject(array): PerkContextualized {
    this.perk = new Perk(this.core).fromObject(array.perk);
    this.quantity = array.quantity;
    return this;
  }
}
