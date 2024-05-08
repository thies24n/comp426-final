export class AnagramsView {

    #model
    #controller

    constructor(model, controller) {
        this.#model = model;
        this.#controller = controller;
    }

    render(render_div) {
        /*
            "Global" variables
        */
        let submit_word_anim = null;

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

        /*
            Gameplay UI
        */
        let t_table = null;
        let s_text = null;
        let s_board = null;

        /*
            Events n stuff
        */
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLocaleUpperCase();
            this.#controller.handleKeyPress(key);
        });

        this.#model.addEventListener('stateupdate', (e) => {
            if (this.#model.getGameState() == "playing") {
                let t_table = createTileTable();
                let s_text = createSubmitText();
                let s_board = createScoreboard();
                t_table.style.display = "inline";
                s_text.style.display = "inline";
                s_board.style.display = "inline";
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

        this.#model.addEventListener('submitword', (e) => {
            let submittext = document.getElementById("submit-text");
            submittext.style.opacity = 0;
            submittext.style.color = 'aliceblue';
            submittext.innerText = e.detail.message;
            let word = (e.detail.is_valid) ? e.detail.message.split(" ")[0] : "";

            // Animate submittext
            let completion = 0;
            const completion_max = 200;
            clearInterval(submit_word_anim);
            submit_word_anim = setInterval(() => {
                if (completion >= completion_max) {
                    clearInterval(submit_word_anim);
                } else {
                    completion++;
                    let completion_ratio = completion / completion_max;
                    submittext.style.top = 50 - 50 * (completion_ratio) + '%';
                    submittext.style.opacity = 1 - completion_ratio;
                    
                    // Play a rainbow animation if PANGRAM
                    if (word.length == this.#model.getLetterCount()) {
                        submittext.style.color = `hsl(${completion_ratio * 720} 80 80)`;
                    }
                }
            }, 5);
        });

        let createSubmitText = () => {
            let submittext = document.createElement("p");
            submittext.append("");
            submittext.id = "submit-text";
            mainui.append(submittext);
            return submittext;
        }

        let createTileTable = () => {
            let tiletable = document.createElement("table");
            tiletable.id = "tile-table";
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

        let createScoreboard = () => {
            let scoreboard = document.createElement("table");
            scoreboard.id = "scoreboard";
            scoreboard.append();
            scoreboard.innerHTML = `<tr><td id="scoreboard-score">SCORE: 0</td><td id="scoreboard-timer">1:00</td></tr>`;
            mainui.append(scoreboard);
            scoreboard.style.width = this.#model.getLetterCount() + 'cm';
            return scoreboard;
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