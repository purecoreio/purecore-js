import Package from "../commerce/Package";
import Core from "../Core";
import Element from "./Element";

export default class CheckoutElement implements Element {

    private itemIds: string[]

    constructor(items: string[] | Package[]) {
        this.itemIds = items.map(i => 'id' in i ? i.id : i)
    }

    mount(selector: string | globalThis.Element) {
        if (typeof selector == 'string') selector = document.querySelector(selector)

        const iframeId = `purecore-${new Date().getTime()}`
        const formId = `purecore-${new Date().getTime()}`

        const form = document.createElement('form')
        form.target = iframeId
        form.id = formId
        form.action = `${Core.getElementsREST()}/checkout`
        form.appendChild(this.getHiddenInput('items', this.itemIds.join(',')))

        const iframe = document.createElement('iframe')
        iframe.name = iframeId

        selector.replaceChildren(form, iframe)
        form.submit()
    }

    private getHiddenInput(name: string, value: string) {
        const input = document.createElement('input')
        input.type = 'hiddren'
        input.name = name
        input.value = value
        return input
    }

}