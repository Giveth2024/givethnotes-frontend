'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, RedirectToSignIn, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';

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

export default function EditCareerPathPage() {
  const router = useRouter();
  const params = useParams();
  const id = decodeId(params.id);

  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [pathName, setPathName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // if user is not signed in, redirect to sign-in page
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
    }

    fetchCareerPath(decodeId(id));
  }, [isSignedIn, isLoaded, router]);

  // Placeholder: if you want to fetch existing career path data by `id`, add an effect here.

  const handleSave = async () => {
    // Print everything to console as requested
    // console.log({ id, pathName, description, imageUrl });

    // Example: if you later want to call your API, you could use getToken() and axios here.
    try{
        const token = await getToken();
        // Example API call to update career path data
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/career-paths/${id}`,  
            {
                title: pathName,
                description: description,
                image_url: imageUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        // console.log('Career path updated:', response.data);

        toast.success('Career path Updated Successfully!', {
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
    } catch (error) {
        console.error("Error updating career path:", error);
        toast.error(
            error?.response?.data?.message || `Failed to update career path with id:${decodeId(id)}`,
            {
                style: {
                    background: '#450a0a', // deep dark red (maroon)
                    border: '1px solid #ef4444', // bright red border for "danger" feel
                    color: '#fee2e2', // very light pink/white for high legibility
                },
            }
        );
    }
  };

  const handleDelete = () => {
    // Open styled confirmation prompt instead of using window.confirm
    setShowDeletePrompt(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await getToken();
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/career-paths/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show server message in toast
      toast.success(response?.data?.message || 'Career path deleted successfully', {
        style: {
          background: '#052e16',
          border: '1px solid #22c55e',
          color: '#dcfce7',
        },
      });

      // Close prompt and delay then redirect to dashboard
      setShowDeletePrompt(false);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error deleting career path:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to delete career path',
        {
          style: {
            background: '#450a0a',
            border: '1px solid #ef4444',
            color: '#fee2e2',
          },
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  async function fetchCareerPath(id) {
    try {

        const token = await getToken();
        // Example API call to fetch career path data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/career-paths/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = response.data;
        // console.log("Fetched career path data:", data);

        // Populate state with fetched data
        setPathName(data.title || '');
        setDescription(data.description || '');
        setImageUrl(data.image_url || '');

    }
    catch (error)
    {
        console.error("Error fetching career path:", error);
        toast.error(
            error?.response?.data?.message || `Failed to create career path with id:${decodeId(id)}`,
            {
                style: {
                    background: '#450a0a', // deep dark red (maroon)
                    border: '1px solid #ef4444', // bright red border for "danger" feel
                    color: '#fee2e2', // very light pink/white for high legibility
                },
            }
        );

    }

  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-2">Edit Career Path</h1>

      {/* Subtitle */}
      <p className="text-gray-400 mb-8">Editing Career Path ID: {id}</p>

      {/* Form */}
      <div className="space-y-6">
        {/* Path Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Path Name</label>
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
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={250}
            rows={4}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Describe what this career path is about..."
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/250 characters</p>
        </div>

        {/* Image URL + Preview */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image URL Input */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">Image Cover URL</label>
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
            <label className="block mb-2 text-sm font-medium">Preview</label>
            <div className="w-full h-40 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-sm">Image preview</span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-amber-400 text-black font-medium hover:bg-amber-300 transition"
          >
            Save Changes
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 border border-red-700 rounded-lg p-6 bg-zinc-900">
          <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
          <h4 className="mt-2 font-medium">Delete this Career Path</h4>
          <p className="text-sm text-gray-400 mt-1">Deleting this path will permanently remove the path and cascade delete all <span className='font-bold'>142 associated notes</span> and blocks. This action cannot be undone.</p>

          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="px-6 py-2 rounded-lg bg-red-700 text-white font-medium hover:bg-red-600 transition"
            >
              Delete this Career Path
            </button>
          </div>
        </div>

        {/* Confirm Delete Modal */}
        {showDeletePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeletePrompt(false)} />
            <div className="relative bg-zinc-900 p-6 rounded-lg w-full max-w-md z-10 border border-zinc-700">
              <h3 className="text-lg font-semibold text-red-400">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-400">This is your Last Line of Defense, Sergeant. Are you sure you want to delete this career path? This action cannot be undone.</p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeletePrompt(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-700 text-white"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
