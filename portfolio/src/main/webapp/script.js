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
                htmlString += '<button class = "white-square"></button>';
            else
                htmlString += '<button class = "black-square"></button>';
        }
        // htmlString += '<br />';
    }
    htmlString += '</div>';

    return htmlString;
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
    constructor(row, col){
        this.row = row;
        this.col = col;
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


