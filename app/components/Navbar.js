'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faBars,
  faXmark,
  faChartLine,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';

export default function Navbar() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-800 bg-[#141414] relative">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT: Logo */}
        <div
          onClick={() => router.push('/')}
          className="flex font-bold items-center gap-3 cursor-pointer"
        >
          <FontAwesomeIcon
            icon={faBookOpen}
            className="text-amber-400 text-xl"
          />
          <span className="text-lg tracking-wide text-gray-200">
            Giveth<span className="text-amber-400">Notes</span>
          </span>
        </div>

        {/* RIGHT */}
        {!isSignedIn ? (
          <button
            onClick={() => router.push('/sign-up')}
            className="px-5 py-2 rounded-lg text-sm bg-amber-400 text-black font-medium hover:opacity-90 transition"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-300 text-xl hover:text-amber-400 transition"
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} />
          </button>
        )}
      </div>

      {/* DROPDOWN MENU (Signed In Only) */}
      {isSignedIn && open && (
        <div className="absolute right-6 top-16 w-52 bg-[#141414] border border-gray-800 rounded-xl shadow-xl z-50">
          <button
            onClick={() => {
              router.push('/dashboard');
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-gray-800 transition rounded-t-xl"
          >
            <FontAwesomeIcon icon={faChartLine} />
            Dashboard
          </button>

          {/* Future routes go here */}
          {/* <button>Settings</button> */}

          <div className="border-t border-gray-800">
            <SignOutButton redirectUrl="/">
              <button className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-gray-800 transition rounded-b-xl">
                <FontAwesomeIcon icon={faRightFromBracket} />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </nav>
  );
}
