import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import ComplaintCard from '../components/ComplaintCard'
import { SkeletonCard } from '../components/SkeletonCard'
import CommentsSection from '../components/CommentsSection'
import { StatusBadge, PriorityBadge, SentimentBadge } from '../components/Badges'
import {
  Filter, FileX, X, Calendar, Hash, Tag, Bot, Paperclip
} from 'lucide-react'

// ─── Student Complaint Detail Drawer ────────────────────────────────────────
function StudentComplaintDrawer({ complaint: c, onClose }) {
  const drawerRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!c) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-x-0 bottom-0 top-16 bg-gray-900/40 backdrop-blur-sm z-30 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-full bg-white z-40 shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-white">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={c.status} />
              {c.ai_prediction && (
                <>
                  <PriorityBadge priority={c.ai_prediction.priority} />
                  <SentimentBadge sentiment={c.ai_prediction.sentiment} />
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">{c.title}</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{c.id.split('-')[0]}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.created_at).toLocaleDateString()}</span>
              {c.ai_prediction && (
                <span className="flex items-center gap-1 text-blue-500"><Tag className="w-3 h-3" />{c.ai_prediction.category}</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors shrink-0 mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">

            {/* Left column: Details */}
            <div className="p-6 flex flex-col gap-5 border-r border-gray-100">

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {c.description}
                </p>
              </div>

              {/* Attachment */}
              {c.image_url && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Evidence</h3>
                  <a
                    href={c.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 font-medium"
                  >
                    <Paperclip className="w-4 h-4" /> View Attached Evidence
                  </a>
                </div>
              )}
            </div>

            {/* Right column: Discussion Forum */}
            <div className="flex flex-col h-full min-h-[500px]">
              <div className="px-6 pt-6 pb-3 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discussion Forum</h3>
                <p className="text-xs text-gray-400 mt-0.5">Ask questions or send updates to campus administrators</p>
              </div>
              <div className="flex-1 px-6 py-4 overflow-hidden">
                <CommentsSection complaintId={c.id} initialComments={c.comments || []} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved']

export default function ComplaintHistory() {
  const [searchParams]              = useSearchParams()
  const complaintIdParam            = searchParams.get('id')
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('All')
  const [selected, setSelected]     = useState(null) // selected complaint for drawer

  // Auto-open target complaint if navigated to via notification
  useEffect(() => {
    if (!complaintIdParam) return
    api.get(`/complaints/${complaintIdParam}`)
      .then(res => setSelected(res.data))
      .catch(err => console.error('Failed to load target complaint:', err))
  }, [complaintIdParam])

  useEffect(() => {
    api.get('/complaints/my')
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? complaints
    : complaints.filter(c => c.status === filter)

  // Count per filter for pill badges
  const counts = {
    All: complaints.length,
    Pending: complaints.filter(c => c.status === 'Pending').length,
    'In Progress': complaints.filter(c => c.status === 'In Progress').length,
    Resolved: complaints.filter(c => c.status === 'Resolved').length,
  }

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in pb-20">
      
      {/* ─── Drawer ─── */}
      {selected && (
        <StudentComplaintDrawer
          complaint={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Complaint History
          </h1>
          <p className="text-gray-500 mt-1">
            Track the status and AI analysis of all your{' '}
            <span className="text-gray-900 font-medium">{complaints.length}</span> submission{complaints.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 ml-1.5" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                ${filter === f
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'}`}
            >
              {f}
              {counts[f] > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card bg-gray-50 p-16 text-center border-dashed border-gray-200 flex flex-col items-center gap-3">
          <FileX className="w-10 h-10 text-gray-300" />
          <p className="text-gray-500 text-sm">No complaints found for "{filter}"</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(c => (
            <ComplaintCard 
              key={c.id} 
              complaint={c} 
              showAi={true} 
              onClick={() => setSelected(c)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
