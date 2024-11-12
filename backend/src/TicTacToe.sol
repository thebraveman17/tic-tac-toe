// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

/// @title TicTacToe
/// @author Uroš Ognjenović
/// @notice This contract implements the TicTacToe game
contract TicTacToe {
    enum Winner {
        None,
        Player1,
        Player2,
        Draw
    }

    struct Game {
        uint8[9] board;
        address player1;
        address player2;
        uint8 turn;
        Winner winner;
    }

    // Array of games
    Game[] private s_games;

    event GameCreated(uint256 gameId, address indexed playerOne, address indexed PlayerTwo);
    event PlayerMadeMove(uint256 indexed gameId, address indexed player, uint8 position, uint8 value, uint8 turn);
    event GameFinished(uint256 indexed gameId, Winner winner);

    error GameDoesNotExist();
    error GameAlreadyFinished();
    error NotYourTurn();
    error NotYourGame();
    error PositionAlreadyTaken();

    /// @notice Creates a new game between msg.sender and the desired address
    /// @param playerTwo The address of the second player
    function createNewGame(address playerTwo) external returns (uint256) {
        uint256 gameId = s_games.length;

        s_games.push(
            Game({
                board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                player1: msg.sender,
                player2: playerTwo,
                turn: 1,
                winner: Winner.None
            })
        );

        emit GameCreated(gameId, msg.sender, playerTwo);

        return gameId;
    }

    /// @param gameId The game id
    /// @param position The position on the board
    function makeMove(uint256 gameId, uint8 position) external {
        require(gameId < s_games.length, GameDoesNotExist());

        Game storage game = s_games[gameId];
        require(_isPlayerInGame(game, msg.sender), NotYourGame());
        require(game.winner == Winner.None, GameAlreadyFinished());
        address playerToPlay = _getPlayerToPlay(game);
        require(msg.sender == playerToPlay, NotYourTurn());
        require(game.board[position] == 0, PositionAlreadyTaken());
        uint8 value = game.turn;
        game.board[position] = value;

        Winner winner = _evaluateGameStatus(game.board);

        if (winner != Winner.None) {
            game.winner = winner;
            game.turn = 0;

            emit PlayerMadeMove(gameId, msg.sender, position, value, game.turn);
            emit GameFinished(gameId, winner);
        } else {
            game.turn = value == 1 ? 2 : 1;
            emit PlayerMadeMove(gameId, msg.sender, position, value, game.turn);
        }
    }

    /// @notice Returns the game with the given index
    /// @param gameId The game id
    function getGame(uint256 gameId) external view returns (Game memory) {
        require(gameId < s_games.length, GameDoesNotExist());

        return s_games[gameId];
    }

    /// @notice Returns the number of games
    function getNumberOfGames() external view returns (uint256) {
        return s_games.length;
    }

    /// @notice Returns the player to play for the given game
    /// @param game The game data
    function _getPlayerToPlay(Game memory game) internal pure returns (address) {
        if (game.turn == 1) {
            return game.player1;
        }

        return game.player2;
    }

    /// @notice Checks if the player is in the game
    /// @param game The game data
    /// @param sender The sender of the transaction
    function _isPlayerInGame(Game memory game, address sender) internal pure returns (bool) {
        return game.player1 == sender || game.player2 == sender;
    }

    /// @notice Evaluates the game status
    /// @param board The game board
    function _evaluateGameStatus(uint8[9] memory board) internal pure returns (Winner winner) {
        if (_checkForWinner(board) != Winner.None) {
            return _checkForWinner(board);
        }

        if (_isDraw(board)) {
            return Winner.Draw;
        }

        return Winner.None;
    }

    /// @notice Checks for a winner
    /// @param board The game board
    function _checkForWinner(uint8[9] memory board) internal pure returns (Winner winner) {
        // The lines of the board to check for winner
        uint8[3][8] memory lines =
            [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for (uint8 i; i < 8;) {
            (uint8 a, uint8 b, uint8 c) = (lines[i][0], lines[i][1], lines[i][2]);
            if (board[a] != 0 && board[a] == board[b] && board[a] == board[c]) {
                return board[a] == 1 ? Winner.Player1 : Winner.Player2;
            }

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Checks if the game is a draw
    /// @param board The game board
    function _isDraw(uint8[9] memory board) internal pure returns (bool isDraw) {
        for (uint8 i; i < 9;) {
            if (board[i] == 0) {
                return false;
            }

            unchecked {
                ++i;
            }
        }

        return true;
    }
}
