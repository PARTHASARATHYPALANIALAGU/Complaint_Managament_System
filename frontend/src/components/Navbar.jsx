import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, LogOut, LayoutDashboard, PlusCircle, History, BarChart3, Shield } from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleLogout = () => { logout(); navigate('/login') }

    const navLink = (to, icon, label) => (
        <Link
            to={to}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
        ${pathname === to ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
            {icon}<span>{label}</span>
        </Link>
    )

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        CampusVoice
                    </span>
                </Link>

                {/* Nav links */}
                {user && (
                    <div className="flex items-center gap-1">
                        {user.role === 'student' && (<>
                            {navLink('/dashboard', <LayoutDashboard className="w-4 h-4" />, 'Dashboard')}
                            {navLink('/submit', <PlusCircle className="w-4 h-4" />, 'Submit')}
                            {navLink('/history', <History className="w-4 h-4" />, 'My Complaints')}
                        </>)}
                        {user.role === 'admin' && (<>
                            {navLink('/admin', <Shield className="w-4 h-4" />, 'Admin')}
                            {navLink('/analytics', <BarChart3 className="w-4 h-4" />, 'Analytics')}
                        </>)}
                    </div>
                )}

                {/* Right */}
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-white/40 capitalize">{user.role}</p>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                            <LogOut className="w-4 h-4" /><span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                        <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
