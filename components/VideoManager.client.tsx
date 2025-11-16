'use client';
import { useEffect, useState } from 'react';
import { Edit2, Save, X, Send, MessageCircle, Trash2, Reply, StickyNote, Search, Tag, Plus } from 'lucide-react';

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
      await fetch('/api/logs', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ resourceId:videoId, action:"UPDATE_METADATA" }) });
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
      if (lj.ok)
      await fetch('/api/logs', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ resourceId:videoId, action:"ADD_COMMENT" }) });
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
      await fetch('/api/logs', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ resourceId:videoId, action:"REPLY_COMMENT" }) });
    } else alert('Error: ' + j.error);
    
  }

  async function deleteCommentById(id: string) {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch('/api/youtube', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ action: 'comments/delete', commentId: id }) });
    const j = await res.json();
    if (j.ok) {
      setComments(prev => prev.filter(c => c.id !== id));
      alert('Deleted');
      await fetch('/api/logs', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ resourceId:videoId, action:"DELETE_COMMENT" }) });
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
      await fetch('/api/logs', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ resourceId:videoId, action:"ADD_NOTE" }) });
    }

    
  }

  async function searchNotes(q: string) {
    const res = await fetch('/api/notes?videoId=' + videoId + '&q=' + encodeURIComponent(q));
    const j = await res.json();
    setNotes(j || []);
    if(j)
    await fetch('/api/logs', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ resourceId:videoId, action:"SEARCH_NOTE" }) });
  
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-4">
          <div className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Manage Video</h3>
          </div>
        </div>
        <div className="p-5">
          {!editing ? (
            <div>
              <p className="text-sm text-slate-700 mb-4 line-clamp-2">{video?.snippet?.title}</p>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
                Edit Details
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Video title"
              />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                rows={4}
                placeholder="Video description"
              />
              <div className="flex gap-2">
                <button
                  onClick={updateMeta}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-4">
          <div className="flex items-center gap-2 text-white">
            <MessageCircle className="w-5 h-5" />
            <h4 className="font-semibold text-lg">Comments</h4>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={e=>setNewComment(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="Write a comment..."
            />
            <div className="flex gap-2">
              <button
                onClick={postComment}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
              <button
                onClick={() => { setNewComment(''); }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3 mt-4">
            {comments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No comments yet</p>
              </div>
            )}
            {comments.map((c:any) => {
              const top = c.snippet?.topLevelComment || c;
              const id = top.id || c.id;
              return (
                <div key={id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {top.snippet?.authorDisplayName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-800">{top.snippet?.authorDisplayName}</div>
                      <div className="text-sm text-slate-600 mt-1">{top.snippet?.textDisplay}</div>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => replyTo(top.id)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-purple-600 transition-colors"
                        >
                          <Reply className="w-3 h-3" />
                          Reply
                        </button>
                        <button
                          onClick={() => deleteCommentById(top.id)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                      {c.replies?.comments?.map((r:any)=> (
                        <div key={r.id} className="ml-4 mt-3 pl-4 border-l-2 border-purple-200 text-sm text-slate-600">
                          {r.snippet?.textDisplay}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-4">
          <div className="flex items-center gap-2 text-white">
            <StickyNote className="w-5 h-5" />
            <h4 className="font-semibold text-lg">Notes</h4>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search notes or tags"
              value={noteQuery}
              onChange={e=>{setNoteQuery(e.target.value); searchNotes(e.target.value)}}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <div className="space-y-3">
              <input
                placeholder="Note title"
                value={noteTitle}
                onChange={e=>setNoteTitle(e.target.value)}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-white"
              />
              <textarea
                placeholder="Write your note..."
                value={noteBody}
                onChange={e=>setNoteBody(e.target.value)}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none bg-white"
                rows={3}
              />
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="tags (comma separated)"
                  value={noteTags}
                  onChange={e=>setNoteTags(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-white"
                />
              </div>
              <button
                onClick={saveNote}
                className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notes.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <StickyNote className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notes yet</p>
              </div>
            )}
            {notes.map((n:any) => (
              <div key={n.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors">
                <div className="font-semibold text-slate-800 mb-1">{n.title}</div>
                {n.tags && n.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {n.tags.map((tag:string, idx:number) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-medium">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}