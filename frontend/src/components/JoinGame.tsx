'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import { useReadContract } from 'wagmi';
import { TicTacToeABI, TicTacToeContractAddress } from 'src/constants';

export default function JoinGame() {
  const [gameId, setGameId] = useState<number | ''>('');
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('Game doesn\'t exist!');

  const { data } = useReadContract({
    address: TicTacToeContractAddress,
    abi: TicTacToeABI,
    functionName: 'getNumberOfGames',
    args: [],
  })

  const handleJoinGame = () => {
    console.log(data);
    if (typeof gameId === 'number' && gameId >= 0 && gameId < Number(data)) {
      const gameLink = `${window.location.origin}/game/${gameId}`;
      router.push(gameLink);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col max-w-full w-[450px] gap-4">
      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
        <input
          type="number" 
          placeholder="Game ID"
          className="w-full p-2 border border-gray-300 rounded-md text-center"
          value={gameId}
          onChange={(e) => {
            const value = e.target.value;
            setGameId(value === '' ? '' : Number(value));
          }}
        />
        <button
          onClick={handleJoinGame}
          className="mt-0 mx-auto w-full max-w-full text-[white] bg-blue-600 p-2 rounded-md font-bold text-ock-foreground font-sans text-base leading-normal"
        >
          Join Game
        </button>
      </div>
      <Modal show={isModalOpen} message={modalMessage} closeModal={closeModal}>
        <h2 className="text-md px-12 py-4 rounded-md">{modalMessage}</h2>
      </Modal>
    </div>
  );
}
