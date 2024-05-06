import {AnagramsModel} from "./anagrams_model.js";
import {AnagramsController} from "./anagrams_controller.js";
import {AnagramsView} from "./anagrams_view.js";

let model = new AnagramsModel();
let controller = new AnagramsController(model);
let view = new AnagramsView(model, controller);

view.render(document.getElementById('main'));