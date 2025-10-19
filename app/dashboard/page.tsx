import { fetchVideo } from '@/lib/youtube';
import VideoManager from '@/components/VideoManager.client';


export default async function Page() {
    const videoId = process.env.YOUTUBE_VIDEO_ID!;
    const video = await fetchVideo(videoId);


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
