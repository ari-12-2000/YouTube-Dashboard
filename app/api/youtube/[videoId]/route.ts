import { fetchVideo } from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {
    const { videoId } = await params;
    try {
        const video = await fetchVideo(videoId);
        return NextResponse.json({ ok: true, video });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }

}