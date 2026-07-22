import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import toast from 'react-hot-toast'
import { Sparkles, Paperclip, Send, Brain, Tag, Zap, AlertTriangle, X } from 'lucide-react'

// ── Local AI preview logic (keyword-based, no API call) ──
const CATEGORY_KEYWORDS = {
  'IT & Internet': ['wifi', 'internet', 'network', 'laptop', 'computer', 'server', 'password', 'login', 'system', 'software', 'portal', 'email'],
  'Hostel & Accommodation': ['hostel', 'room', 'dorm', 'bed', 'water', 'bathroom', 'toilet', 'leakage', 'electricity', 'fan', 'ac', 'heater', 'dormitory'],
  'Academic & Faculty': ['professor', 'teacher', 'class', 'lecture', 'exam', 'grade', 'marks', 'syllabus', 'assignment', 'faculty', 'attendance', 'course'],
  'Food & Canteen': ['food', 'canteen', 'cafeteria', 'mess', 'meal', 'eating', 'dining', 'lunch', 'breakfast', 'dinner', 'hygiene', 'cook'],
  'Safety & Security': ['security', 'safety', 'theft', 'stolen', 'harassment', 'threat', 'danger', 'cctv', 'guard', 'violence', 'bully'],
  'Infrastructure': ['building', 'road', 'construction', 'lift', 'elevator', 'lab', 'library', 'ground', 'sports', 'cleanliness', 'garbage', 'repair'],
}

const PRIORITY_KEYWORDS = {
  High: ['urgent', 'immediately', 'emergency', 'critical', 'serious', 'dangerous', 'broken', 'not working', 'failed', 'harassment', 'violence', 'stolen', 'threat'],
  Low:  ['suggestion', 'minor', 'small', 'improvement', 'slight', 'enhance', 'request'],
}

function predictCategory(text) {
  const lower = text.toLowerCase()
  let bestCat = null
  let bestScore = 0
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = words.filter(w => lower.includes(w)).length
    if (score > bestScore) { bestScore = score; bestCat = cat }
  }
  return bestScore > 0 ? bestCat : null
}

function predictPriority(text) {
  const lower = text.toLowerCase()
  if (PRIORITY_KEYWORDS.High.some(w => lower.includes(w))) return 'High'
  if (PRIORITY_KEYWORDS.Low.some(w => lower.includes(w))) return 'Low'
  return 'Medium'
}

const PRIORITY_COLORS = {
  High:   'text-red-700 border-red-200 bg-red-50',
  Medium: 'text-amber-700 border-amber-200 bg-amber-50',
  Low:    'text-emerald-700 border-emerald-200 bg-emerald-50',
}

const MAX_DESC = 1000

export default function SubmitComplaint() {
  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage]             = useState(null)
  const [loading, setLoading]         = useState(false)
  const [preview, setPreview]         = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const previewTimer = useRef(null)
  const navigate = useNavigate()

  // Real-time AI preview — debounced 450ms
  useEffect(() => {
    clearTimeout(previewTimer.current)
    const combinedText = `${title} ${description}`.trim()

    if (combinedText.length < 10) {
      setShowPreview(false)
      return
    }

    previewTimer.current = setTimeout(() => {
      const category = predictCategory(combinedText)
      const priority = predictPriority(combinedText)
      if (category) {
        setPreview({ category, priority })
        setShowPreview(true)
      } else {
        setShowPreview(false)
      }
    }, 450)

    return () => clearTimeout(previewTimer.current)
  }, [title, description])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      return toast.error('Title and description are required')
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

  const descLeft = MAX_DESC - description.length
  const descColor = descLeft < 100 ? 'text-red-500' : descLeft < 200 ? 'text-amber-500' : 'text-gray-400'

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Submit a Complaint
        </h1>
        <p className="text-gray-500">
          Describe your issue in detail. Our{' '}
          <span className="text-blue-600 font-medium inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />AI Assistant
          </span>{' '}
          will automatically categorize it and assign priority.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="glass-card p-8">
          <div className="space-y-6">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title (Short Summary)</label>
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

            {/* Description with character counter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Detailed Description</label>
                <span className={`text-xs font-mono ${descColor} transition-colors`}>
                  {descLeft} chars left
                </span>
              </div>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                className="input-field min-h-[160px] resize-y"
                placeholder="Please provide all necessary details about your problem..."
              />
            </div>

            {/* Attachment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Attachment (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
                >
                  <Paperclip className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {image ? (
                      <span className="text-blue-600 font-medium">{image.name}</span>
                    ) : (
                      'Click to upload an image'
                    )}
                  </span>
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2 mt-4">
              {loading ? 'Processing...' : 'Submit to AI Engine'}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* ── Real-time AI Preview Panel ── */}
        {showPreview && preview && (
          <div className="ai-preview animate-ai-glow animate-slide-up bg-blue-50/50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Live AI Preview</p>
                <p className="text-[10px] text-gray-500">Based on your text — Gemini will confirm on submit</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs text-blue-600">Analyzing</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Tag className="w-3.5 h-3.5" /> Predicted Category
                </div>
                <p className="text-sm font-semibold text-gray-900">{preview.category}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  {preview.priority === 'High'
                    ? <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    : <Zap className="w-3.5 h-3.5" />
                  } Predicted Priority
                </div>
                <span className={`text-sm font-bold border px-2 py-0.5 rounded-lg w-fit ${PRIORITY_COLORS[preview.priority]}`}>
                  {preview.priority}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-3 text-center">
              ✦ This is a local keyword preview. Final classification by Gemini may differ.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
