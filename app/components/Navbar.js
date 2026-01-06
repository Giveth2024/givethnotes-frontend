'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div className="flex font-bold items-center gap-3">
          <FontAwesomeIcon
            icon={faBookOpen}
            className="text-amber-400 text-xl"
          />
          <span className="text-lg  tracking-wide">
            Giveth<span className="text-amber-400">Notes</span>
          </span>
        </div>

        {/* RIGHT: Auth Buttons */}
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-lg text-sm bg-amber-400 text-black font-medium hover:opacity-90 transition">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}
