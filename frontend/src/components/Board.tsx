'use client';
import { Game } from 'src/interfaces';
import { useState, useEffect } from 'react';
import Square from './Square';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { BASE_MAINNET_CHAIN_ID, TicTacToeContractAddress, TicTacToeABI} from 'src/constants';
import { config } from 'src/config';
import Modal from 'src/components/Modal';

export default function Board({ gameId, address}: { gameId: string, address: string}) {
  const [game, setGame] = useState<Game | null>(null);
  const gameIdBigInt = BigInt(parseInt(gameId, 16));
  const [txIsPending, setTxIsPending] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [nextPlayerAddress, setNextPlayerAddress] = useState<string | undefined>('');
  const [isWinnerTextModalOpen, setIsWinnerTextModalOpen] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const [notYourGame, setNotYourGame] = useState(false);

  const { data } = useReadContract({
    address: TicTacToeContractAddress,
    abi: TicTacToeABI,
    functionName: 'getGame',
    args: [gameIdBigInt],
  })

  useEffect(() => {
    if (data) {
      const formattedData: Game = {
        board: (data as any).board.map((num: any) => convertToXO(num)),
        player1: (data as any).player1,
        player2: (data as any).player2,
        turn: (data as any).turn,
        winner: convertWinnerToString((data as any).winner, (data as any).player1, (data as any).player2),
      }
      if (formattedData.player1 !== address && formattedData.player2 !== address) {
        setNotYourGame(true);
      }
      setGame(formattedData);
      setNextPlayerAddress(() => {
         return formattedData?.turn === 1 ? formattedData?.player1 : formattedData?.player2;
      });
    }
  }, [data]);

  useEffect(() => {
    if (txStatus === 'Transaction successful') {
      const timer = setTimeout(() => setTxStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [txStatus]);

  function convertToXO(num: number) {
    if (num === 0) {
      return '';
    } else if (num === 1) {
      return 'X';
    } else if (num === 2) {
      return 'O';
    }  
  }

  function convertWinnerToString(winner: number, player1: string, player2: string) {
    if (winner === 0) {
      return '';
    } else if (winner === 1 || winner === 2) {
      return address === getWinnerAddress(winner, player1, player2) ? 'You won!' : 'You lost. :(';
    } else if (winner === 3) {
      return 'Draw';
    }
  }

  function getWinnerAddress(winner: number, player1: string, player2: string) {
    return winner == 1 ? player1 : player2;
  }

  useWatchContractEvent({
    address: TicTacToeContractAddress,
    abi: TicTacToeABI,
    config,
    chainId: BASE_MAINNET_CHAIN_ID,
    args: {
      gameId: gameIdBigInt
    },
    eventName: 'PlayerMadeMove',
    onLogs(logs) {
      const logData = logs[0].data;
      const positionHex = logData.slice(2, 66);
      const position = parseInt(positionHex, 16);
      const valueHex = logData.slice(66, 130);
      const value = parseInt(valueHex, 16).toString(10);
      const turn = logData.slice(130, 194);
      const turnInt = parseInt(turn, 16);

      setGame((prevGame) => {
        if (!prevGame) return prevGame;

        const newBoard = [...prevGame.board];
        newBoard[position] = value === '1' ? 'X' : 'O';
        setNextPlayerAddress(() => {
          return turnInt === 1 ? game?.player1 : game?.player2;
        });
        return {
          ...prevGame,
          board: newBoard,
          turn: turnInt
        };
      });
    },
  })

  useWatchContractEvent({
    address: TicTacToeContractAddress,
    abi: TicTacToeABI,
    config,
    chainId: BASE_MAINNET_CHAIN_ID,
    args: {
      gameId: gameIdBigInt
    },
    eventName: 'GameFinished',
    onLogs(logs) {
      const winnerID = logs[0].data;
      const winnerIDInt = parseInt(winnerID, 16);
      const newWinnerText = convertWinnerToString(winnerIDInt, (data as any).player1, (data as any).player2);
      setWinnerText(newWinnerText ?? '');
      setIsWinnerTextModalOpen(true);

      setGame((prevGame) => {
        if (!prevGame) return prevGame;

        setNextPlayerAddress('');
        return {
          ...prevGame,
          winner: newWinnerText,
          turn: 0
        };
      });
    },
  })

  const closeIsWinnerTextModal = () => {
    setIsWinnerTextModalOpen(false);
  }
  
  return (
    
    <div>
      {notYourGame &&
        <h1 className="text-md px-12 py-4 rounded-md">Not your game!</h1>
      }
      {!notYourGame && 
      <div className="flex flex-col items-center">
      <Modal show={isWinnerTextModalOpen} closeModal={closeIsWinnerTextModal} message={''}>
        <h1 className="text-md px-12 py-4 rounded-md">{winnerText}</h1>
      </Modal>
      {game?.winner && <div>{game?.winner}</div>}
      {
        !game?.winner &&
        <div>
          Turn: {nextPlayerAddress === address ? 'You' : 'Opponent'}
        </div>
      }
      
      <div className="flex flex-col flex-grow">
      {Array.from({ length: 3 }, (_, rowIndex) => (
        <div className="grid grid-cols-3 gap-x-1 gap-y-1 sm:gap-x-2 sm:gap-y-1 lg:gap-x-2 lg:gap-y-3 w-full max-w-xs sm:max-w-md lg:max-w-lg mt-2" key={rowIndex}>
          {game?.board.slice(rowIndex * 3, rowIndex * 3 + 3).map((value, colIndex) => (
            <Square
              key={rowIndex * 3 + colIndex}
              gameId={gameId}
              position={rowIndex * 3 + colIndex}
              value={value}
              setTxIsPending={setTxIsPending}
              setTxStatus={setTxStatus}
              yourTurn={nextPlayerAddress === address}
            />
          ))}
        </div>
      ))}
   
      </div>
        {txIsPending && <div>Pending approval...</div>}
        {txStatus && <div>{txStatus}</div>}
      </div>}
    </div>
  )
}