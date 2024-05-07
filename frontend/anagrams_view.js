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
            startbutton.style.display = "none";
            this.#controller.startGame();
        };
        mainui.append(startbutton);

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLocaleUpperCase();
            this.#controller.handleKeyPress(key);
        });

        this.#model.addEventListener('stateupdate', (e) => {
            if (this.#model.getGameState() == "playing") {
                createTileTable();
            }
        });

        this.#model.addEventListener('textinputupdate', (e) => {
            for (let i = 0; i < this.#model.getLetterCount(); i++) {
                let tile = getInputTile(i);
                tile.innerText = "";
                tile.classList.add("empty-tile");
            }
            this.#model.getTextInput().forEach(char => {
                let tile = getNextInputTile();
                tile.classList.remove("empty-tile");
                tile.innerText = char;
            });
            this.#model.getUsableChars().forEach((char, index) => {
                let tile = getBankTile(index);
                if (char) {
                    tile.innerText = char;
                    tile.classList.remove("empty-tile");
                } else {
                    tile.innerText = "";
                    tile.classList.add("empty-tile");
                }
            });
        });

        let createTileTable = () => {
            let tiletable = document.createElement("table");
            tiletable.append();
            tiletable.innerHTML = `<tr id="bank-row"></tr><tr id="input-row"></tr>`;
            mainui.append(tiletable); 

            let bankrow = document.getElementById("bank-row");
            let inputrow = document.getElementById("input-row");
            this.#model.getLetterBank().forEach((char, i) => {
                let tile = document.createElement('td');
                tile.classList.add("tile");
                tile.id = "bank-tile-" + i;
                tile.append(char);
                bankrow.append(tile);

                let tile2 = document.createElement('td');
                tile2.classList.add("tile", "empty-tile");
                tile2.id = "input-tile-" + i;
                tile2.append("");
                inputrow.append(tile2);
            });

            return tiletable;
        }

        let getBankTile = (index) => {
            return document.getElementById("bank-tile-" + index);
        }

        let getInputTile = (index) => {
            return document.getElementById("input-tile-" + index);
        }

        let getNextInputTile = () => {
            for (let i = 0; i < this.#model.getLetterCount(); i++) {
                const tile = getInputTile(i);
                if (tile.classList.contains("empty-tile")) {
                    return tile;
                }
            }
            return null;
        }

    }

}