import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import ComplaintCard from '../components/ComplaintCard'
import { Filter } from 'lucide-react'

export default function ComplaintHistory() {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        api.get('/complaints/my')
            .then(res => setComplaints(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const filtered = filter === 'All'
        ? complaints
        : complaints.filter(c => c.status === filter)

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Complaint History
                    </h1>
                    <p className="text-white/60 mt-1">Track the status and AI analysis of all your submissions</p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                    <Filter className="w-4 h-4 text-white/40 ml-2" />
                    {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-blue-600/30 text-blue-300' : 'text-white/60 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card p-12 text-center border-dashed">
                    <p className="text-white/50">No complaints found for the selected filter.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(c => (
                        <ComplaintCard key={c.id} complaint={c} showAi={false} />
                    ))}
                </div>
            )}
        </div>
    )
}
