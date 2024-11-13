'use client';

import Logo from '../svg/Logo';
import SignupButton from './SignupButton';
import LoginButton from './LoginButton';
import { useAccount } from 'wagmi';

export default function Header() {
  const { address } = useAccount();

  return (
    <section className="mt-4 mb-4 flex w-full flex-col md:flex-row">
      <div className="flex w-full flex-row items-center justify-between gap-2 px-1 md:gap-0">
        <a
          href={"/"}
          title="Home"
        >
          <Logo />
        </a>
        <div className="flex items-center gap-3">
          <SignupButton />
          {!address && <LoginButton />}
        </div>
      </div>
    </section>
  )
}