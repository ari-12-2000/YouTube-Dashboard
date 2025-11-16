'use client'

import VideoManager from '@/components/VideoManager.client'
import { useSession } from 'next-auth/react'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, ArrowLeft, Loader2 } from 'lucide-react'

function VideoDashboard() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get('videoId')
  const { data: session } = useSession()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    const loadVideo = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/youtube/${videoId}`)
        const data = await res.json()
        console.log(data);
        if (!res.ok) throw new Error(data.error)
        setVideo(data.video)
      } catch (err) {
        console.error('Error fetching video:', err)
      } finally {
        setLoading(false)
      }
    }
    loadVideo()
  }, [session, videoId])

  const formatNumber = (num: string | number) => {
    if (!num) return '0'
    const n = typeof num === 'string' ? parseInt(num) : num
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMnYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6TTM0IDJ2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6bS00IDB2MmgyVjJoLTJ6TTIgNnYyaDJWNkgyek0yIDEwdjJoMnYtMkgyek0yIDE0djJoMnYtMkgyek0yIDE4djJoMnYtMkgyek0yIDIydjJoMnYtMkgyek0yIDI2djJoMnYtMkgyek0yIDMwdjJoMnYtMkgyek0yIDM0djJoMnYtMkgyek0yIDM4djJoMnYtMkgyek0yIDQydjJoMnYtMkgyek0yIDQ2djJoMnYtMkgyek0yIDUwdjJoMnYtMkgyek0yIDU0djJoMnYtMkgyek02IDJoMnYySDZWMnptMCA1Mmgydi0ySDZ2MnptNDggMGgydi0ySDZ2MnptMCA0aDJ2LTJoLTJ2MnptLTQ4IDRoMnYtMkg2djJ6bTQ4LTRoMnYtMmgtMnYyek02IDJoMnYySDZWMnptNTQgNTB2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0wLTR2Nmgydi02aC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative z-10">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800">Video Dashboard</h1>
            </div>
            {video && (
              <div className="flex items-center gap-2 text-slate-600">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{formatNumber(video.statistics?.viewCount)} views</span>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8 text-black">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            </div>
          )}

          {!loading && !video && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Video Not Found</h3>
              <p className="text-slate-600">Unable to load the video. Please check the video ID and try again.</p>
            </div>
          )}

          {!loading && video && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                  <div className="aspect-video bg-black">
                    <iframe
                      title="video"
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">
                      {video.snippet?.title}
                    </h2>
                    <div className="flex items-center gap-4 py-4 border-t border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {formatNumber(video.statistics?.viewCount)} views
                        </span>
                      </div>
                      {video.statistics?.likeCount && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">👍</span>
                          <span className="text-sm font-medium text-slate-700">
                            {formatNumber(video.statistics?.likeCount)}
                          </span>
                        </div>
                      )}
                      {video.statistics?.commentCount && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">💬</span>
                          <span className="text-sm font-medium text-slate-700">
                            {formatNumber(video.statistics?.commentCount)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {video.snippet?.description || 'No description available.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-1">
                <VideoManager serverVideo={video} />
              </aside>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
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
      `}</style>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        </div>
      </div>
    }>
      <VideoDashboard />
    </Suspense>
  )
}