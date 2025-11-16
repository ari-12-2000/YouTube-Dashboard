"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Video, LogOut, Play } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [videoId, setVideoId] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId.trim()) return alert("Please enter a valid video ID");
    router.push(`/dashboard?videoId=${videoId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6TTM0IDJ2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6TTIgNnYyaDJWNkgyek0yIDEwdjJoMnYtMkgyek0yIDE0djJoMnYtMkgyek0yIDE4djJoMnYtMkgyek0yIDIydjJoMnYtMkgyek0yIDI2djJoMnYtMkgyek0yIDMwdjJoMnYtMkgyek0yIDM0djJoMnYtMkgyek0yIDM4djJoMnYtMkgyek0yIDQydjJoMnYtMkgyek0yIDQ2djJoMnYtMkgyek0yIDUwdjJoMnYtMkgyek0yIDU0djJoMnYtMkgyek02IDJoMnYySDZWMnptMCA1Mmgydi0ySDZ2MnptNDggMGgydi0ySDZ2MnptMCA0aDJ2LTJoLTJ2MnptLTQ4IDRoMnYtMkg2djJ6bTQ4LTRoMnYtMmgtMnYyek02IDJoMnYySDZWMnptNTQgNTB2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Nmgydi02aC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">YouTube Manager</h1>
          <p className="text-slate-600">Manage your videos with ease</p>
        </div>

        {!session ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 backdrop-blur-sm animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to access your video dashboard</p>
            </div>
            <button
              onClick={() => signIn("google")}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {session.user?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Welcome back</p>
                  <p className="text-lg font-semibold text-slate-800">{session.user?.name}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    YouTube Video ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={videoId}
                      onChange={(e) => setVideoId(e.target.value)}
                      placeholder="e.g. dQw4w9WgXcQ"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-slate-50 hover:bg-white"
                    />
                    <Play className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-xs mt-2">Enter the video ID from your YouTube video URL</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" />
                  Open Dashboard
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
