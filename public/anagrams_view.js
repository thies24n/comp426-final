import {AU} from './anagrams_utils.mjs';

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
        let gameover_anim = null;

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
            Game over UI
        */
        let gameoverui = document.createElement('div');
        gameoverui.id = "gameover-ui";
        gameoverui.append();
        gameoverui.innerHTML = `<h1>RESULTS</h1>
        <h2>Score: <span class="scorekeeper">0</span></h2>
        <table id="results">
            <tr><td>Found Words</td><td>Missing Words</td></tr>
            <tr>
                <td><table class="results-table" id="results-found"></table></td>
                <td><table class="results-table" id="results-unfound"></table></td>
            </tr>
        </table>`;
        let res_tables = document.getElementsByClassName("results-table");
        for (let i = 0; i < res_tables.length; i++) {
            const rt = res_tables[i];
            rt.style.width = this.#model.getLetterCount() * 0.5 + 'cm';
        }

        render_div.append(gameoverui);

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

            else if (this.#model.getGameState() == "gameover") {
                // Animate mainui
                animateMainUI(true);
                let res_found = document.getElementById("results-found");
                let res_unfound = document.getElementById("results-unfound");
                
                this.#model.getWordLog().sort((word_a, word_b) => word_b.length - word_a.length)
                .forEach((word, i) => {
                    let resftr = document.createElement("tr");
                    resftr.id = "results-found-" + i;
                    resftr.innerHTML = `<td>${word}</td>
                        <td>${AU.getWordValue(word)}</td>`;
                    res_found.append(resftr);
                })
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
            // Add submit text
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

            // Update scoreboard
            let scorekeepers = document.getElementsByClassName("scorekeeper");
            for (let i = 0; i < scorekeepers.length; i++) {
                const sk = scorekeepers[i];
                sk.innerText = this.#model.getScore();
            }
        });

        this.#model.addEventListener('timerupdate', (e) => {
            let timer = document.getElementById("scoreboard-timer");
            let time = this.#model.getTimer()
            timer.innerText = timerString(time);
        })

        let animateMainUI = (game_over) => {
            clearInterval(submit_word_anim);
            let completion = 0;
            const completion_max = game_over ? 500 : 1;
            const start_percent = game_over ? 50 : -50;
            clearInterval(gameover_anim);
            gameover_anim = setInterval(() => {
                if (completion >= completion_max) {
                    clearInterval(gameover_anim);
                } else {
                    completion++;
                    let completion_ratio = 0.5 - 0.5 * Math.cos( completion / completion_max * Math.PI);
                    mainui.style.left = start_percent - 100 * (start_percent ? 1 : -1) * (completion_ratio) + '%';
                    gameoverui.style.left = 100 + start_percent - 100 * (start_percent ? 1 : -1) * (completion_ratio) + '%';
                }
            }, 5);
        }

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
            scoreboard.innerHTML = `<tr>
                <td id="scoreboard-score">SCORE: <span class="scorekeeper">0</span></td>
                <td id="scoreboard-timer">${timerString(this.#model.getTimer())}</td>
                </tr>`;
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

        let timerString = (time) => {
            let m = Math.floor(time/60)
            let ss = time%60 < 10 ? '0' + time%60 : time%60;
            return `${m}:${ss}`;
        }

    }

}