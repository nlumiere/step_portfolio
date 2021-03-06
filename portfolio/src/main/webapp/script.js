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


function userAuth(){
    visitLink("/login");
}


function getGame() {
    fetch('/view-games').then(response => response.json()).then((games) => {
        // stats is an object, not a string, so we have to
        // reference its fields to create HTML content
        const allGamesContainer = document.getElementById('games-container');

        for(var ii = 0; ii < games.length; ii++){
            allGamesContainer.appendChild(createGameElement(games[ii]));
        }
    });
}

function createGameElement(game){
    const gameElement = document.createElement('div');
    gameElement.className = 'game-element'
    var build = '';
    build += '<h3>' + game.white + ' (white) vs ' + game.black + ' (black)</h3>';
    build += '<h4> Game by: ' + game.userEmail + '</h4>';
    build += '<ol>';
    for(var ii = 0; ii < game.moves.length; ii++){
        build += '<li>' + game.moves[ii].first + ', ' + game.moves[ii].second + '</li>';
    }
    build += '<p>Result: ' + game.result + '</p>';
    gameElement.innerHTML = build;

    return gameElement;
}

function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

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
    let htmlString = '';
    htmlString += '<div id = "board">';
    var ii, jj;
    for(ii = 0; ii < 8 /* static size of board */; ii++){
        for(jj = 0; jj < 8 /* static size of board */; jj++){
            if(b.row[ii][jj].color == 'white')
                htmlString += '<button class = "white-square" onclick="b.squareClicked(b.row[' + 
                    ii + '][' + jj + '], b)"></button>';
            else
                htmlString += '<button class = "black-square" onclick="b.squareClicked(b.row[' + 
                    ii + '][' + jj + '], b)"></button>';
        }
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

    return pieceSquares;

}

//Initializes piece elements and returns array of all pieces
function placePieces(boardElem, pieceSquares, b){

    var ii;
    for(ii = 0; ii < 32; ii++){
        b.pieceElems[ii] = document.createElement("img");

        b.pieceElems[ii].src = pieceSquares[ii].piece.image;
        b.pieceElems[ii].className = "piece-element";
        boardElem.appendChild(b.pieceElems[ii]);
        b.pieceElems[ii].style.marginLeft = "-" + 
            ((8 - pieceSquares[ii].piece.col)*75) + "px";
        b.pieceElems[ii].style.marginTop = "-" + 
            ((7 - pieceSquares[ii].piece.row)*75) + "px";
        
    }
}

function generateBoard(){
    const boardContainer = document.getElementById('board-container');
    b = new Board();

    //Draws board per htmlString
    boardContainer.innerHTML = writeHTMLString(b);
    //Now that writeHTMLString() has been called, an object with id board exists
    const boardElem = document.getElementById('board');
    
    //pieceSquares and pieceElems used together to control all behavior of pieces
    b.pieceSquares = initializePieces(b);
    placePieces(boardElem, b.pieceSquares, b);

    playGame(b);
}

function playGame(b){
    b.turnTrackerContainer = document.getElementById('turn-tracker-container');
    b.turnTrackerContainer.innerHTML = 'White to move';
    const featureContainer = document.getElementById('feature-container');
    featureContainer.innerHTML = 'Notable unimplemented features: <br /> * ' + 
        'Computer assisted check/checkmate <br /> * En passant capturing <br /> ' + 
        '* Castling <br /> * Draw conditions';
    const moveContainer = document.getElementById('move-list-container');
    moveContainer.innerHTML = '<ol>';
}

function turn(b){
    if(b.turn == 'White'){
        b.turn = 'Black';
    }
    else if(b.turn == 'Black'){
        b.turn = 'White';
    }
    b.turnTrackerContainer.innerHTML = b.turn + " to move";
    console.debug(b.turn + "'s turn");
}

class Board{
    constructor(){
        this.pieceSquares = new Array(32);
        this.pieceElems = new Array(32);
        this.row = new Array(8);
        var ii, jj;
        for(let ii = 0; ii < 8; ii++){
            this.row[ii] = new Array(8);
            for(let jj = 0; jj < 8; jj++){
                this.row[ii][jj] = new Square(ii, jj);
            }
        }

        this.selected_square = null;
        
        //White moves first
        this.turn = 'White';
        this.turnTrackerContainer;
        this.moves = '';
    }

    //Makes sure the move is legal
    //If the piece lands on a square occupied by a friendly piece it will select the friendly piece
    //TODO: Implement check and checkmate
    checkLegal(square, selected_piece){
        if(selected_piece.isWhite && this.turn == 'White' || 
            !selected_piece.isWhite && this.turn == 'Black'){

            if(selected_piece.type == 'pawn'){
                if(selected_piece.isWhite){

                    //normal move
                    if(square.row == this.selected_square.row - 1 && 
                        square.col == this.selected_square.col && !square.piece){

                        selected_piece.moved = true;
                        return true;
                    }

                    //can move twice if haven't moved
                    else if(square.row == this.selected_square.row - 2 && 
                        square.col == this.selected_square.col && !selected_piece.moved 
                        && !square.piece){
                        
                        selected_piece.moved = true;
                        return true;
                    }

                    //captures diagnoally
                    else if(square.row == this.selected_square.row - 1 && 
                        (square.col == this.selected_square.col + 1 || 
                        square.col == this.selected_square.col - 1) &&
                        square.piece){
                        
                        selected_piece.moved = true;
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{

                    //normal move
                    if(square.row == this.selected_square.row + 1 && 
                        square.col == this.selected_square.col && !square.piece){

                        selected_piece.moved = true;
                        return true;
                    }

                    //can move twice if haven't moved
                    else if(square.row == this.selected_square.row + 2 && 
                        square.col == this.selected_square.col && !selected_piece.moved && 
                        !square.piece){

                        selected_piece.moved = true;
                        return true;
                    }

                    //captures diagonally
                    else if(square.row == this.selected_square.row + 1 && 
                        (square.col == this.selected_square.col + 1 || 
                        square.col == this.selected_square.col - 1) &&
                        square.piece){
                        
                        selected_piece.moved = true;
                        return true;
                    }
                }
            }
            else if(selected_piece.type == 'knight'){
                //Two vertical and one horizontal or two horizontal and one vertical
                if((Math.abs(square.row - this.selected_square.row) == 2 &&
                    Math.abs(square.col - this.selected_square.col) == 1) ||
                    (Math.abs(square.row - this.selected_square.row) == 1 && 
                    Math.abs(square.col - this.selected_square.col) == 2)){
                    
                    return true;
                }
            }
            else if(selected_piece.type == 'bishop'){
                if(square.row - this.selected_square.row == square.col - this.selected_square.col){
                    return true;
                }
                else if((square.row - this.selected_square.row) + (square.col - this.selected_square.col) == 0){
                    return true;
                }
            }
            else if(selected_piece.type == 'rook'){
                //There is no change in horizontal position or there is no vertical change
                //And 
                //the row is not the same or the column is not the same
                if((square.row - this.selected_square.row == 0 || 
                    square.col - this.selected_square.col == 0) && (square.row != 
                    this.selected_square.row || square.col != this.selected_square.col)){

                    selected_piece.moved = true;
                    return true;
                }
            }
            else if(selected_piece.type == 'queen'){
                //Bishop moving patterns
                if(square.row - this.selected_square.row == square.col - this.selected_square.col){
                    return true;
                }
                else if((square.row - this.selected_square.row) + 
                    (square.col - this.selected_square.col) == 0){
                    return true;
                }
                //Rook moving patterns
                else if((square.row - this.selected_square.row == 0 || 
                    square.col - this.selected_square.col == 0) && (square.row != 
                    this.selected_square.row || square.col != this.selected_square.col)){

                    return true;
                }
            }
            else if(selected_piece.type == 'king'){
                if(Math.abs(square.row - this.selected_square.row) < 2 && 
                    Math.abs(square.col - this.selected_square.col) < 2){
                    
                    selected_piece.moved = true;
                    return true;
                }

                //Unimplemented castling feature
                //TODO: Implement castling
                else if(square.row == this.selected_square.row && 
                    square.col == this.selected_col + 2){
                    if(selected_piece.isWhite){
                        if(!this.row[7][5].piece && !this.row[7][6].piece){
                            selected_piece.moved = true;
                            return 2;
                        }
                    }
                    else{
                        if(!this.row[0][5].piece && !this.row[0][6].piece){
                            selected_piece.moved = true;
                            return 3;
                        }
                    }
                    return false;
                }
                else if(square.row == this.selected_square.row && 
                    square.col == this.selected_col - 2){
                    if(selected_piece.isWhite){
                        if(!this.row[7][1].piece && !this.row[7][2].piece && !this.row[7][3].piece){
                            selected_piece.moved = true;
                            return 2;
                        }
                    }
                    else{
                        if(!this.row[0][1].piece && !this.row[0][2].piece && !this.row[0][3].piece){
                            selected_piece.moved = true;
                            return 3;
                        }
                    }
                    return false;
                }
            }
        }
        return false;
    }

    squareClicked(square){

        //if there is a previously selected square
        if(this.selected_square){

            //determine if move is legal
            let legal = this.checkLegal(square, this.selected_square.piece);

            //if the move is legal
            if(legal == true){
                //if there is a piece on the square
                if(square.piece){
                    //if the piece is the same color as the piece on the previously selected square
                    if(square.piece.isWhite == this.selected_square.piece.isWhite){
                        //TODO: make .moved false if the piece hasn't moved when reselecting
                        this.selected_square = square;
                        return;
                    }
                    //if the piece is not the same color (capture the piece)
                    else{
                        //TODO: Make this a helper method
                        for(var ii = 0; ii < 32; ii++){
                            if(this.pieceSquares[ii].row == square.row && 
                                this.pieceSquares[ii].col == square.col){

                                this.pieceElems[ii].style.visibility = "hidden";
                            }
                        }
                    }
                }

                //Records the move
                this.notation(square);

                //move the piece to the square
                //TODO: Make this a helper method
                square.piece = this.selected_square.piece;
                this.selected_square.piece = null;
                for(var ii = 0; ii < this.pieceSquares.length; ii++){
                    if(this.selected_square == this.pieceSquares[ii]){
                        this.pieceSquares[ii] = square;
                        this.pieceElems[ii].style.marginLeft = "-" + 
                            ((8 - square.col)*75) + "px";
                        this.pieceElems[ii].style.marginTop = "-" + 
                            ((7 - square.row)*75) + "px";
                    }
                }

                this.selected_square = null;
                //progresses the turn tracker
                turn(b);
            }
            //castles kingside
            else if(legal == 2){
                
            }
            //castles queenside
            else if(legal == 3){

            }
            //if the move is illegal
            else{
                if(square.piece){
                    //if the piece is the same color as the piece on the previously selected square
                    if(square.piece.isWhite == this.selected_square.piece.isWhite){
                        this.selected_square = square;
                        return;
                    }
                }
                console.debug("Illegal move.");
            }
            this.selected_square = false;
        }
        //if there is no previously selected square (selects a square if there's a piece on it)
        else{
            if(square.piece){
                this.selected_square = square;
            }
        }
    }

    notation(square){
        var no_piece = this.expanded_notation(square);
        var full_notation = '';
        if(this.selected_square.piece.type == 'pawn'){
            full_notation = no_piece;
        }
        else if(this.selected_square.piece.type == 'knight'){
            full_notation = 'n' + no_piece;
        }
        else{
            full_notation = this.selected_square.piece.type.charAt(0) + no_piece;
        }

        const moveContainer = document.getElementById('move-list-container');
        moveContainer.appendChild(createListElement(full_notation));
        document.getElementById('move-submit').value += full_notation + ' ';
    }

    //Builds the chess notation for the move just played
    expanded_notation(square){
        // var full_move = this.selected_square.piece.type;
        var str = '';
        str += String.fromCharCode(97 + this.selected_square.col);
        str += (8 - this.selected_square.row);
        str += '-';
        str += String.fromCharCode(97 + square.col);
        str += 8 - square.row;

        this.moves += str;
        return str;
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
        this.type = 'pawn';
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

        this.moved = false;
    }
}

class Knight{
    constructor(isWhite, row, col){
        this.type = 'knight';
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
        this.type = 'bishop';
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
        this.type = 'rook';
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

        this.moved = false;
    }
}

class King{
    constructor(isWhite, row, col){
        this.type = 'king';
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

        this.moved = false;
        this.inCheck = false;
    }
}

class Queen{
    constructor(isWhite, row, col){
        this.type = 'queen';
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

function createMap() {
    var lati = Math.random()*90;
    var long = Math.random()*180;
    var temp = Math.random()
    if(temp < .25){
        lati *= -1;
        long *= -1;
    }
    else if(temp < .5){
        lati *= -1;
    }
    else if(temp < .75){
        long *= -1;
    }

    const map = new google.maps.Map(
        document.getElementById('map'),
        {center: {lat: lati, lng: long}, zoom: 16, styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#fecae4'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#fecae4'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#49525f'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#323b48'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#fecae4'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]});
}


