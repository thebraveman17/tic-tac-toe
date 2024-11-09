// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {TicTacToe} from "../src/TicTacToe.sol";
import {DeployTicTacToe} from "../script/DeployTicTacToe.s.sol";

contract TicTacToeTest is Test {
    TicTacToe private s_ticTacToe;
    DeployTicTacToe private s_deployTicTacToe;
    address private constant PLAYER_ONE = 0x0000000000000000000000000000000000000001;
    address private constant PLAYER_TWO = 0x0000000000000000000000000000000000000002;
    address private constant PLAYER_THREE = 0x0000000000000000000000000000000000000003;
    uint8 private constant PLAYER_ONE_TURN = 1;

    modifier createdNewGame() {
        vm.prank(PLAYER_ONE);
        s_ticTacToe.createNewGame(PLAYER_TWO);
        _;
    }

    modifier startedPrankCreatedNewGameAndMadeMove() {
        vm.startPrank(PLAYER_ONE);
        s_ticTacToe.createNewGame(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 0);
        _;
    }

    function setUp() external {
        s_deployTicTacToe = new DeployTicTacToe();
        s_ticTacToe = s_deployTicTacToe.run();
    }

    function testCreateNewGameUpdatesStateVariableAndEmitsEvent() external {
        vm.prank(PLAYER_ONE);
        vm.expectEmit(true, true, false, true);
        emit TicTacToe.GameCreated(0, PLAYER_ONE, PLAYER_TWO);
        s_ticTacToe.createNewGame(PLAYER_TWO);
        TicTacToe.Game memory game = s_ticTacToe.getGame(0);
        assertEq(game.turn, PLAYER_ONE_TURN);
        assertEq(game.board[0], 0);

        _testGameStateUpdatesAreCorrect(game);
    }

    function testMakeMoveRevertsIfGameDoesNotExist() external {
        vm.expectRevert(TicTacToe.GameDoesNotExist.selector);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 0);
    }

    function testMakeMoveRevertsIfPlayerIsNotInGame() external createdNewGame {
        vm.prank(PLAYER_THREE);
        vm.expectRevert(TicTacToe.NotYourGame.selector);
        s_ticTacToe.makeMove(0, 0);
    }

    function testMakeMoveRevertsIfPlayerIsNotNextToPlay() external startedPrankCreatedNewGameAndMadeMove {
        vm.expectRevert(TicTacToe.NotYourTurn.selector);
        s_ticTacToe.makeMove(0, 1);
        vm.stopPrank();
    }

    function testMakeMoveRevertsIfPositionIsAlreadyTaken() external startedPrankCreatedNewGameAndMadeMove {
        vm.stopPrank();
        vm.prank(PLAYER_TWO);
        vm.expectRevert(TicTacToe.PositionAlreadyTaken.selector);
        s_ticTacToe.makeMove(0, 0);
    }

    function testMakeMoveRevertsIfGameIsFinished() external createdNewGame {
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 0);
        vm.prank(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 1);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 3);
        vm.prank(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 4);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 6);
        vm.prank(PLAYER_TWO);
        vm.expectRevert(TicTacToe.GameAlreadyFinished.selector);
        s_ticTacToe.makeMove(0, 7);
    }

    function testMakeMoveEmitsEventOfMoveAndUpdatesState() external {
        vm.startPrank(PLAYER_ONE);
        s_ticTacToe.createNewGame(PLAYER_TWO);
        vm.expectEmit(true, false, false, true);
        emit TicTacToe.PlayerMadeMove(0, PLAYER_ONE, 0, 1);
        s_ticTacToe.makeMove(0, 0);
        vm.stopPrank();
        TicTacToe.Game memory game = s_ticTacToe.getGame(0);
        assertEq(game.turn, 2);
        assertEq(game.board[0], 1);

        _testGameStateUpdatesAreCorrect(game);
    }

    function testGameOutcomeIsDrawWhenAllFieldsAreUsedWithoutWinner() external createdNewGame {
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 0);
        vm.prank(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 4);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 2);
        vm.prank(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 1);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 7);
        vm.prank(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 3);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 5);
        vm.prank(PLAYER_TWO);
        s_ticTacToe.makeMove(0, 8);
        vm.prank(PLAYER_ONE);
        s_ticTacToe.makeMove(0, 6);
    }

    function testGetGameRevertsIfGameDoesNotExist() external {
        vm.expectRevert(TicTacToe.GameDoesNotExist.selector);
        s_ticTacToe.getGame(0);
    }

    function _testGameStateUpdatesAreCorrect(TicTacToe.Game memory game) internal pure {
        assert(game.winner == TicTacToe.Winner.None);
        assertEq(game.player1, PLAYER_ONE);
        assertEq(game.player2, PLAYER_TWO);
        assertEq(game.board[1], 0);
        assertEq(game.board[2], 0);
        assertEq(game.board[3], 0);
        assertEq(game.board[4], 0);
        assertEq(game.board[5], 0);
        assertEq(game.board[6], 0);
        assertEq(game.board[7], 0);
        assertEq(game.board[8], 0);
    }
}
