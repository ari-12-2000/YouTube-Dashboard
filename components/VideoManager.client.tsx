'use client';
import { useEffect, useState } from 'react';

type Video = any;

export default function VideoManager({ serverVideo }: { serverVideo: Video }) {
  const videoId:string = serverVideo?.id;
  const [video, setVideo] = useState(serverVideo);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(serverVideo?.snippet?.title || '');
  const [description, setDescription] = useState(serverVideo?.snippet?.description || '');

  // Notes state — we call local API (we'll implement a simple handler using Next server functions)
  const [notes, setNotes] = useState<any[]>([]);
  const [noteQuery, setNoteQuery] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteTags, setNoteTags] = useState('');

  useEffect(() => {
    fetch('/api/youtube', { method: 'POST', body: JSON.stringify({ action: 'comments/list', videoId }) , headers:{'content-type':'application/json'} })
      .then(r => r.json())
      .then(d => { if (d.ok) setComments(d.items || []); });

    fetch('/api/notes?videoId=' + videoId).then(r => r.json()).then(d => setNotes(d || []));
  }, [videoId]);

  async function updateMeta() {
    const res = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'update', videoId, title, description }) });
    const j = await res.json();
    if (j.ok) {
      alert('Updated');
      setVideo(j.updated);
      setEditing(false);
    } else alert('Error: ' + j.error);
  }

  async function postComment() {
    if (!newComment.trim()) return;
    const res = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'comments/insert', videoId, text: newComment }) });
    const j = await res.json();
    if (j.ok) {
      setNewComment('');
      // refresh
      const l = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'comments/list', videoId }) });
      const lj = await l.json();
      if (lj.ok) setComments(lj.items || []);
    } else alert('Error: ' + j.error);
  }

  async function replyTo(parentId: string) {
    const text = prompt('Reply text');
    if (!text) return;
    const res = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'comments/reply', parentId, text }) });
    const j = await res.json();
    if (j.ok) {
      alert('replied');
      const l = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'comments/list', videoId }) });
      const lj = await l.json();
      if (lj.ok) setComments(lj.items || []);
    } else alert('Error: ' + j.error);
  }

  async function deleteCommentById(id: string) {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'comments/delete', commentId: id }) });
    const j = await res.json();
    if (j.ok) {
      setComments(prev => prev.filter(c => c.id !== id));
      alert('Deleted');
    } else alert('Error: ' + j.error);
  }

  // Notes handling
  async function saveNote() {
    const tagsArray = noteTags.split(',').map(t => t.trim()).filter(Boolean);
    const res = await fetch('/api/notes', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ videoId, title: noteTitle, body: noteBody, tags: tagsArray }) });
    const j = await res.json();
    if (j.id) {
      setNotes(prev => [j, ...prev]);
      setNoteTitle(''); setNoteBody(''); setNoteTags('');
    }
  }

  async function searchNotes(q: string) {
    const res = await fetch('/api/notes?videoId=' + videoId + '&q=' + encodeURIComponent(q));
    const j = await res.json();
    setNotes(j || []);
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <div>
        <h3 className="font-semibold">Manage video</h3>
        {!editing ? (
          <div>
            <p className="text-sm">{video?.snippet?.title}</p>
            <button className="mt-2 px-2 py-1 border rounded" onClick={() => setEditing(true)}>Edit title & description</button>
          </div>
        ) : (
          <div className="space-y-2">
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-1" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-1" rows={4} />
            <div className="flex gap-2">
              <button onClick={updateMeta} className="px-3 py-1 border rounded">Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold">Comments</h4>
        <div className="space-y-2">
          <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} className="w-full border p-1" rows={3} />
          <div className="flex gap-2">
            <button onClick={postComment} className="px-3 py-1 border rounded">Post comment</button>
            <button onClick={() => { setNewComment(''); }} className="px-3 py-1 border rounded">Clear</button>
          </div>

          <div className="mt-2 max-h-64 overflow-auto">
            {comments.length === 0 && <div className="text-sm text-gray-500">No comments yet</div>}
            {comments.map((c:any) => {
              const top = c.snippet?.topLevelComment || c;
              const id = top.id || c.id;
              return (
                <div key={id} className="p-2 border rounded mb-2">
                  <div className="text-sm font-medium">{top.snippet?.authorDisplayName}</div>
                  <div className="text-sm">{top.snippet?.textDisplay}</div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => replyTo(top.id)} className="text-xs">Reply</button>
                    <button onClick={() => deleteCommentById(top.id)} className="text-xs">Delete (your comment)</button>
                  </div>
                  {/* show replies if any */}
                  {c.replies?.comments?.map((r:any)=> (
                    <div key={r.id} className="ml-4 mt-2 text-sm border-l pl-2">{r.snippet?.textDisplay}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold">Notes (local DB)</h4>
        <div className="space-y-2">
          <input placeholder="Search notes or tags" value={noteQuery} onChange={e=>{setNoteQuery(e.target.value); searchNotes(e.target.value)}} className="w-full border p-1" />

          <div className="p-2 border rounded">
            <input placeholder="Title" value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} className="w-full border p-1 mb-1" />
            <textarea placeholder="Note body" value={noteBody} onChange={e=>setNoteBody(e.target.value)} className="w-full border p-1 mb-1" rows={3} />
            <input placeholder="tags (comma separated)" value={noteTags} onChange={e=>setNoteTags(e.target.value)} className="w-full border p-1 mb-1" />
            <div className="flex gap-2">
              <button onClick={saveNote} className="px-3 py-1 border rounded">Save note</button>
            </div>
          </div>

          <div className="space-y-2">
            {notes.map((n:any) => (
              <div key={n.id} className="p-2 border rounded">
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-xs text-gray-600">{n.tags?.join(', ')}</div>
                <div className="text-sm mt-1 whitespace-pre-wrap">{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}