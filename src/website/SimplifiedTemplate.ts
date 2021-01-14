class SimplifiedTemplate {

    public id: string;
    public name: string;
    public parent: SimplifiedTemplate;
    public colorScheme: ColorScheme;
    public price: number;
    public bundled: boolean;

    public static fromObject(object: any): Template {
        let template = new Template();
        template.id = object.id;
        template.name = object.name;
        template.parent = object.template != null ? SimplifiedTemplate.fromObject(object.parent) : null;
        template.colorScheme = ColorScheme.fromObject(object.colorScheme);
        template.price = object.price;
        template.bundled = Boolean(object.bundled);
        return template;
    }

}