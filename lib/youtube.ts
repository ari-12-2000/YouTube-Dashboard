import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


async function getOAuthClient(): Promise<OAuth2Client> {
    const session= await getServerSession(authOptions)
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
    );
    
    client.setCredentials({ refresh_token: session?.refreshToken });
    
    return client;
}


export async function getYoutubeClient() {
    const auth = await getOAuthClient();
    const youtube = google.youtube({ version: 'v3', auth });
    return { youtube, auth };
}


// Fetch video details
export async function fetchVideo(videoId: string) {
    const { youtube } = await getYoutubeClient();
    const res = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [videoId]
    });
    return res.data.items?.[0] || null;
}


// update title/description
export async function updateVideoMetadata(videoId: string, title: string, description: string) {
    const { youtube } = await getYoutubeClient();
    // get snippet
    const v = await youtube.videos.list({ part: ['snippet'], id: [videoId] });
    const snippet = v.data.items?.[0]?.snippet;
    if (!snippet) throw new Error('Video not found');
    snippet.title = title;
    snippet.description = description;
    const update = await youtube.videos.update({ part: ['snippet'], requestBody: { id: videoId, snippet } });
    return update.data;
}


// list comments for the video (top-level)
export async function listComments(videoId: string) {
    const { youtube } = await getYoutubeClient();
    const res = await youtube.commentThreads.list({
        part: ['snippet', 'replies'],
        videoId,
        maxResults: 50
    });
    return res.data.items || [];
}


// post comment
export async function insertComment(videoId: string, text: string) {
    const { youtube } = await getYoutubeClient();
    const res = await youtube.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
            snippet: {
                videoId,
                topLevelComment: {
                    snippet: {
                        textOriginal: text
                    }
                }
            }
        }
    });
    return res.data;
}


// reply to a comment (parentId is the commentId)
export async function insertReply(parentId: string, text: string) {
    const { youtube } = await getYoutubeClient();
    const res = await youtube.comments.insert({
        part: ['snippet'],
        requestBody: {
            snippet: {
                parentId,
                textOriginal: text
            }
        }
    });
    return res.data;
}


// delete a comment
export async function deleteComment(commentId: string) {
    const { youtube } = await getYoutubeClient();
    await youtube.comments.delete({ id: commentId });
    return { ok: true };
}