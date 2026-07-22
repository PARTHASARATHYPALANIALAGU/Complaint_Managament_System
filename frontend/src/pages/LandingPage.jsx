import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import {
  GraduationCap, Sparkles, ShieldCheck, BarChart3,
  ArrowRight, Zap, Clock, CheckCircle, Star, ChevronRight
} from 'lucide-react'
import ParticleBackground from '../components/ParticleBackground'

const FEATURES = [
  {
    icon: Sparkles,
    color: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20',
    title: 'Gemini AI Engine',
    desc: 'Google Gemini automatically categorizes every complaint, detects sentiment, and generates admin action plans in seconds.',
  },
  {
    icon: Zap,
    color: 'from-indigo-500 to-indigo-600',
    glow: 'shadow-indigo-500/20',
    title: 'Real-Time Priority',
    desc: 'Complaints are instantly scored by urgency — High, Medium, or Low — so the right issues get resolved first.',
  },
  {
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    title: 'Analytics Dashboard',
    desc: 'Deep insights: category breakdowns, sentiment trends, resolution rates, and monthly submission charts.',
  },
  {
    icon: ShieldCheck,
    color: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    title: 'Admin Command Center',
    desc: 'Powerful admin panel with filtering, search, evidence viewing, and one-click status updates.',
  },
  {
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    title: 'Status Tracking',
    desc: 'Students can track every complaint in real-time from Pending → In Progress → Resolved.',
  },
  {
    icon: CheckCircle,
    color: 'from-cyan-500 to-sky-600',
    glow: 'shadow-cyan-500/20',
    title: 'ML Fallback Engine',
    desc: 'If Gemini is unavailable, a TF-IDF + Logistic Regression model ensures zero downtime for analysis.',
  },
]

const STATS = [
  { value: '500+', label: 'Complaints Managed' },
  { value: '98%',  label: 'AI Accuracy' },
  { value: '<2s',  label: 'Analysis Time' },
  { value: '6',    label: 'Categories' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Student submits', desc: 'Fill in a title, description, and optional image attachment.' },
  { step: '02', title: 'AI analyzes',     desc: 'Gemini categorizes, scores sentiment, and writes an admin recommendation.' },
  { step: '03', title: 'Admin reviews',   desc: 'Admin sees AI insights, takes action, and updates status.' },
  { step: '04', title: 'Student notified',desc: 'Status updates appear instantly in the student dashboard.' },
]

export default function LandingPage() {
  const { user } = useAuth()

  // Redirect logged-in users to their dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center pt-20 pb-16">
        <ParticleBackground />

        {/* Badge */}
        <div
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium mb-8 animate-fade-in shadow-sm"
          style={{ animationDelay: '0ms' }}
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          Powered by Google Gemini AI
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-1" />
        </div>

        {/* Main heading */}
        <h1
          className="relative text-5xl md:text-7xl font-black leading-tight mb-6 animate-slide-up"
          style={{ animationDelay: '80ms' }}
        >
          <span className="hero-text">CampusVoice</span>
          <br />
          <span className="text-gray-900 text-4xl md:text-5xl font-bold mt-2 block">
            AI-Powered Complaint
            <br className="hidden md:block" />
            {' '}Management
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="relative text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: '160ms' }}
        >
          Submit campus complaints and watch Gemini AI instantly categorize them, 
          score their priority, and generate admin action plans — all in under 2 seconds.
        </p>

        {/* CTA Buttons */}
        <div
          className="relative flex flex-col sm:flex-row gap-4 animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <Link
            to="/register"
            className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="btn-ghost flex items-center justify-center gap-2 text-base px-8 py-4 bg-white shadow-sm"
          >
            Sign In
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="relative mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass-card px-4 py-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <p className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything your campus needs
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            A complete ecosystem from student submission to admin resolution, backed by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="glass-card p-6 group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md ${f.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600 text-lg">From complaint to resolution in four simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gray-200" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="flex flex-col items-center text-center group">
                <div className="relative w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center mb-4 group-hover:border-blue-300 group-hover:shadow-md group-hover:bg-blue-100 transition-all duration-300 z-10 bg-white">
                  <span className="text-xs font-bold text-blue-600 mb-0.5">{step.step}</span>
                  <Star className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BOTTOM ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto glass-card bg-blue-50/50 p-12 text-center relative overflow-hidden border-blue-100">
          <div className="relative">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform campus experience?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Join students and admins already using CampusVoice to resolve issues faster with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 shadow-lg shadow-blue-500/20">
                Create Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-ghost bg-white flex items-center justify-center gap-2 px-8 py-4 shadow-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-200 bg-white">
        © 2025 CampusVoice — AI Campus Complaint Management System
      </footer>
    </div>
  )
}
