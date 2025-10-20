"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [videoId, setVideoId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId.trim()) return alert("Please enter a valid video ID");
    router.push(`/dashboard?videoId=${videoId.trim()}`);
  };

  return (
    <div className="p-10 flex flex-col items-center">
      {!session ? (
        <button
          onClick={() =>
            signIn("google", { callbackUrl: "/" })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="w-full max-w-md">
          <p className="mb-4 text-lg font-semibold">
            Welcome, {session.user?.name}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 border p-4 rounded-lg shadow-sm"
          >
            <label className="text-sm font-medium">Enter YouTube Video ID:</label>
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="e.g. dQw4w9WgXcQ"
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </form>

          <button
            onClick={() => signOut()}
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
