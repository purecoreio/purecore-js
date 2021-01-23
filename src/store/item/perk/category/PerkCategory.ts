class PerkCategory {

    public id;
    public name;
    public description;
    public archived;

    public constructor(id: string, name: string, description: string, archived: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.archived = archived;
    }

    public static fromObject(object: any): PerkCategory {
        return new PerkCategory(object.id, object.name, object.description, object.archived);
    }

    public async createPerk(name: string, countable: boolean, description: string = null): Promise<Perk> {
        const countval = countable ? 'true' : 'false';
        let call = new Call()
            .addParam(Param.PerkCategory, this.id)
            .addParam(Param.Name, name)
            .addParam(Param.Countable, countval)
        if (description != null) {
            call.addParam(Param.Description, description)
        }
        return await call.commit('store/perk/create/').then((res) => {
            return Perk.fromObject(res);
        })
    }

}