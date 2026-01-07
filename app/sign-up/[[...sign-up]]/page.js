'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

export default function SignUpPage() {
  return (
    <>
    {/* Added responsive padding (py-12) and a gap between stacked sections (gap-12) */}
<div className="min-h-screen py-12 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 bg-[#0f0f0f] text-gray-200 gap-12 items-center">

  {/* LEFT SECTION - Added mobile-first alignment */}
  <div className="flex flex-col justify-center gap-8 order-1">
    <div className="space-y-4 text-center lg:text-left">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
        Zero Data Loss,<br /> 
        <span className="text-amber-400">Total Privacy</span>
      </h1>

      <p className="text-gray-400 max-w-md mx-auto lg:mx-0 text-lg">
        A private, block-based learning journal powered by AI. 
        Capture insights without fear of losing your data.
      </p>
    </div>

    {/* Cards Section - Fixed centering on mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
      <div className="border border-gray-800 rounded-2xl p-5 bg-[#141414] hover:border-gray-700 transition">
        <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400 text-2xl mb-3" />
        <h3 className="font-semibold text-white mb-1">End-to-End Privacy</h3>
        <p className="text-sm text-gray-400">Your journal entries are private by design.</p>
      </div>

      <div className="border border-gray-800 rounded-2xl p-5 bg-[#141414] hover:border-gray-700 transition">
        <FontAwesomeIcon icon={faLayerGroup} className="text-amber-400 text-2xl mb-3" />
        <h3 className="font-semibold text-white mb-1">Block-Based Thinking</h3>
        <p className="text-sm text-gray-400">Organise learning in flexible, powerful blocks.</p>
      </div>
    </div>
  </div>

  {/* RIGHT SECTION - Added padding for mobile spacing */}
  <div className="flex items-center justify-center order-2 pb-10 lg:pb-0">
    <div className="w-full max-w-100"> {/* Container to keep Clerk from stretching */}
      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#fbbf24',
            colorBackground: '#141414',
            colorText: '#e5e7eb',
            borderRadius: '0.75rem',
          },
          elements: {
            card: 'border border-gray-800 shadow-2xl',
            formButtonPrimary: 'bg-amber-400 text-black hover:bg-amber-500 transition-all text-sm font-bold uppercase tracking-wider',
            footerActionLink: 'text-amber-400 hover:text-amber-300',
          },
        }}
      />
    </div>
  </div>
</div>
    </>
  );
}
