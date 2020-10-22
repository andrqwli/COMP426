import Game from "./engine/game.js";
import View from "./view.js";

let game = null;
let controller = null;
let view = null;



$(document).ready(() => {
    $('body').append("<div class='title'>2048</div>"); 
    game = new Game(4);
    view = new View(game);

    $('body').append(view.main);
});
