import express from 'express';
import bodyParser from 'body-parser';
import { AnagramsDictionary } from './anagrams_dictionary.mjs';
import { AU } from './public/anagrams_utils.mjs';
import { AnagramsGame } from './anagrams_game.mjs';
import { db } from './db.mjs';

const app = express();

const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send("<h1>test</h1>");
})

app.post('/game/:letters', (req, res) => {
    /* Create a game */
    let letters = req.params.letters ? Number(req.params.letters) : 7;
    if (!AU.letter_counts.includes(letters)) {
        res.status(400).send("Invalid letter count");
        return;
    }
    res.status(201).json(AnagramsGame.create(letters).json());
})

app.post('/game/submit/:id', async (req, res) => {
    /* Submit a word. Returns true iff the word is a valid anagram. */
    const id = req.params.id;
    const word = req.query.word;
    const game = AnagramsGame.getGameFromID(id);
    if (!game) {
        res.status(400).send("Game with id " + id + " not found.");
        return;
    }

    const result = {is_valid: false, message: ""};

    if (word.length < 3) {
        result.message = "Too short";
    } else if (game.getWordLog().includes(word)) {
        result.message = "Already found";
    } else if (!game.getDictionary().isValidAnagram(word)) {
        result.message = "Not a word";
    } else {
        result.is_valid = true;
        result.message = word + " +" + AU.getWordValue(word);
        game.addToWordLog(word);
    }

    // Add points to the totalpoints DB
    let totalpoints = 0;
    totalpoints = await db.get('SELECT * FROM totalpoints LIMIT 1;', (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            if (row) {
                totalpoints = row.points;
            }
        }
    });
    if (totalpoints) {
        db.run(`UPDATE totalpoints SET points = ${totalpoints.points + AU.getWordValue(word)} WHERE rowid = 1`, (err) => {
            if (err) {
                console.error(err.message);
            }
        })
    }

    res.status(201).json(result);
    return;
})

app.get('/game/missing-words/:id', async (req, res) => {
    /* Get all words that the player missed. */
    const id = req.params.id;
    const game = AnagramsGame.getGameFromID(id);
    if (!game) {
        res.status(400).send("Game with id " + id + " not found.");
        return;
    }
    res.status(201).json(await AnagramsDictionary.getMissingWords(game));
})

app.get('/game/totalpoints', async (req, res) => {
    /* Get the total points in the community point pot! */
    let error = null;
    let totalpoints = await db.get('SELECT * FROM totalpoints LIMIT 1;', (err, row) => {
        if (err) {
            error = err.message;
        } else {
            if (row) {
                totalpoints = row.points;
            }
        }
    });
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(201).json(totalpoints.points);
})


app.listen(port, () => {
    console.log('Running...');
})