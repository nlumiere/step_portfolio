// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
    const greetings =
        ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

    //declares necessary container to display greeting
    const greetingContainer = document.getElementById('greeting-container');
    let happy = false;
    
    //Loops until the user is happy with the greeting, then displays the greeting text
    while(!happy){
        // Pick a random greeting.
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        happy = confirm(greeting);
        
        //Just to remain in scope
        if(happy){
            greetingContainer.innerText = greeting;
        }
    }
}

function visitLink(s){
    window.location.href=s;
}





//Writes a string of html
function writeHTMLString(b){
    htmlString = '<div id = "board">';
    var ii, jj;
    for(ii = 0; ii < 8 /* static size of board */; ii++){
        for(jj = 0; jj < 8 /* static size of board */; jj++){
            if(b.row[ii][jj].color == 'white')
                htmlString += '<button class = "white-square" onclick="b.squareClicked(b.row[' + 
                    ii + '][' + jj + '])"></button>';
            else
                htmlString += '<button class = "black-square" onclick="b.squareClicked(b.row[' + 
                    ii + '][' + jj + '])"></button>';
        }
        // htmlString += '<br />';
    }
    htmlString += '</div>';

    return htmlString;
}

//Sets all of the pieces on the board
//Parameter is isWhite
function initializePieces(b){
    //black pieces
    b.row[0][0].piece = new Rook(false, 0, 0);
    b.row[0][1].piece = new Knight(false, 0, 1);
    b.row[0][2].piece = new Bishop(false, 0, 2);
    b.row[0][3].piece = new Queen(false, 0, 3);
    b.row[0][4].piece = new King(false, 0, 4);
    b.row[0][5].piece = new Bishop(false, 0, 5);
    b.row[0][6].piece = new Knight(false, 0, 6);
    b.row[0][7].piece = new Rook(false, 0, 7);

    //white pieces
    b.row[7][0].piece = new Rook(true, 7, 0);
    b.row[7][1].piece = new Knight(true, 7, 1);
    b.row[7][2].piece = new Bishop(true, 7, 2);
    b.row[7][3].piece = new Queen(true, 7, 3);
    b.row[7][4].piece = new King(true, 7, 4);
    b.row[7][5].piece = new Bishop(true, 7, 5);
    b.row[7][6].piece = new Knight(true, 7, 6);
    b.row[7][7].piece = new Rook(true, 7, 7);

    //pawns
    var jj;
    for(jj = 0; jj < 8; jj++){
        b.row[1][jj].piece = new Pawn(false, 1, jj);
        b.row[6][jj].piece = new Pawn(true, 6, jj);
    }

    //returns list of squares with pieces
    var pieceSquares = new Array(32);
    var ii;
    for(ii = 0; ii < 8; ii++){
        pieceSquares[4*ii+0] = b.row[0][ii];
        pieceSquares[4*ii+1] = b.row[1][ii];
        pieceSquares[4*ii+2] = b.row[6][ii];
        pieceSquares[4*ii+3] = b.row[7][ii];
    }

    // var kk;
    // for(kk = 0; kk < 32; kk++){
    //     console.log(pieceSquares[kk].piece.image);
    // }

    return pieceSquares;

}

//Initializes piece elements and returns array of all pieces
function placePieces(boardElem, pieceSquares){
    var pieceElems = new Array(32);

    var ii;
    for(ii = 0; ii < 32; ii++){
        var tempPiece = document.createElement("img");

        console.log("adding " + pieceSquares[ii].piece.image);

        tempPiece.src = pieceSquares[ii].piece.image;
        tempPiece.className = "piece-element";
        pieceElems[ii] = tempPiece;
        boardElem.appendChild(tempPiece);
        tempPiece.style.marginLeft = "-" + 
            ((8 - pieceSquares[ii].piece.col)*75) + "px";
        tempPiece.style.marginTop = "-" + 
            ((7 - pieceSquares[ii].piece.row)*75) + "px";
        
    }

    return pieceElems;
}

function generateBoard(){
    const boardContainer = document.getElementById('board-container');
    b = new Board();

    //Draws board per htmlString
    boardContainer.innerHTML = writeHTMLString(b);
    //Now that writeHTMLString() has been called, an object with id board exists
    const boardElem = document.getElementById('board');
    
    //pieceSquares and pieceElems used together to control all behavior of pieces
    pieceSquares = initializePieces(b);
    pieceElems = placePieces(boardElem, pieceSquares);

    playGame(b, pieceSquares, pieceElems);
}

function playGame(){
    const turnTrackerContainer = document.getElementById('turn-tracker-container');
    const gameMasterContainer = document.getElementById('game-master-container');
}

class Board{
    constructor(){
        this.row = new Array(8);
        var ii, jj;
        for(let ii = 0; ii < 8; ii++){
            this.row[ii] = new Array(8);
            for(let jj = 0; jj < 8; jj++){
                this.row[ii][jj] = new Square(ii, jj);
            }
        }
    }

    squareClicked(s){
        alert(s.row + ' ' + s.col);
    }
}

class Square{
    constructor(row, col){
        this.row = row;
        this.col = col;
        if((row + col)%2 == 0){
            this.color = 'white';
        }
        else{
            this.color = 'black';
        }
        this.piece = null;
    }
}




class Pawn{
    constructor(isWhite, row, col){
        this.isWhite = isWhite;
        this.row = row;
        this.col = col;
        this.image = '';
        if(isWhite){
            this.image = 'images/whitepawn.png';
        }
        else{
            this.image = 'images/blackpawn.png';
        }
    }
}

class Knight{
    constructor(isWhite, row, col){
        this.isWhite = isWhite;
        this.row = row;
        this.col = col;
        this.image = '';
        if(isWhite){
            this.image = 'images/whiteknight.png';
        }
        else{
            this.image = 'images/blackknight.png';
        }
    }
}

class Bishop{
    constructor(isWhite, row, col){
        this.isWhite = isWhite;
        this.row = row;
        this.col = col;
        this.image = '';
        if(isWhite){
            this.image = 'images/whitebishop.png';
        }
        else{
            this.image = 'images/blackbishop.png';
        }
    }
}

class Rook{
    constructor(isWhite, row, col){
        this.isWhite = isWhite;
        this.row = row;
        this.col = col;
        this.image = '';
        if(isWhite){
            this.image = 'images/whiterook.png';
        }
        else{
            this.image = 'images/blackrook.png';
        }
    }
}

class King{
    constructor(isWhite, row, col){
        this.isWhite = isWhite;
        this.row = row;
        this.col = col;
        this.image = '';
        if(isWhite){
            this.image = 'images/whiteking.png';
        }
        else{
            this.image = 'images/blackking.png';
        }
    }
}

class Queen{
    constructor(isWhite, row, col){
        this.isWhite = isWhite;
        this.row = row;
        this.col = col;
        if(isWhite){
            this.image = 'images/whitequeen.png';
        }
        else{
            this.image = 'images/blackqueen.png';
        }
    }
}


