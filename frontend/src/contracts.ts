import type { ContractFunctionParameters } from 'viem';
import type { Address } from 'viem';

import {
    TicTacToeContractAddress,
    TicTacToeABI
  } from './constants';

export const getCreateNewGameConfig = (address: Address | null) =>[
{
    address: TicTacToeContractAddress,
    abi: TicTacToeABI,
    functionName: 'createNewGame',
    args: [address],
}] as unknown as ContractFunctionParameters[];

export const getMakeMoveConfig = (gameId: BigInt, position: number) => [
{
    address: TicTacToeContractAddress,
    abi: TicTacToeABI,
    functionName: 'makeMove',
    args: [gameId, position],
}] as unknown as ContractFunctionParameters[];