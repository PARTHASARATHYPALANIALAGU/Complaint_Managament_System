import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api/axiosInstance'
import {
  GraduationCap, LogOut, LayoutDashboard, PlusCircle,
  History, BarChart3, Shield, Bell, X, CheckCircle2, Clock,
  MessageSquare, AlertCircle, RefreshCw
} from 'lucide-react'

// ── Notification type → icon + color map ──────────────────────────────────
function NotifIcon({ type }) {
  if (type === 'NEW_COMPLAINT')
    return <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0"><AlertCircle className="w-3.5 h-3.5 text-blue-500" /></div>
  if (type === 'STATUS_UPDATE')
    return <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></div>
  if (type === 'NEW_MESSAGE')
    return <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0"><MessageSquare className="w-3.5 h-3.5 text-indigo-500" /></div>
  return <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Bell className="w-3.5 h-3.5 text-gray-400" /></div>
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const pollRef = useRef(null)

  // ── Fetch unread count (lightweight, runs every 30s) ──────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return
    try {
      const res = await api.get('/notifications/unread-count')
      setUnreadCount(res.data.unread_count)
    } catch (err) {
      // silently fail — don't disturb the UI
    }
  }, [user])

  // ── Fetch full notification list (only when dropdown is opened) ───────
  const fetchNotifications = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await api.get('/notifications/')
      setNotifications(res.data)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Poll unread count every 30 seconds
  useEffect(() => {
    if (!user) return
    fetchUnreadCount()
    pollRef.current = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(pollRef.current)
  }, [user, fetchUnreadCount])

  // Re-check count on route change
  useEffect(() => {
    fetchUnreadCount()
  }, [pathname, fetchUnreadCount])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const handleOpenNotif = async () => {
    const opening = !notifOpen
    setNotifOpen(opening)
    if (opening) {
      await fetchNotifications()
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const handleMarkOneRead = async (notifId) => {
    try {
      await api.patch(`/notifications/${notifId}/read`)
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      // silent
    }
  }

  const handleNotifClick = async (n) => {
    if (!n.is_read) {
      await handleMarkOneRead(n.id)
    }
    setNotifOpen(false)
    if (n.complaint_id) {
      const targetPath = user?.role === 'admin' ? '/admin' : '/history'
      navigate(`${targetPath}?id=${n.complaint_id}`)
    } else {
      if (user?.role === 'admin') navigate('/admin')
      else navigate('/history')
    }
  }

  const navLink = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
      ${pathname === to
        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      {icon}<span>{label}</span>
    </Link>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            CampusVoice
          </span>
        </Link>

        {/* Nav links */}
        {user && (
          <div className="flex items-center gap-1">
            {user.role === 'student' && (<>
              {navLink('/dashboard', <LayoutDashboard className="w-4 h-4" />, 'Dashboard')}
              {navLink('/submit',    <PlusCircle className="w-4 h-4" />,      'Submit')}
              {navLink('/history',   <History className="w-4 h-4" />,          'My Complaints')}
            </>)}
            {user.role === 'admin' && (<>
              {navLink('/admin',     <Shield className="w-4 h-4" />,    'Admin')}
              {navLink('/analytics', <BarChart3 className="w-4 h-4" />, 'Analytics')}
            </>)}
          </div>
        )}

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleOpenNotif}
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-[badge-pop_0.4s_ease-out]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-96 glass-card rounded-2xl overflow-hidden shadow-2xl animate-slide-up z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {loading && <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)}>
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-700 transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {loading && notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        <RefreshCw className="w-6 h-6 mx-auto mb-2 opacity-40 animate-spin" />
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer
                            ${n.is_read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50'}`}
                        >
                          <NotifIcon type={n.type} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${n.is_read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(n.created_at)}
                            </p>
                          </div>
                          {!n.is_read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="text-right hidden sm:block border-r border-gray-200 pr-4">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" /><span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login"    className="btn-ghost text-sm py-2 px-4">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
