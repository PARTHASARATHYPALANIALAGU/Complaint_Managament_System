import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, AreaChart, Area, CartesianGrid, Legend
} from 'recharts'
import { Download, AlertTriangle, Users, Target } from 'lucide-react'

export default function Analytics() {
    const [summary, setSummary] = useState(null)
    const [categories, setCategories] = useState([])
    const [trends, setTrends] = useState([])
    const [sentiments, setSentiments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/analytics/summary'),
            api.get('/analytics/categories'),
            api.get('/analytics/trends'),
            api.get('/analytics/sentiment')
        ]).then(([sum, cat, trd, sen]) => {
            setSummary(sum.data)
            setCategories(cat.data.sort((a, b) => b.count - a.count))
            setTrends(trd.data)
            setSentiments(sen.data)
            setLoading(false)
        }).catch(err => console.error(err))
    }, [])

    const handleExport = async () => {
        window.open(`${api.defaults.baseURL}/analytics/export/csv`, '_blank')
    }

    if (loading) return (
        <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e']

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Platform Analytics
                    </h1>
                    <p className="text-white/60 mt-1">Real-time AI insights across all complaints</p>
                </div>
                <button onClick={handleExport} className="btn-ghost flex items-center gap-2 bg-white/[0.02]">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="stat-card border-t-4 border-t-blue-500">
                    <p className="text-3xl font-bold text-white">{summary.total}</p>
                    <p className="text-sm text-white/50 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-4 h-4" /> Total Submitted</p>
                </div>
                <div className="stat-card border-t-4 border-t-emerald-500">
                    <p className="text-3xl font-bold text-white">{summary.resolved}</p>
                    <p className="text-sm text-white/50 uppercase tracking-widest flex items-center gap-1.5"><Target className="w-4 h-4" /> Resolved</p>
                </div>
                <div className="stat-card border-t-4 border-t-yellow-500">
                    <p className="text-3xl font-bold text-white">{summary.pending}</p>
                    <p className="text-sm text-white/50 uppercase tracking-widest">Pending Review</p>
                </div>
                <div className="stat-card border-t-4 border-t-red-500 bg-red-500/5">
                    <p className="text-3xl font-bold text-red-400">{summary.high_priority}</p>
                    <p className="text-sm text-red-400/80 uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> High Priority</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Category Chart */}
                <div className="glass-card p-6">
                    <h2 className="section-title text-xl mb-6">Complaints by Category</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categories} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <XAxis type="number" stroke="#ffffff40" tick={{ fill: '#ffffff80' }} />
                                <YAxis dataKey="category" type="category" width={100} stroke="#ffffff40" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment & Trends */}
                <div className="flex flex-col gap-6">

                    <div className="glass-card p-6 h-1/2">
                        <h2 className="section-title text-xl mb-2">Student Sentiment Analysis</h2>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sentiments} dataKey="count" nameKey="sentiment" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                                        {sentiments.map((entry, index) => {
                                            const color = entry.sentiment === 'Positive' ? '#10b981' : entry.sentiment === 'Negative' ? '#ef4444' : '#64748b'
                                            return <Cell key={`cell-${index}`} fill={color} />
                                        })}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-6 h-1/2 flex-1">
                        <h2 className="section-title text-xl mb-4">Submission Trends</h2>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="month" stroke="#ffffff40" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                                    <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
