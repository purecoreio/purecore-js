class WebsiteRepresentation {

    public pages: Array<Page>;
    public template: Template;

    public static fromObject(object: any): WebsiteRepresentation {

        let representation = new WebsiteRepresentation();

        representation.pages = new Array<Page>();
        for (let i = 0; i < object.pages.length; i++) {
            const element = object.pages[i];
            representation.pages.push(Page.fromObject(element))
        }

        representation.template = Template.fromObject(object.template);

        return representation;

    }


}