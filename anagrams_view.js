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

        /*
            Main UI
            Every child element of the Main UI is placed in the
            center of the browser window.
        */
        let mainui = document.createElement('div');
        mainui.id = "main-ui";
        mainui.append("");
        render_div.append(mainui);

        /*
            Start game UI
        */
        let startbutton = document.createElement('button');
        startbutton.type = "button";
        startbutton.append("Start");
        startbutton.onclick = (e) => {
            this.#controller.startGame();
        }
        mainui.append(startbutton);

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLocaleUpperCase();
            this.#controller.handleKeyPress(key);
        });

        this.#model.addEventListener('textinputupdate', (e) => {
            let tiles = document.getElementsByClassName("tile");
            for (let i = 0; i < tiles.length; i++) {
                tiles[0].remove();
            }
            this.#model.getTextInput().forEach(char => {
                let tile = document.createElement('div');
                tile.classList.add("tile");
                tile.append(char);
                mainui.append(tile);
            });
        })
    }

}