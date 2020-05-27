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
    for(let ii = 0; ii < 8 /* static size of board */; ii++){
        for(let jj = 0; jj < 8 /* static size of board */; jj++){
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
function initializePieces(){
    //black pieces
    b.row[0][0].piece = new Rook(false);
    b.row[0][1].piece = new Knight(false);
    b.row[0][2].piece = new Bishop(false);
    b.row[0][3].piece = new Queen(false);
    b.row[0][4].piece = new King(false);
    b.row[0][5].piece = new Bishop(false);
    b.row[0][6].piece = new Knight(false);
    b.row[0][7].piece = new Rook(false);

    //white pieces
    b.row[7][0].piece = new Rook(true);
    b.row[7][1].piece = new Knight(true);
    b.row[7][2].piece = new Bishop(true);
    b.row[7][3].piece = new Queen(true);
    b.row[7][4].piece = new King(true);
    b.row[7][5].piece = new Bishop(true);
    b.row[7][6].piece = new Knight(true);
    b.row[7][7].piece = new Rook(true);

    //pawns
    for(let ii = 0; ii < 8; ii++){
        b.row[1][ii] = new Pawn(false);
        b.row[6][ii] = new Pawn(true);
    }

}

function generateBoard(){
    const boardContainer = document.getElementById('board-container');
    b = new Board();

    //Draws board per htmlString
    boardContainer.innerHTML = writeHTMLString(b);    
    
}

class Board{
    constructor(){
        this.row = new Array(8);
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

class Piece{
    constructor(isWhite){
        this.isWhite = isWhite;
    }

    move(row, col){
        return false;
    }
}

class Pawn extends Piece{
    move(row, col){

    }
}

class Knight extends Piece{
    move(row, col){

    }
}

class Bishop extends Piece{
    move(row, col){
        
    }
}

class Rook extends Piece{
    move(row, col){

    }
}

class King extends Piece{
    move(row, col){

    }
}

class Queen extends Piece{
    move(row, col){

    }
}


