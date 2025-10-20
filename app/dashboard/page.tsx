'use client'
import { fetchVideo } from '@/lib/youtube';
import VideoManager from '@/components/VideoManager.client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';


export default function Page() {
    const videoId = useSearchParams().get("videoId")
    const { data: session } = useSession();
    const [video, setVideo] = useState<any>(null);
    useEffect(() => {
        if (!session) return; // wait till login
        const loadVideo = async () => {
            try {
                const data = await fetchVideo(videoId!);
                setVideo(data);
            } catch (err) {
                console.error("Error fetching video:", err);
            }
        };
        loadVideo();
    }, [session]);
    return (
        <main className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">YouTube Mini Dashboard</h1>


            {!video && (
                <div className="p-4 border rounded">No video found. Make sure YOUTUBE_VIDEO_ID is set.</div>
            )}


            {video && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <iframe
                            title="video"
                            width="100%"
                            height="360"
                            src={`https://www.youtube.com/embed/${video.id}`}
                            allowFullScreen
                        />
                        <h2 className="text-xl font-semibold mt-3">{video.snippet?.title}</h2>
                        <p className="text-sm text-gray-600">Views: {video.statistics?.viewCount || '—'}</p>
                        <p className="mt-2 whitespace-pre-wrap">{video.snippet?.description}</p>
                    </div>


                    <aside>
                        {/* Client manager handles editing, comments, notes */}
                        {/* @ts-ignore */}
                        <VideoManager serverVideo={video} />
                    </aside>
                </section>
            )}
        </main>

    );
}
