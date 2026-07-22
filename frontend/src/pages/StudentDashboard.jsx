import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'
import ComplaintCard from '../components/ComplaintCard'
import AnimatedCounter from '../components/AnimatedCounter'
import { SkeletonCard, SkeletonStatCard } from '../components/SkeletonCard'
import { PlusCircle, ListTodo, Activity, CheckCircle, Sunrise, Sun, Moon } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { label: 'Good morning', Icon: Sunrise, color: 'text-amber-600' }
  if (h < 18) return { label: 'Good afternoon', Icon: Sun, color: 'text-amber-500' }
  return { label: 'Good evening', Icon: Moon, color: 'text-indigo-600' }
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const greeting = getGreeting()

  useEffect(() => {
    api.get('/complaints/my')
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const pending    = complaints.filter(c => c.status === 'Pending').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length
  const resolved   = complaints.filter(c => c.status === 'Resolved').length

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">

      {/* ─── Header with greeting banner ─── */}
      <div className="glass-card p-6 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Background glow */}
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-50 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-50 rounded-full blur-[40px] pointer-events-none" />

        <div className="relative">
          <div className={`flex items-center gap-2 text-sm font-medium mb-1 ${greeting.color}`}>
            <greeting.Icon className="w-4 h-4" />
            {greeting.label}!
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {user.name.split(' ')[0]}'s Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            You have <span className="text-amber-600 font-semibold">{pending} pending</span> and{' '}
            <span className="text-blue-600 font-semibold">{inProgress} in-progress</span> complaint{inProgress !== 1 ? 's' : ''}.
          </p>
        </div>

        <Link to="/submit" className="btn-primary inline-flex items-center gap-2 relative">
          <PlusCircle className="w-5 h-5" /> New Complaint
        </Link>
      </div>

      {/* ─── Stat Cards ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
          <div className="stat-card hover:-translate-y-1 cursor-default">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 border border-amber-100">
              <ListTodo className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter target={pending} />
            </p>
            <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Pending</p>
          </div>

          <div className="stat-card hover:-translate-y-1 cursor-default">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter target={inProgress} />
            </p>
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">In Progress</p>
          </div>

          <div className="stat-card hover:-translate-y-1 cursor-default">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter target={resolved} />
            </p>
            <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Resolved</p>
          </div>
        </div>
      )}

      {/* ─── Recent Complaints ─── */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="section-title text-xl mb-0">Recent Complaints</h2>
            <p className="text-gray-500 text-xs mt-0.5">Your latest 3 submissions</p>
          </div>
          <Link to="/history" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <SkeletonCard lines={4} />
            <SkeletonCard lines={4} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-2xl border border-gray-200 border-dashed flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
              <PlusCircle className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">You haven't submitted any complaints yet.</p>
            <Link to="/submit" className="btn-primary text-sm px-5 py-2">Submit your first complaint</Link>
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
