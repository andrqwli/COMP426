export default class View {
    constructor(game) {
        this.game = game;
        let main = document.createElement('div');
        main.classList.add('main');
        this.main = main;
        let board = document.createElement('div');
        board.classList.add('board');
        board.setAttribute('id', 'board');

        let input = (e) => {
            e = e || window.event;
            let direction = "";
            switch (e.keyCode) {
                case 37:
                    direction = 'left';
                    break;
                case 38:
                    direction = 'up';
                    break;
                case 39:
                    direction = 'right';
                    break;
                case 40:
                    direction = 'down';
            }
            this.game.move(direction);
        }

        for (let i = 0; i < game.size ** 2; i++) {
            let tile = game.gameState.board[i];
            let cell = document.createElement('div')
            cell.classList.add('tile');
            if (tile !== 0) {
                cell.append(tile);
            }
            board.append(cell);
        }

        let reset = document.createElement('button');
        reset.append("reset");
        reset.onclick = function () {
            console.log(game);
            game.setupNewGame();
            game.updateMoveListeners(game.gameState);
            let oldWin = document.getElementById('win');
            let oldLose = document.getElementById('lose');
            if (main.contains(oldWin)) {
                main.removeChild(oldWin);
            }
            if (main.contains(oldLose)) {
                main.removeChild(oldLose);
            }

        }

        this.main.append(reset);

        let score = document.createElement('div');
        score.classList.add('score')
        score.setAttribute('id', 'score');
        score.append("Score: ");
        let value = document.createElement('span');
        value.setAttribute('id', 'value');
        value.append(0);
        score.append(value);

        this.main.append(score);
        
        this.main.append(board);
        
        document.addEventListener('keydown', input);

        this.game.onMove(state => {
            let main = document.createElement('div')
            main.classList.add('main');
            let board = document.createElement('div')
            board.classList.add('board')
            board.setAttribute('id', 'board');

            for (let i = 0; i < game.size ** 2; i++) {
                let tile = state.board[i];
                let cell = document.createElement('div')
                cell.classList.add('tile');
                if (tile !== 0) {
                    cell.append(tile);
                }
                board.append(cell);
            }
            
    

            let reset = document.createElement('button');
            reset.append("reset");
            reset.classList.add('reset');
            reset.click(() => {
                console.log('hi')
                this.game.setupNewGame();
                this.game.updateMoveListeners(this.game.gameState);
            })
            let oldBoard = document.getElementById('board');

            this.main.removeChild(oldBoard);
            this.main.append(board);

            let curScore = game.gameState.score;
            console.log(curScore);

            document.getElementById('value').innerHTML = curScore;
        })

        this.game.onLose(state => {
            document.removeEventListener('keypress', input);
            let lose = document.createElement('div');
            lose.classList.add("lose");
            lose.setAttribute('id', 'lose');
            lose.append("Game Over");
            this.main.append(lose);
        })

        this.game.onWin(state => {
            let win = document.createElement('div');
            win.classList.add('win');
            win.setAttribute('id', 'win')
            win.append("You Won!");
            let oldWin = document.getElementById('win');
            if (!this.main.contains(oldWin)) {
                this.main.append(win);
            }
        })
    }
}