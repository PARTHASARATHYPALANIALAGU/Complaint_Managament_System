import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'
import ComplaintCard from '../components/ComplaintCard'
import { PlusCircle, ListTodo, Activity, CheckCircle } from 'lucide-react'

export default function StudentDashboard() {
    const { user } = useAuth()
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/complaints/my')
            .then(res => setComplaints(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const pending = complaints.filter(c => c.status === 'Pending').length
    const inProgress = complaints.filter(c => c.status === 'In Progress').length
    const resolved = complaints.filter(c => c.status === 'Resolved').length

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Welcome, {user.name.split(' ')[0]}
                    </h1>
                    <p className="text-white/60 mt-1">Here is an overview of your complaints</p>
                </div>
                <Link to="/submit" className="btn-primary inline-flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" /> New Complaint
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto mb-2">
                        <ListTodo className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-white">{pending}</p>
                    <p className="text-sm font-medium text-white/50 uppercase tracking-wider text-yellow-300">Pending</p>
                </div>
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                        <Activity className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-white">{inProgress}</p>
                    <p className="text-sm font-medium text-white/50 uppercase tracking-wider text-blue-300">In Progress</p>
                </div>
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold text-white">{resolved}</p>
                    <p className="text-sm font-medium text-white/50 uppercase tracking-wider text-emerald-400">Resolved</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="section-title text-xl">Recent Complaints</h2>
                    <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All →</Link>
                </div>

                {loading ? (
                    <div className="animate-pulse flex flex-col gap-4">
                        {[1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <p className="text-white/40">You haven't submitted any complaints yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {complaints.slice(0, 3).map(c => (
                            <ComplaintCard key={c.id} complaint={c} showAi={false} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
