'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faBrain,
  faShieldAlt,
  faClock,
  faDiagramProject,
  faWandMagicSparkles,
  faMapSigns,
  faPenNib,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import DailyQuote from './components/DailyQuote';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  function toSignUp()
  {
    router.push('/sign-up');
  }
  function toSignIn()
  {
    router.push('/sign-in');
  }

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchProtected = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/protected`, {
          withCredentials: true, // ✅ Include cookies for Clerk auth
        });
        console.log('Protected data:', res.data);
        setUserData(res.data.user);
      } catch (err) {
        console.error('Failed to fetch protected data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtected();
    if (userData === null) {
      console.log("User data is null");
      return
    } 
  }, [isSignedIn]);
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            I don't just learn.
            <br />
            <span className="text-amber-400 ">
              I document mastery.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-400">
            A private learning system built by a developer who takes growth seriously.
          </p>

          <div className="mt-10 flex gap-4 justify-center">
            {!isSignedIn ? (
              <>
                <button
                  onClick={() => toSignIn()}
                  className="px-6 py-3 rounded-lg bg-amber-400 text-black font-medium hover:opacity-90 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => toSignUp()}
                  className="px-6 py-3 rounded-lg border border-gray-600 hover:border-amber-400 transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-7 py-3 rounded-lg bg-amber-400 text-black font-medium hover:opacity-90 transition"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">
          
          {/* Text */}
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Learning, Organized Visually
            </h2>

            <p className="mt-4 text-gray-400 text-lg">
              A clear, distraction-free dashboard that shows your career paths,
              progress, and daily learning entries at a glance.
            </p>
          </div>

          {/* Image */}
          <div className="w-full max-w-6xl rounded-2xl overflow-hidden border border-gray-800 shadow-lg shadow-amber-400/70">
            <Image
              src="/dashboard.png"
              alt="GivethNotes Dashboard Preview"
              width={1600}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

        </div>
      </section>


      {/* Growth Section */}
      <section className="min-h-screen py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built For <span className="text-amber-400">Growth</span>
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-3xl mx-auto text-gray-400 text-lg">
            Everything you need to document your journey to mastery, without any distractions.
            A tool designed for the way Giveth Developer thinks.
          </p>

          {/* Cards */}
          <div className="mt-16 flex flex-wrap justify-center gap-6">

            {/* Card 1 */}
            <div className="w-full sm:w-70 p-6 border border-gray-800 rounded-xl text-left hover:border-amber-400 transition">
              <FontAwesomeIcon icon={faLayerGroup} className="text-amber-400 text-2xl" />
              <h3 className="mt-4 font-semibold text-lg">Block-Based Thinking</h3>
              <p className="mt-2 text-sm text-gray-400">
                Capture ideas the way your mind works — structured, modular, and intentional.
              </p>
            </div>

            {/* Card 2 */}
            <div className="w-full sm:w-70 p-6 border border-gray-800 rounded-xl text-left hover:border-amber-400 transition">
              <FontAwesomeIcon icon={faBrain} className="text-amber-400 text-2xl" />
              <h3 className="mt-4 font-semibold text-lg">Deep Understanding</h3>
              <p className="mt-2 text-sm text-gray-400">
                Go beyond notes. Break down concepts until they actually make sense.
              </p>
            </div>

            {/* Card 3 */}
            <div className="w-full sm:w-70 p-6 border border-gray-800 rounded-xl text-left hover:border-amber-400 transition">
              <FontAwesomeIcon icon={faShieldAlt} className="text-amber-400 text-2xl" />
              <h3 className="mt-4 font-semibold text-lg">Private by Design</h3>
              <p className="mt-2 text-sm text-gray-400">
                Your learning space is yours alone. No feeds. No noise. No distractions.
              </p>
            </div>

            {/* Card 4 */}
            <div className="w-full sm:w-70 p-6 border border-gray-800 rounded-xl text-left hover:border-amber-400 transition">
              <FontAwesomeIcon icon={faClock} className="text-amber-400 text-2xl" />
              <h3 className="mt-4 font-semibold text-lg">Daily Progress</h3>
              <p className="mt-2 text-sm text-gray-400">
                Track consistency over time and turn effort into visible growth.
              </p>
            </div>

            {/* Card 5 */}
            <div className="w-full sm:w-70 p-6 border border-gray-800 rounded-xl text-left hover:border-amber-400 transition">
              <FontAwesomeIcon icon={faDiagramProject} className="text-amber-400 text-2xl" />
              <h3 className="mt-4 font-semibold text-lg">Career-Focused Paths</h3>
              <p className="mt-2 text-sm text-gray-400">
                Organize knowledge around real goals — not random notes.
              </p>
            </div>

            {/* Card 6 */}
            <div className="w-full sm:w-70 p-6 border border-gray-800 rounded-xl text-left hover:border-amber-400 transition">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-amber-400 text-2xl" />
              <h3 className="mt-4 font-semibold text-lg">AI When You Need It</h3>
              <p className="mt-2 text-sm text-gray-400">
                Get explanations and clarity without breaking your learning flow.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Path to Mastery Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Path to <span className="text-amber-400">Mastery</span>
            </h2>

            <p className="mt-4 text-lg text-gray-400">
              Mastery is not accidental. It-s built through clarity, consistency, and reflection.
              GivethNotes gives you a system to turn learning into long-term skill.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-20 flex flex-wrap justify-center gap-10">

            {/* Step 1 */}
            <div className="w-full sm:w-65 text-center">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full border border-gray-700 text-amber-400">
                <FontAwesomeIcon icon={faMapSigns} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Choose a Direction</h3>
              <p className="mt-2 text-sm text-gray-400">
                Define a career path and commit to learning with purpose, not randomness.
              </p>
            </div>

            {/* Step 2 */}
            <div className="w-full sm:w-65 text-center">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full border border-gray-700 text-amber-400">
                <FontAwesomeIcon icon={faPenNib} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Document Daily</h3>
              <p className="mt-2 text-sm text-gray-400">
                Capture what you learn every day using structured, meaningful blocks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="w-full sm:w-65 text-center">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full border border-gray-700 text-amber-400">
                <FontAwesomeIcon icon={faLayerGroup} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Build Understanding</h3>
              <p className="mt-2 text-sm text-gray-400">
                Break concepts into layers until they become clear and reusable.
              </p>
            </div>

            {/* Step 4 */}
            <div className="w-full sm:w-65 text-center">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full border border-gray-700 text-amber-400">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Track Progress</h3>
              <p className="mt-2 text-sm text-gray-400">
                Watch consistency compound into confidence, skill, and mastery.
              </p>
            </div>

          </div>
        </div>
      </section>

      <DailyQuote />

    </main>
  );
}
