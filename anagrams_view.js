export class AnagramsView {

    #model
    #controller

    constructor(model, controller) {
        this.#model = model;
        this.#controller = controller;
    }

    render(render_div) {
        /*
            Header
        */
        let header = document.createElement('h1');
        header.append("Anagrams Trainer");
        render_div.append(header);

        let mainui = document.createElement('div');
        mainui.id = "main-ui";
        mainui.append("");
        render_div.append(mainui);

        let tile = document.createElement('div');
        tile.classList.add("tile");
        tile.append("A");
        mainui.append(tile);
        let tile2 = document.createElement('div');
        tile2.classList.add("tile");
        tile2.append("B");
        mainui.append(tile2);
    }

}