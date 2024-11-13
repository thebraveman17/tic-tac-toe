'use client';
import TransactionWrapper from 'src/components/TransactionWrapper';
import WalletWrapper from 'src/components/WalletWrapper';
import { useAccount } from 'wagmi';
import CreateNewGame from 'src/components/CreateNewGame';
import JoinGame from 'src/components/JoinGame';

export default function Page() {
  const { address } = useAccount();

  return (
    <div className="flex flex-grow h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="flex w-full h-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
        {address ? (
          <div className="flex flex-col max-w-full gap-4">
            <CreateNewGame />
            <JoinGame />
          </div>
          
        ) : (
          <WalletWrapper
            className="w-[450px] max-w-full"
            text="Sign in to transact"
          />
        )}
      </section>
    </div>
  );
}
