import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { action, resourceId } = body;

    if (!action || !resourceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const log = await prisma.logs.create({
      data: {
        action,
        resourceId,
      },
    });

    return NextResponse.json(
      { message: "Log saved successfully", log },
      { status: 201 }
    );
  } catch (err: any) {
    console.log("Error saving logs", err);
    return NextResponse.json(
      { error: "Failed to save log" },
      { status: 500 }
    );
  }
}
