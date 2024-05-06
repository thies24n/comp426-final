export class AnagramsView {

    #model
    #controller

    constructor(model, controller) {
        this.#model = model;
        this.#controller = controller;
    }

    render(render_div) {
        let header = document.createElement('h1');
        header.append("Loading...");
        render_div.append(header);
    }

}