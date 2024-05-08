import express from 'express';
import bodyParser from 'body-parser';
import { AnagramsDictionary } from './anagrams_dictionary.mjs';
import { AU } from './public/anagrams_utils.mjs';
import { AnagramsGame } from './anagrams_game.mjs';

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

app.post('/game/submit/:id', (req, res) => {
    /* Submit a word. Returns true iff the word is a valid anagram. */
    const id = req.params.id;
    const word = req.query.word;
    const game = AnagramsGame.getGameFromID(id);
    if (!game) {
        res.status(400).send("Game with id " + id + " not found.");
        return;
    }
    const result = game.getDictionary().isValidAnagram(word);
    // TODO: Make word log and scoring server-sided?
    res.status(201).send(result);
    return;
})

// app.get('/dictionary/starter/:letters', (req, res) => {
//     /* Generate a starter word */
//     let letters = req.params.letters ? Number(req.params.letters) : 7;
//     if (!AU.letter_counts.includes(letters)) {
//         res.status(400).send("Invalid letter count");
//         return;
//     }
//     ad = AnagramsDictionary.create(letters);
//     res.status(201).json(ad);
// });

// app.get('/dictionary/check/:starterword', (req, res) => {
//     /* Checks if a word is a valid anagram of starterword */
//     let starter_word = req.params.starterword
//     let word = req.query.word ? Number(req.query.word) : 7;
//     if (!AU.letter_counts.includes(letters)) {
//         res.status(400).send("Invalid letter count");
//         return;
//     }
//     res.status(201).json(AnagramsDictionary.create(letters));
// });

// app.get('/nodes', (req, res) => {
//     /* Get all nodes */
//     let depth = req.query.depth ? Number(req.query.depth) : 1000;
//     if (depth == NaN || depth < 0) {
//         res.status(400).send("Depth is non-numeric or negative");
//         return;
//     }

//     res.status(201).json(Nodes.getAllNodes(depth));
// });

app.listen(port, () => {
    console.log('Running...');
})