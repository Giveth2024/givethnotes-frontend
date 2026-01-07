'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus } from '@fortawesome/free-solid-svg-icons';

function timeAgo(mysqlDateTime) {
  // Force browser to treat it as local time
  const date = new Date(mysqlDateTime.replace(' ', 'T'));
  const now = new Date();

  const diffSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600)
    return `${Math.floor(diffSeconds / 60)} mins ago`;
  if (diffSeconds < 86400)
    return `${Math.floor(diffSeconds / 3600)} hrs ago`;

  return `${Math.floor(diffSeconds / 86400)} days ago`;
}


function daysSince(mysqlDate) {
  const date = new Date(mysqlDate.replace(' ', 'T'));
  const now = new Date();

  const days = Math.floor(
    (now.getTime() - date.getTime()) / 86400000
  );

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} Days`;
}


export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [paths, setPaths] = useState([]);
  const [activityMap, setActivityMap] = useState({});

  useEffect(() => {
    if (!isSignedIn) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/career-paths`)
      .then(async (res) => {
        setPaths(res.data);

        // Fetch last activity per career path
        const activityRequests = res.data.map((path) =>
          axios
            .get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/journal-entries?career_path_id=${path.id}`
            )
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
      });
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
                    hover:opacity-90 transition"
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
                ? `Active: ${timeAgo(activityMap[path.id])}`
                : 'No activity yet'}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
