import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import ComplaintHistory from './pages/ComplaintHistory'
import AdminDashboard from './pages/AdminDashboard'
import Analytics from './pages/Analytics'

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth()
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!user) return <Navigate to="/login" replace />
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
    return children
}

export default function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen">
                <Navbar />
                <main className="pt-16">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
                        } />
                        <Route path="/submit" element={
                            <ProtectedRoute><SubmitComplaint /></ProtectedRoute>
                        } />
                        <Route path="/history" element={
                            <ProtectedRoute><ComplaintHistory /></ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute adminOnly><Analytics /></ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    )
}
