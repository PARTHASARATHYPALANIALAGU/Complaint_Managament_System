import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import toast from 'react-hot-toast'
import { Sparkles, Paperclip, Send } from 'lucide-react'

export default function SubmitComplaint() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) {
            return toast.error("Title and description are required")
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        if (image) formData.append('image', image)

        const toastId = toast.loading('Submitting and running AI analysis...')

        try {
            await api.post('/complaints/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            toast.success('Complaint submitted and analyzed successfully', { id: toastId })
            navigate('/history')
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to submit complaint', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 animate-fade-in pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                    Submit a Complaint
                </h1>
                <p className="text-white/60">
                    Describe your issue in detail. Our <span className="text-blue-300 font-medium inline-flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />AI Assistant</span> will automatically categorize it and assign priority.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-8">
                <div className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Title (Short Summary)</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field"
                            placeholder="e.g. WiFi is not working in Hostel Block C"
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Detailed Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field min-h-[160px] resize-y"
                            placeholder="Please provide all necessary details about your problem..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Attachment (Optional)</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <label htmlFor="file-upload" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200">
                                <Paperclip className="w-6 h-6 text-white/40" />
                                <span className="text-sm text-white/60">
                                    {image ? image.name : "Click to upload an image"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2 mt-4">
                        {loading ? 'Processing...' : 'Submit to AI Engine'}
                        {!loading && <Send className="w-4 h-4" />}
                    </button>
                </div>
            </form>
        </div>
    )
}
