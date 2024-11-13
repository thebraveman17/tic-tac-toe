import type { Address } from 'viem';

export const BASE_MAINNET_CHAIN_ID = 8453;
export const TicTacToeContractAddress: Address = '0x5084951aca1844FF69bC4110DB32c95F9CDAD05B';
export const TicTacToeABI = [
  {
    "type": "function",
    "name": "createNewGame",
    "inputs": [
      { "name": "playerTwo", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getGame",
    "inputs": [
      { "name": "gameId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct TicTacToe.Game",
        "components": [
          { "name": "board", "type": "uint8[9]", "internalType": "uint8[9]" },
          { "name": "player1", "type": "address", "internalType": "address" },
          { "name": "player2", "type": "address", "internalType": "address" },
          { "name": "turn", "type": "uint8", "internalType": "uint8" },
          {
            "name": "winner",
            "type": "uint8",
            "internalType": "enum TicTacToe.Winner"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNumberOfGames",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "makeMove",
    "inputs": [
      { "name": "gameId", "type": "uint256", "internalType": "uint256" },
      { "name": "position", "type": "uint8", "internalType": "uint8" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "GameCreated",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "playerOne",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "PlayerTwo",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GameFinished",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum TicTacToe.Winner"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PlayerMadeMove",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "position",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "value",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "turn",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  { "type": "error", "name": "GameAlreadyFinished", "inputs": [] },
  { "type": "error", "name": "GameDoesNotExist", "inputs": [] },
  { "type": "error", "name": "NotYourGame", "inputs": [] },
  { "type": "error", "name": "NotYourTurn", "inputs": [] },
  { "type": "error", "name": "PositionAlreadyTaken", "inputs": [] }
] as const;