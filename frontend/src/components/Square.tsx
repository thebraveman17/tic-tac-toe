'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMakeMoveConfig } from 'src/contracts';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TicTacToeABI, TicTacToeContractAddress } from 'src/constants';

export default function Square({
  gameId,
  position, 
  value,
  yourTurn,
  setTxIsPending,
  setTxStatus
}: { 
  gameId: string,
  position: number, 
  value: string | undefined,
  yourTurn: boolean,
  setTxIsPending: (value: boolean) => void,
  setTxStatus: (value: string) => void
}) {
  const router = useRouter();
  const makeMoveConfig = getMakeMoveConfig(BigInt(gameId), position);
  const { 
    data: hash,
    writeContract,
    isPending
  } = useWriteContract();

  const submit = () => {
    if (!value && yourTurn === true) {
      writeContract({
        address: TicTacToeContractAddress,
        abi: TicTacToeABI,
        functionName: 'makeMove',
        args: [BigInt(gameId), position],
      })
    }
  }

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  useEffect(() => {
    if (isPending) {
      setTxIsPending(true);
    } else {
      setTxIsPending(false);
    }

    if (isLoading) {
      setTxStatus('Waiting for confirmation...');
    }

    if (isSuccess) {
      setTxStatus('Transaction successful');
    }
  }, [isPending, isLoading, isSuccess]);

  return (
    <div className="flex flex-grow min-w-[80px]">
      <button
        className="bg-white border border-gray-400 text-4xl sm:text-5xl lg:text-6xl font-bold aspect-square min-w-[90px] sm:min-w-[100px] lg:min-w-[120px] text-center rounded-2xl shadow-md"
        onClick={submit}
      >
        {value}
      </button>
    </div>
  );
}

