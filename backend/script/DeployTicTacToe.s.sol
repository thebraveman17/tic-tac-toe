// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import {Script} from "forge-std/Script.sol";
import {TicTacToe} from "../src/TicTacToe.sol";

contract DeployTicTacToe is Script {
    function run() external returns (TicTacToe) {
        vm.startBroadcast();
        TicTacToe ticTacToe = new TicTacToe();
        vm.stopBroadcast();
        return ticTacToe;
    }
}
