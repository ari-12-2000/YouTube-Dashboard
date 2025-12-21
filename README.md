ROUTES

1. POST /api/youtube

Handles YouTube operations like fetching video info, updating metadata, and managing comments.

2. GET /api/youtube/[videoId]

Fetches full YouTube video details directly using the dynamic video ID.

3. GET /api/notes

Returns notes for a specific video, with built-in text and tag search.

4. POST /api/notes

Creates a new note with title, body, and tags for a selected video.

5. POST /api/logs

Stores user actions such as edits, comments, and note activity for auditing.

PRISMA MODELS 

1.Note 

Stores user-created notes linked to a specific video, along with tags and timestamps.

model Note {
id String @id @default(cuid())
videoId String
title String
body String
tags String[] @default([])
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

2.Logs 

Keeps a history of important user actions such as comments, edits, or notes for auditing and tracking.

model Logs {
  id           String @id @default(cuid())
  action     String                      (what happened (VIEW_VIDEO, ADD_COMMENT, DELETE_COMMENT, etc.)
  resourceId String                     ( e.g., videoId, commentId, noteId )
  createdAt  DateTime @default(now())    ( timestamp )
}