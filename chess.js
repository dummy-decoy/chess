const colors = {
    white: 'w',
    black: 'b'
}
const pieces = {
    pawn: 'p',
    rook: 'r',
    knight: 'n',
    bishop: 'b',
    queen: 'q',
    king: 'k'
}
const castles = {
    queenside: 'q',
    kingside: 'k'
}

const clone = (obj) => {
    if (obj === null || typeof obj !== "object") 
        return obj;
    if (Array.isArray(obj)) 
        return obj.map(clone);

    const result = Object.create(Object.getPrototypeOf(obj));
    for (const key in obj) {
        result[key] = clone(obj[key]);
    }
    return result;
}

class pawn {
    type = pieces.pawn;
    static letter = '';
    color;
    moved = false;
    symbol;
    constructor(color) {
        this.color = color;
        this.symbol = (color === colors.white) ? '\u2659' : '\u265f';
    }
    moves(from, board, enpassant=null) {
        let x = from[0];
        let y = from[1];

        let moves = [];
        if (this.color === colors.white) {
            if ((board.length > y+1) && (board[y+1][x] === null)) {
                moves.push([x, y+1]);
                if (!this.moved && (board.length > y+2) && (board[y+2][x] === null)) {
                    moves.push([x, y+2]);
                }
            }
            if ((board.length > y+1) && (x-1 >= 0) && (((board[y+1][x-1] !== null) && (board[y+1][x-1].color !== this.color)) || ((enpassant !== null) && (enpassant.every( (val, index) => val === [x-1, y+1][index]))))) {
                moves.push([x-1, y+1]);
            }
            if ((board.length > y+1) && (x+1 < board[y+1].length) && (((board[y+1][x+1] !== null) && (board[y+1][x+1].color !== this.color)) || ((enpassant !== null) && (enpassant.every( (val, index) => val === [x+1, y+1][index]))))) {
                moves.push([x+1, y+1]);
            }
        } else {
            if ((y-1 >= 0) && (board[y-1][x] === null)) {
                moves.push([x, y-1]);
                if (!this.moved && (y-2 >= 0) && (board[y-2][x] === null)) {
                    moves.push([x, y-2]);
                }
            }
            if ((y-1 >= 0) && (x-1 >= 0) && (((board[y-1][x-1] !== null) && (board[y-1][x-1].color !== this.color)) || ((enpassant !== null) && (enpassant.every( (val, index) => val === [x-1, y-1][index]))))) {
                moves.push([x-1, y-1]);
            }
            if ((y-1 >= 0) && (x+1 < board[y-1].length) && (((board[y-1][x+1] !== null) && (board[y-1][x+1].color !== this.color)) || ((enpassant !== null) && (enpassant.every( (val, index) => val === [x+1, y-1][index]))))) {
                moves.push([x+1, y-1]);
            }
        }
        return moves;
    }
}
class knight {
    type = pieces.knight;
    static letter = 'N';
    color;
    moved = false;
    symbol;
    constructor(color) {
        this.color = color;
        this.symbol = (color === colors.white) ? '\u2658' : '\u265e';
    }
    moves(from, board) {
        let x = from[0];
        let y = from[1];
        
        let moves = [];
        for (let move of [[x+2,y+1],[x+2,y-1],[x-2,y+1],[x-2,y-1],[x+1,y+2],[x+1,y-2],[x-1,y+2],[x-1,y-2]]) {
            if ((move[1] >= 0) && (move[1] < board.length) && (move[0] >= 0) && (move[0] < board[move[1]].length)
                && ((board[move[1]][move[0]] === null) || (board[move[1]][move[0]].color !== this.color))) {
                    moves.push(move);
            } 
        }
        return moves;
    }
}
class bishop {
    type = pieces.bishop;
    static letter = 'B';
    color;
    moved = false;
    symbol;
    constructor(color) {
        this.color = color;
        this.symbol = (color === colors.white) ? '\u2657' : '\u265d';
    }
    moves(from, board) {
        let x = from[0];
        let y = from[1];

        let moves = [];

        let i = 1;
        while ((y+i < board.length) && (x+i < board[y+i].length)) {
            if (board[y+i][x+i] === null) {
                moves.push([x+i,y+i]);
            } else {
                if (board[y+i][x+i].color !== this.color) {
                    moves.push([x+i,y+i]);
                }
                break;
            }
            i++;
        }
        i = 1;
        while ((y-i >= 0) && (x-i >= 0)) {
            if (board[y-i][x-i] === null) {
                moves.push([x-i,y-i]);
            } else {
                if (board[y-i][x-i].color !== this.color) {
                    moves.push([x-i,y-i]);
                }
                break;
            }
            i++;
        }
        i = 1;
        while ((y+i < board.length) && (x-i >= 0)) {
            if (board[y+i][x-i] === null) {
                moves.push([x-i,y+i]);
            } else {
                if (board[y+i][x-i].color !== this.color) {
                    moves.push([x-i,y+i]);
                }
                break;
            }
            i++;
        }
        i = 1;
        while ((y-i >= 0) && (x+i < board[y-i].length)) {
            if (board[y-i][x+i] === null) {
                moves.push([x+i,y-i]);
            } else {
                if (board[y-i][x+i].color !== this.color) {
                    moves.push([x+i,y-i]);
                }
                break;
            }
            i++;
        }

        return moves;
    }
}
class rook {
    type = pieces.rook;
    static letter = 'R';
    color;
    moved = false;
    symbol;
    constructor(color) {
        this.color = color;
        this.symbol = (color === colors.white) ? '\u2656' : '\u265c';
    }
    moves(from, board) {
        let x = from[0];
        let y = from[1];

        let moves = [];
        for (let i = x+1; i < board[y].length; i++) {
            if (board[y][i] === null) {
                moves.push([i,y]);
            } else {
                if (board[y][i].color !== this.color) {
                    moves.push([i,y]);
                }
                break;
            }
        }
        for (let i = x-1; i >= 0; i--) {
            if (board[y][i] === null) {
                moves.push([i,y]);
            } else {
                if (board[y][i].color !== this.color) {
                    moves.push([i,y]);
                }
                break;
            }
        }
        for (let j = y+1; j < board.length; j++) {
            if (board[j][x] === null) {
                moves.push([x,j]);
            } else {
                if (board[j][x].color !== this.color) {
                    moves.push([x,j]);
                }
                break;
            }
        }
        for (let j = y-1; j >= 0; j--) {
            if (board[j][x] === null) {
                moves.push([x,j]);
            } else {
                if (board[j][x].color !== this.color) {
                    moves.push([x,j]);
                }
                break;
            }
        }

        return moves;
    }
}
class queen {
    type = pieces.queen;
    static letter = 'Q';
    color;
    moved = false;
    symbol;
    constructor(color) {
        this.color = color;
        this.symbol = (color === colors.white) ? '\u2655' : '\u265b';
    }
    moves(from, board) {
        let moves = [];
        moves = moves.concat(new rook(this.color).moves(from, board));
        moves = moves.concat(new bishop(this.color).moves(from, board));
        return moves;
    }
}
class king {
    type = pieces.king;
    static letter = 'K';
    color;
    moved = false;
    symbol;
    constructor(color) {
        this.color = color;
        this.symbol = (color === colors.white) ? '\u2654' : '\u265a';
    }
    moves(from, board) {
        let x = from[0];
        let y = from[1];

        let moves = [];
        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {
                if ((j >= 0) && (j < board.length) && (i >= 0) && (i < board[j].length)
                    && ((board[j][i] === null) || (board[j][i].color !== this.color))) {
                        moves.push([i,j]);
                }
            }
        }

        if (!this.moved) {
            let rook = board[y][board[y].length-1];
            if ((rook !== null) && (rook.type === pieces.rook) && !rook.moved) {
                let clear = true;
                for (let i = x+1; i < board[y].length-1; i++) {
                    if (board[y][i] !== null) {
                        clear = false;
                        break;
                    }
                }
                if (clear) {
                    moves.push([x+2,y]);
                }
            }
            rook = board[y][0];
            if ((rook !== null) && (rook.type === pieces.rook) && !rook.moved) {
                let clear = true;
                for (let i = x-1; i > 0; i--) {
                    if (board[y][i] !== null) {
                        clear = false;
                        break;
                    }
                }
                if (clear) {
                    moves.push([x-2,y]);
                }
            }
        }
        return moves;
    }
}

class chess {
    turn = colors.white;
    board = [];
    scoresheet = [];
    kings = {[colors.white]: [4,0], [colors.black]: [4,7]};
    taken = {[colors.white]: [], [colors.black]: []};
    enpassant = null;
    undo_stack = [];
    redo_stack = [];
    constructor() {
        this.board = [
            [new rook(colors.white), new knight(colors.white), new bishop(colors.white), new queen(colors.white), new king(colors.white), new bishop(colors.white), new knight(colors.white), new rook(colors.white)],
            [new pawn(colors.white), new pawn(colors.white), new pawn(colors.white), new pawn(colors.white), new pawn(colors.white), new pawn(colors.white), new pawn(colors.white), new pawn(colors.white)],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new pawn(colors.black), new pawn(colors.black), new pawn(colors.black), new pawn(colors.black), new pawn(colors.black), new pawn(colors.black), new pawn(colors.black), new pawn(colors.black)],
            [new rook(colors.black), new knight(colors.black), new bishop(colors.black), new queen(colors.black), new king(colors.black), new bishop(colors.black), new knight(colors.black), new rook(colors.black)]
        ];
    }
    

    save() {
        this.redo_stack = [];
        this.undo_stack.push({turn: this.turn, scoresheet: clone(this.scoresheet), kings: clone(this.kings), taken: clone(this.taken), enpassant: clone(this.enpassant), board: clone(this.board)});
    }
    undo() {
        if (this.undo_stack.length > 0) {
            let save = this.undo_stack.pop();
            this.redo_stack.push({turn: this.turn, scoresheet: clone(this.scoresheet), kings: clone(this.kings), taken: clone(this.taken), enpassant: clone(this.enpassant), board: clone(this.board)});
            this.turn = save.turn;
            this.scoresheet = save.scoresheet;
            this.kings = save.kings;
            this.taken = save.taken;
            this.enpassant = save.enpassant;
            this.board = save.board;
        }
    }
    redo() {
        if (this.redo_stack.length > 0) {
            let save = this.redo_stack.pop();
            this.undo_stack.push({turn: this.turn, scoresheet: clone(this.scoresheet), kings: clone(this.kings), taken: clone(this.taken), enpassant: clone(this.enpassant), board: clone(this.board)});
            this.turn = save.turn;
            this.scoresheet = save.scoresheet;
            this.kings = save.kings;
            this.taken = save.taken;
            this.enpassant = save.enpassant;
            this.board = save.board;
        }
    }
    checked(king) {
        let piece = this.board[king[1]][king[0]];
        
        let x = king[0];
        let y = king[1];

        // pawns
        if (piece.color === colors.white) {
            if ((y+1 < this.board.length) && (x-1 >=0) && (this.board[y+1][x-1] !== null) && (this.board[y+1][x-1].type === pieces.pawn) && (this.board[y+1][x-1].color !== piece.color)) {
                return true;
            }
            if ((y+1 < this.board.length) && (x+1 < this.board[y+1].length) && (this.board[y+1][x+1] !== null) && (this.board[y+1][x+1].type === pieces.pawn) && (this.board[y+1][x+1].color !== piece.color)) {
                return true;
            }
        } else {
            if ((y-1 >= 0) && (x-1 >= 0) && (this.board[y-1][x-1] !== null) && (this.board[y-1][x-1].type === pieces.pawn) && (this.board[y-1][x-1].color !== piece.color)) {
                return true;
            }
            if ((y-1 >= 0) && (x+1 < this.board[y-1].length) && (this.board[y-1][x+1] !== null) && (this.board[y-1][x+1].type === pieces.pawn) && (this.board[y-1][x+1].color !== piece.color)) {
                return true;
            }
        }

        // knights 
        let moves = [[x+1,y+2],[x+1,y-2],[x-1,y+2],[x-1,y-2],[x+2,y+1],[x+2,y-1],[x-2,y+1],[x-2,y-1]];
        for (let move of moves) {
            if ((move[1] >= 0) && (move[1] < this.board.length) && (move[0] >= 0) && (move[0] < this.board[move[1]].length)
                && ((this.board[move[1]][move[0]] !== null) && (this.board[move[1]][move[0]].type === pieces.knight) && (this.board[move[1]][move[0]].color !== piece.color))) {
                return true;
            }
        }

        // bishops, queens
        let i = 1;
        while ((y+i < this.board.length) && (x+i < this.board[y+i].length)) {
            if (this.board[y+i][x+i] !== null) {
                if ((this.board[y+i][x+i].color !== piece.color) && ((this.board[y+i][x+i].type === pieces.bishop) || (this.board[y+i][x+i].type === pieces.queen))) {
                    return true;
                }
                break;
            }
            i++;
        }
        i = 1;
        while ((y-i >= 0) && (x-i >= 0)) {
            if (this.board[y-i][x-i] !== null) {
                if ((this.board[y-i][x-i].color !== piece.color) && ((this.board[y-i][x-i].type === pieces.bishop) || (this.board[y-i][x-i].type === pieces.queen))) {
                    return true;
                }
                break;
            }
            i++;
        }
        i = 1;
        while ((y+i < this.board.length) && (x-i >= 0)) {
            if (this.board[y+i][x-i] !== null) {
                if ((this.board[y+i][x-i].color !== piece.color) && ((this.board[y+i][x-i].type === pieces.bishop) || (this.board[y+i][x-i].type === pieces.queen))) {
                    return true;
                }
                break;
            }
            i++;
        }
        i = 1;
        while ((y-i >= 0) && (x+i < this.board[y-i].length)) {
            if (this.board[y-i][x+i] !== null) {
                if ((this.board[y-i][x+i].color !== piece.color) && ((this.board[y-i][x+i].type === pieces.bishop) || (this.board[y-i][x+i].type === pieces.queen))) {
                    return true;
                }
                break;
            }
            i++;
        }

        // rooks, queens
        for (let i = x+1; i < this.board[y].length; i++) {
            if (this.board[y][i] !== null) {
                if ((this.board[y][i].color !== piece.color) && ((this.board[y][i].type === pieces.rook) || (this.board[y][i].type === pieces.queen))) {
                    return true;
                }
                break;
            }
        }
        for (let i = x-1; i >= 0; i--) {
            if (this.board[y][i] !== null) {
                if ((this.board[y][i].color !== piece.color) && ((this.board[y][i].type === pieces.rook) || (this.board[y][i].type === pieces.queen))) {
                    return true;
                }
                break;
            }
        }
        for (let j = y+1; j < this.board.length; j++) {
            if (this.board[j][x] !== null) {
                if ((this.board[j][x].color !== piece.color) && ((this.board[j][x].type === pieces.rook) || (this.board[j][x].type === pieces.queen))) {
                    return true;
                }
                break;
            }
        }
        for (let j = y-1; j >= 0; j--) {
            if (this.board[j][x] !== null) {
                if ((this.board[j][x].color !== piece.color) && ((this.board[j][x].type === pieces.rook) || (this.board[j][x].type === pieces.queen))) {
                    return true;
                }
                break;
            }
        }

        // kings
        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {
                if ((j >= 0) && (j < this.board.length) && (i >= 0) && (i < this.board[j].length)
                    && ((this.board[j][i] !== null) && (this.board[j][i].type === pieces.king) && (this.board[j][i].color !== piece.color))) {
                        return true;
                }
            }
        }

        return false;
    }
    check(to, color) {
        let from = this.kings[color];
        let king = this.board[from[1]][from[0]];
        let save = this.board[to[1]][to[0]];
        
        this.board[from[1]][from[0]] = null;
        this.board[to[1]][to[0]] = king;
        let result = this.checked(to);
        this.board[from[1]][from[0]] = king;
        this.board[to[1]][to[0]] = save;
        return result;

    }
    staled(color) {
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                let piece = this.board[y][x];
                if ((piece !== null) && (piece.color === color)) {
                    if (this.moves([x,y]).length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    stalemate(color) {
        return this.staled(color) && !this.checked(this.kings[color]);
    }
    draw(color) {
        let remaining = this.board.flat().filter((piece) => piece !== null);
        return this.stalemate(color) || ((remaining.length <= 3) && remaining.every((piece) => piece.type === pieces.king || piece.type === pieces.bishop || piece.type === pieces.knight));
    }
    checkmate(color) {
        return this.staled(color) && this.checked(this.kings[color]);
    }
    moves(from) {
        let piece = this.board[from[1]][from[0]];

        let x = from[0];
        let y = from[1];

        let moves = [];
        if (piece !== null) {
            // check if not checked for each possible move
            for (let to of piece.moves(from, this.board, this.enpassant)) {
                if (piece.type === pieces.king) {
                    if (Math.abs(to.x-piece.x) > 1) {
                        let check = false;
                        for (let i = Math.min(from[0], to[0]); i <= Math.max(from[0], to[0]); i++) {
                            if (this.check([i, from[1]], piece.color)) {
                                check = true;
                                break;
                            }
                        }
                        if (!check) {
                            moves.push(to);
                        }
                    } else if (!this.check(to, piece.color)) {
                        moves.push(to);
                    }
                } else {
                    let save = this.board[to[1]][to[0]];
                    this.board[to[1]][to[0]] = piece;
                    this.board[from[1]][from[0]] = null;
                    if (!this.checked(this.kings[piece.color])) {
                        moves.push(to);
                    }
                    this.board[from[1]][from[0]] = piece;
                    this.board[to[1]][to[0]] = save;
                }
            }
        }
        return moves;
    }

    log(piece, from, to, take=false, enpassant=false,promote=false, castle=null) {
        const columns = 'abcdefgh';
        const lines = '12345678';
        
        let desc = ''
        if (castle === castles.kingside) {
            desc = 'O-O';
        } else if (castle === castles.queenside) {
            desc = 'O-O-O';
        } else {
            let dest = columns[to[0]] + lines[to[1]];
            
            let disambig = '';
            if (piece.type === pieces.pawn) {
                if (take || enpassant) {
                    disambig = columns[from[0]];
                }
            } else {
                let same = [];
                for (let y = 0; y < this.board.length; y++) {
                    for (let x = 0; x < this.board[y].length; x++) {
                        let other = this.board[y][x];
                        if ((other !== null) && (other.type === piece.type) && (other.color === piece.color) && !((x === to[0]) && (y === to[1]))) {
                            if ((piece.type === pieces.rook || piece.type === pieces.queen) && (to[1] === y || to[0] === x)
                                || (piece.type === pieces.bishop || piece.type === pieces.queen) && (Math.abs(to[0]-x) === Math.abs(to[1]-y))
                                || (piece.type === pieces.knight) && (Math.abs(to[0]-x) === 2 && Math.abs(to[1]-y) === 1 || Math.abs(to[0]-x) === 1 && Math.abs(to[1]-y) === 2)) {
                                same.push([x, y]);
                            }
                        }
                    }
                }
                if (same.length > 0) {
                    if (same.every((other) => other[0] !== from[0])) {
                        disambig = columns[from[0]];
                    } else if (same.every((other) => other[1] !== from[1])) {
                        disambig = lines[from[1]];
                    } else {
                        disambig = columns[from[0]] + lines[from[1]];
                    }
                }
            }
            desc = piece.constructor.letter + disambig + ((take || enpassant) ? 'x' : '') + dest + (promote ? '=' + this.board[to[1]][to[0]].constructor.letter : '') + (enpassant ? ' e.p.' : '');
        } 

       if (this.checkmate(this.turn)) {
            desc += '#';
        } else if (this.checked(this.kings[this.turn])) {
            desc += '+';
        }
        
        if ((this.scoresheet.length == 0) || (this.scoresheet[this.scoresheet.length-1].length == 2)) {
            this.scoresheet.push([desc]);
        } else {
            this.scoresheet[this.scoresheet.length-1].push(desc);
        }
    }

    move(from, to) {
        let piece = this.board[from[1]][from[0]];
        let moves = this.moves(from);
        for (let move of moves) {
            if ((move[0] === to[0]) && (move[1] === to[1])
                && !((piece.type === pieces.pawn) && (piece.color == colors.white ? to[1] === this.board.length-1 : to[1] === 0))
                && !((piece.type === pieces.king) && (Math.abs(from[0]-to[0]) == 2))) {
                this.save();
                if ((piece.type === pieces.pawn) && (this.enpassant !== null) && (this.enpassant.every((val, index) => val === [to[0], to[1]][index]))) {
                    this.taken[piece.color].push(this.board[from[1]][to[0]]);
                    this.board[from[1]][to[0]] = null;
                } else if (this.board[to[1]][to[0]] !== null) {
                    this.taken[piece.color].push(this.board[to[1]][to[0]]);
                }
                this.board[to[1]][to[0]] = piece;
                this.board[from[1]][from[0]] = null;
                piece.moved = true;
                if ((piece.type === pieces.pawn) && (Math.abs(from[1]-to[1]) == 2)) {
                    this.enpassant = [to[0], (from[1]+to[1])/2];
                } else {
                    this.enpassant = null;
                }
                if (piece.type === pieces.king) {
                    this.kings[piece.color] = [to[0], to[1]];
                }
                return true;
            }
        }
        return false;
    }
    promote(from, to, type=null) {
        const construct = {
            [pieces.queen]: queen,
            [pieces.rook]: rook,
            [pieces.bishop]: bishop,
            [pieces.knight]: knight
        };
        let old = this.board[from[1]][from[0]];
        if ((type in construct) && (old.type === pieces.pawn) && (old.color == colors.white ? from[1] === this.board.length-2 : from[1] === 1)) {
            let moves = this.moves(from);
            for (let move of moves) {
                if ((move[0] === to[0]) && (move[1] === to[1])) {
                    this.save();
                    if (this.board[to[1]][to[0]] !== null) {
                        this.taken[old.color].push(this.board[to[1]][to[0]]);
                    }
                    this.board[to[1]][to[0]] = new construct[type](old.color);
                    this.board[to[1]][to[0]].moved = true;
                    this.board[from[1]][from[0]] = null;
                    return true;
                }
            }       
        }
        return false;
    }
    castle(from, side=null) {
        let king = this.board[from[1]][from[0]];
        if ((king.type === pieces.king) && !king.moved) {
            if (side === castles.kingside) {
                let rook = this.board[from[1]][this.board[from[1]].length-1];
                if ((rook !== null) && (rook.type === pieces.rook) && !rook.moved 
                    && [from[0]+1, from[0]+2].every((i) => (this.board[from[1]][i] === null))
                    && [from[0], from[0]+1, from[0]+2].every((i) => !this.check([i, from[1]], king.color))) {
                    this.save();
                    this.board[from[1]][from[0]+2] = king;
                    this.board[from[1]][from[0]+1] = rook;
                    this.board[from[1]][from[0]] = null;
                    this.board[from[1]][this.board[from[1]].length-1] = null;
                    king.moved = true;
                    rook.moved = true;
                    this.kings[king.color] = [from[0]+2, from[1]];
                    return true;
                }
            } else if (side === castles.queenside) {
                let rook = this.board[from[1]][0];
                if ((rook !== null) && (rook.type === pieces.rook) && !rook.moved 
                    && [from[0]-1, from[0]-2, from[0]-3].every((i) => (this.board[from[1]][i] === null))
                    && [from[0], from[0]-1, from[0]-2].every((i) => !this.check([i, from[1]], king.color))) {
                    this.save();
                    this.board[from[1]][from[0]-2] = king;
                    this.board[from[1]][from[0]-1] = rook;
                    this.board[from[1]][from[0]] = null;
                    this.board[from[1]][0] = null;
                    king.moved = true;
                    rook.moved = true;
                    this.kings[king.color] = [from[0]-2, from[1]];
                    return true;
                }
            }
        }
        return false;
    }

    select(from) {
        let piece = this.board[from[1]][from[0]];
        if ((piece !== null) && (piece.color === this.turn)) {
            return this.moves(from);
        }
        return [];
    }
    play(from, to, promote=null) {
        let piece = this.board[from[1]][from[0]];
        let take = (this.board[to[1]][to[0]] !== null);
        let castle = (piece !== null && piece.type === pieces.king && Math.abs(from[0]-to[0]) == 2) ? (from[0]>to[0] ? castles.queenside : castles.kingside) : null;
        let enpassant = (piece !== null && piece.type === pieces.pawn && this.enpassant !== null && this.enpassant.every((val, index) => val === to[index]));
        if ((piece !== null) && (piece.color === this.turn) && (this.castle(from, castle) || this.promote(from, to, promote) || this.move(from, to))) {
            this.turn = (this.turn === colors.white) ? colors.black : colors.white;
            this.log(piece, from, to, take, enpassant, (promote!==null), castle);
            return true;
        }
        return false;
    }
}
