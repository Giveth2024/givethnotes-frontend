'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPencil, faExternalLink, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// URL-safe Base64 helpers for simple obfuscation
function decodeId(val) {
  if (!val) return val;
  try {
    const b64 = val.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
    const decoded = decodeURIComponent(escape(atob(padded)));
    return decoded;
  } catch (e) {
    return val;
  }
}

// URL-safe Base64 helpers for simple obfuscation
function encodeId(id) {
  try {
    const str = String(id);
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    return String(id);
  }
}

export default function CareerPathPage() {
  const router = useRouter();
  const { id: rawId } = useParams();
  const id = decodeId(rawId);
  const [entries] = useState([
    {
      id: 1,
      title: 'Learning CSS',
      description: 'Explored flexbox layout techniques and media queries for responsive design patterns.',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      isToday: true
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      description: 'Deep dive into ES6 classes, arrow functions, and async/await patterns for modern JavaScript.',
      date: 'Jan 8, 2026',
      isToday: false
    },
    {
      id: 3,
      title: 'Database Design',
      description: 'Studied relational database normalization and built queries for complex data retrieval.',
      date: 'Jan 7, 2026',
      isToday: false
    }
  ]);

  function editCareerPath(id) {
    const obfuscated = encodeId(id);
    router.push(`/career_paths/${obfuscated}/edit`);
  }
  
  function createCareerPathBlock(id) {
    const obfuscated = encodeId(id);
    router.push(`/career_paths/${obfuscated}/blocks/create`);
  }

  return (
    <main className="min-h-screen px-8 py-10">
      
      {/* Header Section with Image and Details */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
        {/* Left: Image */}
        <div className="shrink-0 w-full md:w-64 relative h-48 md:h-64">
          <Image
            src="https://i.pinimg.com/736x/26/86/1c/26861ce966c34c51445b5bcdd2a7d1ee.jpg"
            alt="Career Path"
            fill
            className="object-cover rounded-lg shadow-lg border border-amber-400/20"
          />
        </div>

        {/* Right: Title, Description, Started Date */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 min-w-0">
            <h1 className="flex-1 min-w-0 text-2xl md:text-4xl font-bold text-amber-400 truncate">
              Full Stack Development
            </h1>
            <span className="text-xs ml-0 md:ml-2 font-mono bg-[#141414] text-amber-400 px-2 py-1 rounded">
              ID: {id}
            </span>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed max-w-2xl text-center md:text-left text-sm md:text-base">
            Master the complete web development stack from frontend to backend. Learn modern frameworks, databases, and deployment strategies to build scalable applications.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm md:text-base">
            <FontAwesomeIcon icon={faCalendar} className="text-amber-400 w-4 md:w-5 h-4 md:h-5" />
            <span>Started on Jan 1, 2026</span>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <hr className="border-amber-400/30 mb-8" />

      {/* Stats and Action Buttons Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 bg-[#141414] p-4 md:p-6 rounded-lg border border-gray-700/50">
        {/* Left: Stats */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full md:w-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">15</div>
            <div className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Days Studied</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">42</div>
            <div className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Total Entries</div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
          <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base" onClick={() => createCareerPathBlock(id)}>
            + Add Today's Entry
          </button>
          <button className="border border-amber-400 hover:bg-amber-400/10 text-amber-400 px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 text-sm md:text-base" onClick={() => editCareerPath(id)}>
            <FontAwesomeIcon icon={faPencil} className="w-3 md:w-4 h-3 md:h-4" />
            Edit Career Path
          </button>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-100">Timeline</h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm md:text-base">Filter by:</span>
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 md:px-4 py-1 rounded text-xs md:text-sm font-medium transition-colors duration-200">
            Newest
          </button>
        </div>
      </div>

      {/* Timeline Cards */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div 
            key={entry.id}
            className={`w-full rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
              entry.isToday 
                ? 'bg-linear-to-r from-amber-400/10 to-amber-400/5 border-l-4 border-amber-400' 
                : 'bg-[#141414] border-l-4 border-[#141414]'
            }`}
          >
            <div className="flex justify-between">
              {/* Left Section (90% width) */}
              <div className="flex-1 pr-4">
                {entry.isToday && (
                  <div className="inline-block bg-amber-400 text-gray-900 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                    Today
                  </div>
                )}
                
                <div className="text-gray-400 text-sm mb-3">
                  {entry.date}
                </div>

                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  {entry.title}
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  {entry.description}
                </p>
              </div>

              {/* Right Section: Icons (vertical) */}
              <div className="flex flex-col gap-4 justify-center">
                <button className="bg-amber-400/20 hover:bg-amber-400/40 text-amber-400 p-2 rounded transition-colors duration-200" title="Open entry">
                  <FontAwesomeIcon icon={faExternalLink} className="w-5 h-5" />
                </button>
                <button className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded transition-colors duration-200" title="Delete entry">
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
