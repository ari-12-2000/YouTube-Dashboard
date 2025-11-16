import { NextResponse } from 'next/server';
import {
  fetchVideo,
  updateVideoMetadata,
  listComments,
  insertComment,
  insertReply,
  deleteComment
} from '@/lib/youtube';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body = await req.json(); 
    const action = body.action || body.type || url.searchParams.get('action');

    if (action === 'fetch') {
      const videoId = body.videoId || process.env.YOUTUBE_VIDEO_ID!;
      const video = await fetchVideo(videoId);
      return NextResponse.json({ ok: true, video });
    }

    if (action === 'update') {
      const { videoId, title, description } = body;
      const updated = await updateVideoMetadata(
        videoId || process.env.YOUTUBE_VIDEO_ID!,
        title,
        description
      );
      return NextResponse.json({ ok: true, updated });
    }

    if (action === 'comments/list') {
      const videoId = body.videoId || process.env.YOUTUBE_VIDEO_ID!;
      const items = await listComments(videoId);
      return NextResponse.json({ ok: true, items });
    }

    if (action === 'comments/insert') {
      const { videoId, text } = body;
      const inserted = await insertComment(
        videoId || process.env.YOUTUBE_VIDEO_ID!,
        text
      );
      return NextResponse.json({ ok: true, inserted });
    }

    if (action === 'comments/reply') {
      const { parentId, text } = body;
      const inserted = await insertReply(parentId, text);
      return NextResponse.json({ ok: true, inserted });
    }

    if (action === 'comments/delete') {
      const { commentId } = body;
      await deleteComment(commentId);
      return NextResponse.json({ ok: true });
    }

    // If none of the actions matched
    return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 });

  } catch (err: any) {
    console.error('API error:', err);
    if(err.status===403)
      return NextResponse.json({ ok: false, error: 'Your requested action is against youtube guidelines' }, { status: 500 });
    return NextResponse.json({ ok: false, error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
