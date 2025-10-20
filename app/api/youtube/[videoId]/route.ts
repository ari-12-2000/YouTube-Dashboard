import { fetchVideo } from "@/lib/youtube";

export async function GET({params}:{params:Promise<{videoId:string}>}){
    const {videoId}= await params;
    return fetchVideo(videoId);
}