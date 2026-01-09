'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CreateCareerPathPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [pathName, setPathName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
      useEffect(() => {
          // if user is not signed in, redirect to sign-in page
          if (!isLoaded) return;  
          if (!isSignedIn) {
              router.push('/sign-in');
          }
      }, [isSignedIn, isLoaded, router]);

    const handleCreate = async () => {
        const token = await getToken();

        console.log({
        pathName,
        description,
        imageUrl,
        });

        // Here you would typically send the data to your backend API
        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/career-paths`, {
            title: pathName,
            description: description,
            image_url: imageUrl,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            console.log('Career path created:', response.data);
            toast.success('Career path created!', {
                style: {
                    background: '#052e16', // dark green
                    border: '1px solid #22c55e',
                    color: '#dcfce7',
                },
            });


            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1000);
        })
        .catch(error => {
            console.error('Error creating career path:', error);
            toast.error(
            error?.response?.data?.message || 'Failed to create career path',
            {
                style: {
                    background: '#450a0a', // deep dark red (maroon)
                    border: '1px solid #ef4444', // bright red border for "danger" feel
                    color: '#fee2e2', // very light pink/white for high legibility
                },
            }
            );

        }); 
    };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-2">
        Create New Career Path
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 mb-8">
        Define the journey you want to track and master.
      </p>

      {/* Form */}
      <div className="space-y-6">
        {/* Path Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Path Name
          </label>
          <input
            type="text"
            value={pathName}
            onChange={(e) => setPathName(e.target.value)}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="e.g. Cybersecurity Analyst"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={250}
            rows={4}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Describe what this career path is about..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/250 characters
          </p>
        </div>

        {/* Image URL + Preview */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image URL Input */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">
              Image Cover URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Preview */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">
              Preview
            </label>
            <div className="w-full h-40 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  Image preview
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleCreate}
            className="px-6 py-2 rounded-lg bg-amber-400 text-black font-medium hover:bg-amber-300 transition"
          >
            Create Path
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
