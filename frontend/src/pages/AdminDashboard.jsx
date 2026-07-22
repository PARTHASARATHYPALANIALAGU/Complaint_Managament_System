import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import toast from 'react-hot-toast'
import { StatusBadge, PriorityBadge, SentimentBadge } from '../components/Badges'
import AnimatedCounter from '../components/AnimatedCounter'
import { SkeletonRow, SkeletonStatCard } from '../components/SkeletonCard'
import CommentsSection from '../components/CommentsSection'
import {
  Filter, Search, CheckCircle2, X,
  User, Mail, Calendar, Hash, Clock, TrendingUp, AlertTriangle, Activity,
  Paperclip, Bot, Tag
} from 'lucide-react'

// ─── Complaint Detail Drawer ────────────────────────────────────────────────
function ComplaintDrawer({ complaint: c, onClose, onStatusUpdate }) {
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

              {/* AI Recommendation */}
              {c.ai_prediction?.admin_recommendation && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI Recommendation
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-sm text-indigo-800 leading-relaxed">{c.ai_prediction.admin_recommendation}</p>
                  </div>
                </div>
              )}

              {/* Submitter */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Submitter</h3>
                {c.user ? (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 text-gray-900">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{c.user.name}</p>
                        <p className="text-xs text-gray-500">{c.user.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Submitter info unavailable</p>
                )}
              </div>

              {/* Actions */}
              {c.status !== 'Resolved' && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Actions</h3>
                  <div className="flex flex-col gap-2">
                    {c.status === 'Pending' && (
                      <button
                        onClick={() => onStatusUpdate(c.id, 'In Progress', c.title)}
                        className="btn-ghost w-full text-sm"
                      >
                        Mark as In Progress
                      </button>
                    )}
                    <button
                      onClick={() => onStatusUpdate(c.id, 'Resolved', c.title)}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold px-4 py-2.5 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Resolve This Issue
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Discussion Forum */}
            <div className="flex flex-col h-full min-h-[500px]">
              <div className="px-6 pt-6 pb-3 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discussion Forum</h3>
                <p className="text-xs text-gray-400 mt-0.5">Communicate with the student about this complaint</p>
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


// ─── Main Admin Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [searchParams]              = useSearchParams()
  const complaintIdParam            = searchParams.get('id')
  const [complaints, setComplaints] = useState([])
  const [summary, setSummary]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState(null)   // selected complaint for drawer

  // Auto-open target complaint if navigated to via notification
  useEffect(() => {
    if (!complaintIdParam) return
    api.get(`/complaints/${complaintIdParam}`)
      .then(res => setSelected(res.data))
      .catch(err => console.error('Failed to load target complaint:', err))
  }, [complaintIdParam])

  useEffect(() => {
    api.get('/analytics/summary')
      .then(res => setSummary(res.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  const fetchComplaints = () => {
    setLoading(true)
    api.get('/admin/complaints', { params: { status: statusFilter, search } })
      .then(res => setComplaints(res.data))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchComplaints() }, [statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => fetchComplaints(), 500)
    return () => clearTimeout(timer)
  }, [search])

  const handleStatusUpdate = async (id, newStatus, title) => {
    try {
      await api.patch(`/admin/complaints/${id}/status`, { status: newStatus })
      toast.success(`Status updated to "${newStatus}"`)
      // Update locally so drawer reflects new status immediately
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
      setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const QUICK_STATS = summary ? [
    { value: summary.total, label: 'Total', icon: Activity, color: 'border-t-blue-500', textColor: 'text-blue-600', bg: 'bg-blue-50' },
    { value: summary.pending, label: 'Pending', icon: Clock, color: 'border-t-amber-500', textColor: 'text-amber-600', bg: 'bg-amber-50' },
    { value: (summary.total || 0) - (summary.pending || 0) - (summary.resolved || 0), label: 'In Progress', icon: TrendingUp, color: 'border-t-indigo-500', textColor: 'text-indigo-600', bg: 'bg-indigo-50' },
    { value: summary.resolved, label: 'Resolved', icon: CheckCircle2, color: 'border-t-emerald-500', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
    { value: summary.high_priority, label: 'High Priority', icon: AlertTriangle, color: 'border-t-red-500', textColor: 'text-red-600', bg: 'bg-red-50' },
  ] : []

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in pb-20">

      {/* ─── Drawer ─── */}
      {selected && (
        <ComplaintDrawer
          complaint={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* ─── Page Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Command Center
          </h1>
          <p className="text-gray-500 mt-1">Manage and resolve campus complaints with AI recommendations</p>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[1,2,3,4,5].map(i => <SkeletonStatCard key={i} />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {QUICK_STATS.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`stat-card border-t-4 ${s.color} ${s.bg} hover:-translate-y-1 cursor-default`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${s.textColor}`} />
                </div>
                <p className={`text-2xl font-bold ${s.textColor}`}>
                  <AnimatedCounter target={s.value || 0} duration={900} />
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-widest leading-tight">{s.label}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── Filters ─── */}
      <div className="glass-card p-5 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 border-gray-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="input-field pl-10 h-10 w-full"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {['', 'Pending', 'In Progress', 'Resolved'].map(s => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${statusFilter === s
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Complaints Table ─── */}
      <div className="flex flex-col gap-3">
        {loading ? (
          [1,2,3].map(i => <SkeletonRow key={i} />)
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-gray-400 glass-card flex flex-col items-center gap-3 bg-white">
            <CheckCircle2 className="w-10 h-10 opacity-30" />
            <p>No complaints found for the selected filter.</p>
          </div>
        ) : (
          complaints.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center gap-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              {/* Title */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {c.title}
                </h3>
                {c.ai_prediction?.admin_recommendation && (
                  <div className="flex items-start gap-2.5 bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-2.5 mt-2 mb-2 transition-all duration-300 group-hover:bg-indigo-50" title={c.ai_prediction.admin_recommendation}>
                    <Bot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      <span className="font-bold text-indigo-700">AI Suggestion:</span> {c.ai_prediction.admin_recommendation}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.created_at).toLocaleDateString()}</span>
                  {c.user && <span className="flex items-center gap-1"><User className="w-3 h-3" />{c.user.name}</span>}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {c.ai_prediction && (
                  <>
                    <span className="badge-gray text-xs">{c.ai_prediction.category}</span>
                    <PriorityBadge priority={c.ai_prediction.priority} />
                    <SentimentBadge sentiment={c.ai_prediction.sentiment} />
                  </>
                )}
              </div>

              {/* Status + arrow */}
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={c.status} />
                <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">›</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
