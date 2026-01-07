'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateLeft,
  faBrain,
} from '@fortawesome/free-solid-svg-icons';

export default function SignInPage() {
  return (
<>
{/* Parent Container: min-h-screen with a column layout for mobile, 2-column for desktop */}
<div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 px-6 lg:px-16 items-center py-12 lg:py-0">

  {/* WELCOME SECTION (Top on mobile, Left on desktop) */}
  <div className="flex flex-col justify-center space-y-8 order-1 w-full lg:w-auto mb-12 lg:mb-0">
    <div className="space-y-4 text-center lg:text-left">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
        Welcome Back <span className="inline-block animate-bounce">👋</span>
      </h1>
      <p className="text-gray-400 max-w-md mx-auto lg:mx-0 text-lg leading-relaxed">
        Your ideas are still safe. Your blocks are still waiting.
        Continue building knowledge exactly where you left off.
      </p>
    </div>

    {/* Feature Cards: Stacks on mobile, side-by-side on small tablets up */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
      <div className="border border-gray-800 rounded-2xl p-6 bg-[#141414] hover:border-amber-400/50 transition-colors group">
        <FontAwesomeIcon
          icon={faArrowRotateLeft}
          className="text-amber-400 text-2xl mb-3 group-hover:rotate-45 transition-transform"
        />
        <h3 className="font-semibold text-white mb-1 text-base">Resume Instantly</h3>
        <p className="text-xs text-gray-400">
          Pick up from your last saved thought.
        </p>
      </div>

      <div className="border border-gray-800 rounded-2xl p-6 bg-[#141414] hover:border-amber-400/50 transition-colors group">
        <FontAwesomeIcon
          icon={faBrain}
          className="text-amber-400 text-2xl mb-3 group-hover:scale-110 transition-transform"
        />
        <h3 className="font-semibold text-white mb-1 text-base">Smarter Insights</h3>
        <p className="text-xs text-gray-400">
          Let AI help refine your learning.
        </p>
      </div>
    </div>
  </div>

  {/* SIGN-IN SECTION (Bottom on mobile, Right on desktop) */}
  <div className="flex items-center justify-center order-2 w-full">
    <div className="w-full max-w-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.05)]">
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#fbbf24',
            colorBackground: '#141414',
            colorText: '#e5e7eb',
            borderRadius: '0.75rem',
          },
          elements: {
            card: 'border border-gray-800 shadow-xl',
            formButtonPrimary: 'bg-amber-400 text-black hover:bg-amber-500 transition-all font-bold',
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
