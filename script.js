const playerFactory = function (name, type, mark) {
    var player = {
        name,
        type,
        mark
    };
    /*
       const computerMove = function () {
           var availableSpots = gameBoard.getAvailableSpots(gameBoard.getGameboard());
           var x = Math.floor(Math.random() * ((availableSpots.length - 1) - 0 + 1)) + 0;
           var row = availableSpots[x][0] * 1;
           var column = availableSpots[x][1] * 1;
           return [row, column];
       }
    */

    if (type == 'computer') {
        var AI = AIer();
    }

    return Object.assign(
        player,
        AI
    )

};

const AIer = function () {

    const minimax = function (board, depth, isMaximizingPlayer, currentPlayer, originalPlayer) {
        if (gameBoard.evaluateGameboard(board, originalPlayer.mark)[0]) {


            if (gameBoard.evaluateGameboard(board, originalPlayer.mark)[1] == 10) {
                return gameBoard.evaluateGameboard(board, originalPlayer.mark)[1] - depth;
            }

            if (gameBoard.evaluateGameboard(board, originalPlayer.mark)[1] == -10) {
                return gameBoard.evaluateGameboard(board, originalPlayer.mark)[1] + depth;
            }


            return gameBoard.evaluateGameboard(board, originalPlayer.mark)[1];

        }

        if (isMaximizingPlayer) {
            var bestVal = -Infinity;
            var potentionalMoves = gameBoard.getAvailableSpots(board);
            for (var i = 0; i < potentionalMoves.length; i++) {
                var boardCopy = gameBoard.makeBoardCopy(board);
                gameBoard.setGameboard(boardCopy, potentionalMoves[i][0], potentionalMoves[i][1], currentPlayer.mark);
                var value = minimax(boardCopy, depth + 1, false, gameController.setNextPlayer(currentPlayer), originalPlayer);
                bestVal = Math.max(bestVal, value);
            }
            return bestVal;
        } else {
            var bestVal = +Infinity;
            var potentionalMoves = gameBoard.getAvailableSpots(board);
            for (var i = 0; i < potentionalMoves.length; i++) {
                var boardCopy = gameBoard.makeBoardCopy(board);
                gameBoard.setGameboard(boardCopy, potentionalMoves[i][0], potentionalMoves[i][1], currentPlayer.mark);
                var value = minimax(boardCopy, depth + 1, true, gameController.setNextPlayer(currentPlayer), originalPlayer);
                bestVal = Math.min(bestVal, value);

            }
            return bestVal;
        }
    }
    const findOptimalMove = function (board, player) {
        var index = 0;
        var bestMove = -Infinity;
        var potentionalMoves = gameBoard.getAvailableSpots(board);
        for (var i = 0; i < potentionalMoves.length; i++) {
            var boardCopy = gameBoard.makeBoardCopy(board);
            gameBoard.setGameboard(boardCopy, potentionalMoves[i][0], potentionalMoves[i][1], player.mark)
            var currentMove = minimax(boardCopy, 0, false, gameController.setNextPlayer(player), player)
            if (currentMove > bestMove) {
                bestMove = currentMove;
                index = i;
            }

        }
        return potentionalMoves[index];
    }

    return {
        findOptimalMove,
    }
}

const gameBoard = (function () {

    const createBoard = function (rowNum, colNum) {
        var board = [];
        for (var i = 0; i < rowNum; i++) {
            var row = [];
            for (var j = 0; j < colNum; j++) {
                row.push('');
            }
            board.push(row);
        }
        return board;
    };

    const getAvailableSpots = function (board) {
        var availableSpots = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] == "") {
                    availableSpots.push(`${i}${j}`);
                }
            }
        }
        return availableSpots;
    };

    const createHTMLboard = function (board) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                var square = document.createElement('div');
                square.setAttribute('id', `${i}${j}`);
                square.setAttribute('class', `square`);
                playingBoard.appendChild(square);
                square.addEventListener('click', squareClick);
            }
        }
    };

    const renderGameboard = function (board) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                var square = document.getElementById(`${i}${j}`);
                square.textContent = board[i][j];
            }
        }
    };

    const removeOrAddSquareClickEvent = function (board, string) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                var square = document.getElementById(`${i}${j}`);
                if (string == 'add') {
                    square.addEventListener('click', squareClick);
                }
                if (string == 'remove') {
                    square.removeEventListener('click', squareClick);
                }

            }
        }
    };

    const setGameboard = function (board, row, column, value) {
        board[row][column] = value;
    };

    const getGameboard = function () {
        return gameboard;
    };

    const assignGameboard = function (board) {
        gameboard = board
    };

    const squareClick = function (obj) {

        var row = obj.target.id[0] * 1;
        var column = obj.target.id[1] * 1;
        if (gameboard[row][column] == '') {
            setGameboard(gameboard, row, column, gameController.getCurrentPlayer().mark);


            renderGameboard(gameboard);
            gameController.evaluateGame();
            if (!gameController.getGameOver()) {
                gameController.setDisplayText(`${gameController.getCurrentPlayer().name}'s turn`);
                if (gameController.getCurrentPlayer().type == 'computer') {
                    gameController.computerTurn();
                }
            }
        }

    };

    const makeBoardCopy = function (board) {
        var boardCopy = [];
        for (var i = 0; i < board.length; i++) {
            boardCopy[i] = board[i].slice();
        }
        return boardCopy;
    }

    const evaluateGameboard = function (board, mark) {

        loop1: for (var i = 0; i < board.length; i++) {
            loop2: for (var j = 0; j < board[i].length; j++) {

                if (board[i][j] != '') {
                    if (board[i - 1] == undefined || board[i + 1] == undefined) {
                        if ((board[i][j] == board[i][j - 1]) &&
                            (board[i][j] == board[i][j + 1])
                        ) {

                            if (board[i][j] == mark) {
                                return [true, 10];
                                break loop1;
                            } else return [true, -10];
                            break loop1;

                        }
                    } else {
                        if ((board[i][j] == board[i][j - 1]) &&
                            (board[i][j] == board[i][j + 1])
                        ) {

                            if (board[i][j] == mark) {
                                return [true, 10];
                                break loop1;
                            } else return [true, -10];
                            break loop1;
                        }

                        if ((board[i][j] == board[i - 1][j]) &&
                            (board[i][j] == board[i + 1][j])
                        ) {

                            if (board[i][j] == mark) {
                                return [true, 10];
                                break loop1;
                            } else return [true, -10];
                            break loop1;
                        }

                        if (((board[i][j] == board[i - 1][j - 1]) &&
                                (board[i][j] == board[i + 1][j + 1])) ||
                            ((board[i][j] == board[i - 1][j + 1]) &&
                                (board[i][j] == board[i + 1][j - 1]))
                        ) {

                            if (board[i][j] == mark) {
                                return [true, 10];
                                break loop1;
                            } else return [true, -10];
                            break loop1;
                        }

                    }


                }





            }

        }

        if (getAvailableSpots(board).length == 0) {

            return [true, 0];
        }




        return [false];
    }

    var gameboard = createBoard(3, 3);
    var playingBoard = document.getElementById('playingBoard');
    createHTMLboard(gameboard);

    return {
        getAvailableSpots,
        getGameboard,
        setGameboard,
        createBoard,
        renderGameboard,
        removeOrAddSquareClickEvent,
        playingBoard,
        evaluateGameboard,
        assignGameboard,
        makeBoardCopy,
    }

})();


const gameController = (function () {

    const playAgain = function () {
        gameOver = false;
        gameBoard.assignGameboard(gameBoard.createBoard(3, 3));
        gameBoard.renderGameboard(gameBoard.getGameboard());
        gameBoard.removeOrAddSquareClickEvent(gameBoard.getGameboard(), 'add');
        currentPlayer = players[0];
        setDisplayText(`${currentPlayer.name}'s turn`);
        if (currentPlayer.type == 'computer') {
            computerTurn();
        }

    }

    const resetGame = function () {
        gameOver = false;
        playersFormContainer.style.display = 'flex';
        gameBoard.playingBoard.style.display = 'none';
        gameBoard.assignGameboard(gameBoard.createBoard(3, 3));
        gameBoard.renderGameboard(gameBoard.getGameboard());
        clearForm();
        players = [];
        setDisplayText('');
        gameBoard.removeOrAddSquareClickEvent(gameBoard.getGameboard(), 'add');
        gameButtons.style.display = 'none';




    }

    const clearForm = function () {
        document.getElementById('firstPlayerName').value = "";
        //document.querySelector('input[name="firstPlayerType"]:checked').checked = false;

        document.getElementById('secondPlayerName').value = "";
        //document.querySelector('input[name="secondPlayerType"]:checked').checked = false;
    }

    const createPlayers = function () {
        var firstPlayerName = checkInput(document.getElementById('firstPlayerName').value, 'Player 1');
        var firstPlayerType = document.querySelector('input[name="firstPlayerType"]:checked').value;
        var firstPlayer = playerFactory(firstPlayerName, firstPlayerType, 'x');
        players.push(firstPlayer);

        var secondPlayerName = checkInput(document.getElementById('secondPlayerName').value, 'Player 2');
        var secondPlayerType = document.querySelector('input[name="secondPlayerType"]:checked').value;
        var secondPlayer = playerFactory(secondPlayerName, secondPlayerType, 'o');
        players.push(secondPlayer);


        currentPlayer = players[0];

        gameBoard.playingBoard.style.display = 'grid';
        playersFormContainer.style.display = 'none';
        setDisplayText(`${currentPlayer.name}'s turn`);
        gameButtons.style.display = 'inline';

        if (currentPlayer.type == 'computer') {
            computerTurn();
        }
    }

    const checkInput = function (input, defaultValue) {
        if (input == "") {
            return defaultValue;
        } else return input
    }





    const computerTurn = function () {



        while (true) {
            var availableSpots = gameBoard.getAvailableSpots(gameBoard.getGameboard());
            if (availableSpots.length == 0) {
                break;
            }
            computerPlay();
            gameBoard.renderGameboard(gameBoard.getGameboard());
            evaluateGame();
            if (gameOver) {
                break;
            }

            setDisplayText(`${currentPlayer.name}'s turn`);

            if (currentPlayer.type == 'human') {
                break;
            }

        }
    }
    const evaluateGame = function () {
        var result = gameBoard.evaluateGameboard(gameBoard.getGameboard(), currentPlayer.mark)
        if (result[0] == true) {
            if (result[1] == 10) {
                setDisplayText(`${currentPlayer.name} won!`);



            }

            if (result[1] == 0) {
                setDisplayText(`It's a tie!`);

            }
            gameOver = true;
            gameBoard.removeOrAddSquareClickEvent(gameBoard.getGameboard(), 'remove');
        } else {
            gameOver = false;
            currentPlayer = setNextPlayer(currentPlayer);
        }
    }



    const setNextPlayer = function (player) {
        var index = players.indexOf(player);

        if (index == players.length - 1) {
            return players[0];
        } else {
            return players[index + 1];
        }
    }

    const setDisplayText = function (message) {
        display.textContent = message;
    }

    const getCurrentPlayer = function () {
        return currentPlayer;
    }

    const getGameOver = function () {
        return gameOver;
    }

    const setGameOver = function (value) {
        gameOver = value;
    }

    const computerPlay = function () {
        //var boardMove = currentPlayer.computerMove();
        var boardMove = currentPlayer.findOptimalMove(gameBoard.getGameboard(), currentPlayer);
        gameBoard.setGameboard(gameBoard.getGameboard(), boardMove[0], boardMove[1], currentPlayer.mark);
    }

    var gameOver = false;
    var currentPlayer;
    var players = [];
    var display = document.getElementById('display');
    var playersFormContainer = document.getElementById('playersFormContainer');
    var gameButtons = document.getElementById('gameButtons');
    var startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', createPlayers);
    var playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click', playAgain);
    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);

    return {
        getCurrentPlayer,
        getGameOver,
        setGameOver,
        setDisplayText,
        evaluateGame,
        computerTurn,
        setNextPlayer,
    }
})();