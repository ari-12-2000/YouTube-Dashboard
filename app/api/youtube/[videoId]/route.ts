import { fetchVideo } from "@/lib/youtube";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest, {params}:{params:Promise<{videoId:string}>}){
    const {videoId}= await params;
    return fetchVideo(videoId);
}