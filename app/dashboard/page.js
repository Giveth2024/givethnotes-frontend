'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, RedirectToSignIn, useAuth } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

function daysSince(dateString) {
  const date = new Date(dateString); // ✅ let JS handle timezone
  const now = new Date();

  // Normalize both to local midnight
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const startOfNow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const days = Math.round(
    (startOfNow - startOfDate) / 86400000
  );

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} Days`;
}


function activityTime(dateString) {
  const now = new Date();

  // original time
  const date = new Date(dateString);

  // manually add +3 hours
  date.setHours(date.getHours() - 3);

  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600)
    return `${Math.floor(diffSeconds / 60)} mins ago`;
  if (diffSeconds < 86400)
    return `${Math.floor(diffSeconds / 3600)} hrs ago`;

  return `${Math.floor(diffSeconds / 86400)} days ago`;
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [paths, setPaths] = useState([]);
  const [activityMap, setActivityMap] = useState({});
  const { getToken } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (!isSignedIn) return;

  const fetchData = async () => {
    const token = await getToken();

    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await api.get("/api/career-paths");
    setPaths(res.data);

    const activityRequests = res.data.map((path) =>
      api
        .get(`/api/journal-entries?career_path_id=${path.id}`)
        .then((r) => ({
          id: path.id,
          lastUpdated: r.data?.[0]?.updated_at || null,
        }))
    );

    const results = await Promise.all(activityRequests);
    const map = {};
    results.forEach((r) => {
      map[r.id] = r.lastUpdated;
    });

    setActivityMap(map);
  };

  fetchData();
}, [isSignedIn]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <main className="min-h-screen px-8 py-10">
      {/* Top Section */}
      <div className="flex flex-col gap-6 mb-10 
                      sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
            My Career Paths
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your learning journeys and track your progress
          </p>
        </div>

        <button
          className="flex items-center justify-center gap-2
                    w-full sm:w-auto
                    px-5 py-3
                    bg-amber-400 text-black
                    rounded-lg font-medium
                    hover:opacity-90 active:bg-amber-600 transition"
          onClick={() => router.push('/career_paths/create')}
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Career Path
        </button>
      </div>


      {/* Cards Section */}
      <div className="flex flex-wrap gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            className="w-full md:w-[48%] lg:w-[31%] bg-[#141414] border border-gray-800 rounded-xl overflow-hidden hover:border-amber-400 transition"
          >
            {/* Top */}
            <div className="relative">
              <img
                src={path.image_url}
                alt={path.title}
                className="h-60 w-full object-cover"
              />
              <span className="absolute top-3 right-3 text-xs bg-black/70 px-3 py-1 rounded-full text-amber-400">
                {daysSince(path.created_at)}
              </span>
            </div>

            {/* Middle */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-100">
                {path.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                {path.description}
              </p>
            </div>

            {/* Bottom */}
            <div className="px-5 pb-5 flex items-center gap-2 text-sm text-amber-200 opacity-80">
              <FontAwesomeIcon icon={faClock} />
                {activityMap[path.id]
                  ? `Active: ${activityTime(activityMap[path.id])}`
                  : 'No activity yet'}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
