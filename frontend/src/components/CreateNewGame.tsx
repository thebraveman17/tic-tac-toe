'use client';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import { BASE_MAINNET_CHAIN_ID } from '../constants';
import { getCreateNewGameConfig } from 'src/contracts';
import Modal from './Modal';

export default function CreateNewGame() {
  const [secondPlayerAddress, setSecondPlayerAddress] = useState<Address | null>(null);
  const router = useRouter();
  const createNewGameConfig = getCreateNewGameConfig(secondPlayerAddress);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('Invalid address. Please enter a valid address.');

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);

    const hexGameId = response.transactionReceipts[0].logs[0].data;
    const gameId = parseInt(hexGameId, 16);

    if (gameId !== null && gameId !== undefined) {
      const gameLink = `${window.location.origin}/game/${gameId}`;
      router.push(gameLink);
    } else {
      console.error('Failed to get the gameId');
    }
  };

  function checkAndSetSecondPlayerAddress(address: string) {
    if (isAddress(address)) {
      setSecondPlayerAddress(address);
    } else {
      setIsModalOpen(true);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col max-w-full w-[450px] gap-4">
      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto p-4 pb-2 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          placeholder="Player 2 Address"
          className="w-full p-2 border border-gray-300 rounded-md text-center"
          value={secondPlayerAddress || ''}
          onChange={(e) => checkAndSetSecondPlayerAddress(e.target.value as Address)}
        />
        <Transaction
          contracts={createNewGameConfig}
          className="w-full"
          chainId={BASE_MAINNET_CHAIN_ID}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton
            className="mt-0 mx-auto w-full max-w-full text-[white] bg-blue-600 p-2 rounded-md"
            text="Create new game"
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      </div>
      <Modal show={isModalOpen} message={'Invalid address!'} closeModal={closeModal}>
        <h2 className="text-md px-12 py-4 rounded-md">{modalMessage}</h2>
      </Modal>
    </div>
  );
}
