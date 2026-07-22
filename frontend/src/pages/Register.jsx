import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { User, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react'
import ParticleBackground from '../components/ParticleBackground'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const user = await register(name, email, password)
            toast.success(`Account created, welcome ${user.name}!`)
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden">
            <ParticleBackground />

            {/* Background glows */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-100 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-md glass-card p-8 animate-slide-up overflow-hidden">
                <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-50 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-indigo-50 rounded-full blur-3xl" />

                {/* Logo */}
                <div className="relative flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="relative text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-gray-500 mt-2">Join CampusVoice today</p>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 pl-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field pl-12"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 pl-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12"
                                placeholder="student@university.edu"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 pl-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500 relative">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Log in</Link>
                </p>
            </div>
        </div>
    )
}
