'use client';
import { useState, useEffect } from 'react';
import { Game } from 'src/interfaces';
import { useAccount, useReadContract } from 'wagmi';
import WalletWrapper from 'src/components/WalletWrapper';
import { TicTacToeABI, TicTacToeContractAddress } from 'src/constants';
import Board from 'src/components/Board';

export default function GamePage({ params: { gameId }}: { params: {gameId: string}}) {
  const [Game, setGame] = useState<Game | null>(null);
  const { address } = useAccount();

  return (
    <div className="flex flex-grow h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="templateSection h-full flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-1 py-2 md:grow">
        {address ? (
          <div>
            <Board gameId={gameId} address={address}/>
          </div>
        ) : (
          <WalletWrapper
            className="w-[450px] max-w-full"
            text="Sign in to play"
          />
        )}
      </section>
    </div>
  );
}