class Page {

    public id: string;
    public components: Array<Component>;
    public children: Array<Page>;
    public name: string;
    public pathUnit: string;
    public propName: string;
    public template: string;
    public css: string;

    public static fromObject(object: any): Page {

        let page = new Page();
        page.id = object.id;
        page.components = new Array<Component>();
        for (let i = 0; i < object.components.length; i++) {
            const element = object.components[i];
            page.components.push(Component.fromObject(element));
        }
        page.children = new Array<Page>();
        for (let i = 0; i < object.children.length; i++) {
            const element = object.children[i];
            page.children.push(Page.fromObject(element));
        }
        page.pathUnit = object.pathUnit;
        page.propName = object.propName;
        page.template = object.template;
        page.css = object.css;

        return page;
    }

    public hasProp(): boolean {
        return this.propName != null;
    }

    public hasChildren(): boolean {
        return this.children.length > 0;
    }

}