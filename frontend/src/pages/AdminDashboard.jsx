import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import toast from 'react-hot-toast'
import { StatusBadge, PriorityBadge, SentimentBadge } from '../components/Badges'
import { Filter, Search, ChevronDown, ChevronUp, CheckCircle2, User, Mail, Calendar, Hash } from 'lucide-react'

export default function AdminDashboard() {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('Pending')
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState(null)

    const fetchComplaints = () => {
        setLoading(true)
        api.get('/admin/complaints', { params: { status: statusFilter, search } })
            .then(res => setComplaints(res.data))
            .catch(err => toast.error('Failed to load complaints'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchComplaints()
    }, [statusFilter])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => fetchComplaints(), 500)
        return () => clearTimeout(timer)
    }, [search])

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/admin/complaints/${id}/status`, { status: newStatus })
            toast.success('Status updated successfully')
            fetchComplaints()
        } catch (err) {
            toast.error('Failed to update status')
        }
    }

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-white/60 mt-1">Manage and resolve campus complaints</p>
                </div>
            </div>

            <div className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        className="input-field pl-10 h-10 w-full"
                        placeholder="Search complaints..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/40" />
                    <select
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="" className="bg-dark-900">All Statuses</option>
                        <option value="Pending" className="bg-dark-900">Pending</option>
                        <option value="In Progress" className="bg-dark-900">In Progress</option>
                        <option value="Resolved" className="bg-dark-900">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="p-8 text-center text-white/40 glass-card">Loading complaints...</div>
                ) : complaints.length === 0 ? (
                    <div className="p-8 text-center text-white/40 glass-card">No complaints found.</div>
                ) : (
                    complaints.map(c => (
                        <div key={c.id} className="glass-card overflow-hidden border border-white/10 transition-all">
                            {/* Main visible row */}
                            <div className="flex flex-col lg:flex-row gap-6 p-6">
                                {/* Title & Expand Toggle */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-semibold text-lg text-white mb-2">{c.title}</h3>
                                    </div>

                                    <button
                                        onClick={() => toggleExpand(c.id)}
                                        className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors mt-2"
                                    >
                                        {expandedId === c.id ? (
                                            <><ChevronUp className="w-4 h-4" /> Hide Submitter & Details</>
                                        ) : (
                                            <><ChevronDown className="w-4 h-4" /> View Submitter & Details</>
                                        )}
                                    </button>
                                </div>

                                {/* AI Badges & Rec */}
                                <div className="lg:w-5/12 flex flex-col gap-3">
                                    {c.ai_prediction ? (
                                        <>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="badge-gray">{c.ai_prediction.category}</span>
                                                <PriorityBadge priority={c.ai_prediction.priority} />
                                                <SentimentBadge sentiment={c.ai_prediction.sentiment} />
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                <p className="text-xs font-semibold text-white/40 uppercase mb-1">AI Recommendation</p>
                                                <p className="text-sm text-white/80">{c.ai_prediction.admin_recommendation}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-sm text-white/40">AI Analysis unavailable</span>
                                    )}
                                </div>

                                {/* Status Manager */}
                                <div className="lg:w-1/4 flex flex-col gap-3 min-w-[200px]">
                                    <StatusBadge status={c.status} />
                                    {c.status !== 'Resolved' && (
                                        <div className="flex flex-col gap-2 mt-auto">
                                            {c.status === 'Pending' && (
                                                <button onClick={() => handleStatusUpdate(c.id, 'In Progress')} className="btn-ghost text-xs px-3 py-2 w-full">
                                                    Start Work
                                                </button>
                                            )}
                                            <button onClick={() => handleStatusUpdate(c.id, 'Resolved')} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded-lg text-xs font-medium px-3 py-2 transition-colors flex items-center justify-center gap-1 w-full">
                                                <CheckCircle2 className="w-4 h-4" /> Resolve Issue
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Details Section */}
                            {expandedId === c.id && (
                                <div className="border-t border-white/10 bg-white/[0.02] p-6 animate-fade-in flex flex-col md:flex-row gap-8">
                                    {/* Description */}
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white/60 uppercase mb-2">Complaint Description</h4>
                                        <p className="text-sm text-white/80 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                                            {c.description}
                                        </p>

                                        {c.image_url && (
                                            <div className="mt-4">
                                                <a href={c.image_url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                                                    📎 View Attached Evidence
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submitter & Metadata */}
                                    <div className="md:w-1/3 flex flex-col gap-4">
                                        <h4 className="text-sm font-semibold text-white/60 uppercase mb-1">Submitter Details</h4>

                                        {c.user ? (
                                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex flex-col gap-3">
                                                <div className="flex items-center gap-3 text-blue-200">
                                                    <User className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm font-medium">{c.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/60">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="text-sm">{c.user.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-white/40 italic">Submitter info unavailable</p>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-white/40 flex items-center gap-1"><Hash className="w-3 h-3" /> ID</span>
                                                <span className="text-sm font-mono text-white/60">{c.id.split('-')[0]}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-white/40 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</span>
                                                <span className="text-sm text-white/60">{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
