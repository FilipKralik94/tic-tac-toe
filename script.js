

/*
var is function scoped
let and const are block scoped
*/

const playerFactory = function(name) {
    
    markSpot = function(mark, location) {
        if(gameBoard.gameboard[location] = '') {
        gameBoard.gameboard[location] = mark;
        
    };
}

    return {name: name,
            markSpot: markSpot};
};

const gameBoard = (function(){
    var gameboard = ['','','',
                    '','','',
                    '','',''];
    
    var playingBoard = document.getElementById('playingBoard');

    

    for (var i=0;i<gameboard.length;i++) {
        var square = document.createElement('div');
        square.setAttribute('id',`${i}`);
        square.setAttribute('class',`square`);
        playingBoard.appendChild(square);
        
    };

    const renderGrid = function() {
        for (var j=0;j<gameboard.length;j++) {
        var square = document.getElementById(`${j}`);
        square.textContent = gameboard[j];
        

        }
    }

    return {
        gameboard: gameboard,
        renderGrid: renderGrid,
    }
})();

const gameController = (function(){
    player1 = playerFactory('Fero');
    for (var i=0;i<gameBoard.gameboard.length;i++) {
        var location = prompt('Enter location')*1;
        player1.markSpot('x', location);
        gameBoard.renderGrid;
    }
})();

