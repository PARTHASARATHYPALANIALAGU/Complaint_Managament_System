import { useState } from 'react'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { Send, User as UserIcon, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CommentsSection({ complaintId, initialComments = [] }) {
  const { user } = useAuth()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const res = await api.post(`/complaints/${complaintId}/comments`, {
        content: newComment
      })
      // The response should be the created comment
      setComments([...comments, res.data])
      setNewComment('')
      toast.success('Comment added')
    } catch (err) {
      toast.error('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Discussion ({comments.length})
        </h4>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto max-h-80 space-y-4 mb-4 pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((c) => {
            const isMe = c.user_id === user.id
            const isAdmin = c.user?.role === 'admin'
            return (
              <div key={c.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {!isMe && <UserIcon className="w-3.5 h-3.5 text-gray-400" />}
                  <span className="text-xs font-medium text-gray-500">
                    {isMe ? 'You' : (c.user?.name || 'User')}{isAdmin && !isMe && <span className="text-blue-500 ml-1"> (Admin)</span>}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()} {new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm
                  ${isMe 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : isAdmin 
                      ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tl-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {c.content}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  )
}
