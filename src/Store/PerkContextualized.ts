class PerkContextualized extends Core {
    public readonly core: Core;
    public perk: Perk;
    public quantity: number;

    public constructor(core: Core, perk?: Perk, quantity?: number) {
        super(core.getTool());
        this.core = core;
        this.perk = perk;
        this.quantity = quantity;
    }

    public getPerk(): Perk {
        return this.perk;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    /**
     * @deprecated use static method fromJSON
     */
    public fromArray(array): PerkContextualized {
        this.perk = Perk.fromJSON(this.core, array.perk);
        this.quantity = array.quantity;
        return this;
    }

    public static fromJSON(core: Core, json: any): PerkContextualized {
        return new PerkContextualized(
            core,
            Perk.fromJSON(core, json.perk),
            json.quantity
        );
    }
}
