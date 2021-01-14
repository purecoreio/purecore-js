class Component {

    public id: string;
    public name: string;
    public props: Array<String>;
    public template: string;
    public css: string;
    public js: string;
    public verified: boolean;

    public static fromObject(object: any): Component {

        let component = new Component();

        component.id = object.id;
        component.name = object.name;
        component.props = new Array<String>();
        for (let i = 0; i < object.props.length; i++) {
            const element = object.props[i];
            component.props.push(element);
        }
        component.template = String(object.template);
        component.css = object.css;
        component.js = object.js;
        component.verified = Boolean(object.verified);

        return component;

    }



}