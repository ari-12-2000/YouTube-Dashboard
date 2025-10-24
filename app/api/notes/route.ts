import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const videoId = url.searchParams.get('videoId') || undefined;
    const q = url.searchParams.get('q') || undefined;
    if (!videoId) return NextResponse.json([], { status: 200 });

    const where: any = { videoId };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { body: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } }
      ];
    }

    const found = await prisma.note.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(found);
  } catch (err: any) {
    console.log('Error fetching notes', err)
  }

}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { videoId, title, body: content, tags } = body;
    console.log(videoId, title, content, tags)
    const created = await prisma.note.create({ data: { videoId, title, body: content, tags } });
    return NextResponse.json(created);
  } catch (err: any) {
    console.error("Error saving note", err);
    return NextResponse.json({error: err.message }, { status: 500 });
  }

}