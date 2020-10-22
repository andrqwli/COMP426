/*
Add your code for Game here
 */
export default class Game {
    constructor(size) {
        this.size = size;
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false,
        }
        this.moveListeners = [];
        this.winListeners = [];
        this.loseListeners = [];
        this.setupNewGame();
    }

    setupNewGame() {
        this.gameState.board = new Array(this.size ** 2).fill(0);
        this.generateTile(2);
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
    }

    loadGame(gameState) {
        this.gameState = gameState;
    }

    move(direction) {
        let copy = this.gameState.board;
        let compare = copy;
        switch(direction) {
            case "right":
                this.gameState.board = this.shift(copy);
                break;
            case "left":
                copy = this.rotate(copy);
                copy = this.rotate(copy)
                copy = this.shift(copy);
                copy = this.rotate(copy)
                this.gameState.board = this.rotate(copy);
                break;
            case "up":
                copy = this.rotate(copy);
                copy = this.shift(copy);
                copy = this.rotate(copy);
                copy = this.rotate(copy);
                this.gameState.board = this.rotate(copy);
                break;
            case "down":
                copy = this.rotate(copy);
                copy = this.rotate(copy);
                copy = this.rotate(copy);
                copy = this.shift(copy);
                this.gameState.board = this.rotate(copy);
        }
        if (this.isDiff(compare)) {
            this.generateTile(1);
            this.checkWin();
            this.checkLose();
            this.moveListeners.forEach((l) => l(this.gameState));
        }
    }

    isDiff(array) {
        for (let i = 0; i < this.gameState.board.length; i++) {
            if (this.gameState.board[i] != array[i]) {
                return true;
            }
        }
        return false;
    }

    rotate(array) {
        let temp = [];
        let copy = array;
        let size = this.size;
        let index = 0;
        let cycle = 0;
        for (let j = 0; j < size; j++) {
            let start = size * (size - 1) + j;
            cycle = start + j;
            for (let k = 0; k < size; k++) {
                index = size * j + k;
                temp[index] = copy[start - size * k];
            }
        }
        return temp;
    }

    shift(array) {
        let out = [];
        let size = this.size;
        for (let i = 0; i < size; i++) {
            let nonEmptyRow = [];
            for (let j = 0; j < size; j++) {
                let index = i * size + j;
                if (array[index] !== 0) {
                    nonEmptyRow.push(array[index]);
                }
            }
            let len = nonEmptyRow.length;
            let mergedRow = [];

            if (len === 0) {
                out.push([]);
                continue;
            } else if (len === 1) {
                mergedRow.push(nonEmptyRow[0])
                out.push(mergedRow);
                continue;
            } else {
                for (let j = len - 1; j >= 0; j--) {
                    if (nonEmptyRow[j] !== nonEmptyRow[j - 1]) {
                        mergedRow.push(nonEmptyRow[j]);
                    } else {
                        mergedRow.push(nonEmptyRow[j] * 2);
                        this.gameState.score += nonEmptyRow[j] * 2;
                        if (nonEmptyRow[j] * 2 === 2048) {
                            this.checkWin();
                        }
                        j--;
                    }
                }
                out.push(mergedRow.reverse());
            }
        }

        let ret = [];
        for (let i = 0; i < size; i++) {
            let zeroSpace = size - out[i].length;
            for (let j = 0; j < zeroSpace; j++) {
                ret.push(0);
            }
            for (let j = 0; j < out[i].length; j++) {
                ret.push(out[i][j]);
            }
        }
        return ret;
    }

    toString(board) {
        let ret = "";
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.gameState.board[this.size*i + j] === 0) {
                    ret += " [ ]"
                } else {
                    ret += ` [${this.gameState.board[this.size*i + j]}]`
                }
            }
            ret += "\n";
        }
        return ret;
    }

    onMove(callback) {
        this.moveListeners.push(callback);

    }


    updateMoveListeners(gameState) {
        this.moveListeners.forEach((l) => l(gameState));
    }

    onWin(callback) {
        let idx = this.winListeners.findIndex((l) => l == callback);
        if (idx == -1) {
            this.winListeners.push(callback);
        }
    }

    updateWinListeners(gameState) {
        this.winListeners.forEach((l) => l(gameState));
    }
    
    checkWin() {
        if (this.gameState.board.includes(2048)) {
            this.gameState.won = true;
            this.updateWinListeners(this.gameState);
        }
    }

    onLose(callback) {
        let idx = this.loseListeners.findIndex((l) => l == callback);
        if (idx == -1) {
            this.loseListeners.push(callback);
        }
    }

    updateLoseListeners(gameState) {
        this.loseListeners.forEach((l) => l(gameState));
    }

    checkLose() {
        if (this.gameState.board.includes(0)) {
            return false;
        } else if (this.validMoves()) {
            return false;
        } else {
            this.gameState.over = true;
            this.updateLoseListeners(this.gameState);
            return true;
        }
    }

    validMoves() {
        let size = this.size;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (this.checkTile(x, y)) {
                    return true;
                }
            }
        }
        return false;

    }

    checkTile(x, y) {
        let cur = this.getTile(x, y);
        // check tile above
        if (this.tileExists(x, y - 1)) {
            if (this.getTile(x, y - 1) == cur) {
                return true;
            }
        }
        //check tile below
        if (this.tileExists(x, y + 1)) {
            if (this.getTile(x, y + 1) == cur) {
                return true;
            }
        }
        //check tile left
        if (this.tileExists(x - 1, y)) {
            if (this.getTile(x - 1) == cur) {
                return true;
            }
        }
        //check tile right
        if (this.tileExists(x + 1,)) {
            if (this.getTile(x + 1, y) == cur) {
                return true;
            }
        }
        return false;
    }

    getTile(x, y) {
        return this.gameState.board[y*this.size + x];
    }

    tileExists(x, y) {
        if (x >= this.size || x < 0 || y < 0 || y >= this.size) {
            return false;
        } else {
            return true;
        }
    }

    getGameState() {
        return this.gameState;
    }

    generateTile(x) {
        let random = 0;
        for (let i = 0; i < x; i++) {
            random = Math.floor(Math.random() * 10);
            if (random === 0) {
                random = 4;
            } else {
                random = 2;
            }
            let indices = [];
            for (let j = 0; j < this.size ** 2; j++) {
                if (this.gameState.board[j] === 0) {
                    indices.push(j);
                }
            }
            let temp = indices.length;
            this.gameState.board[indices[Math.floor(Math.random()*temp)]] = random;
        }
    }
}
