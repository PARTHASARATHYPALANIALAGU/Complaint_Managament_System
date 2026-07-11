import { StatusBadge, PriorityBadge, SentimentBadge } from './Badges'
import { Calendar, Tag, Bot } from 'lucide-react'

export default function ComplaintCard({ complaint, showAi = false, onClick }) {
    const dateStr = new Date(complaint.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    })

    const p = complaint.ai_prediction

    return (
        <div
            onClick={onClick}
            className={`glass-card p-5 group flex flex-col gap-4 transition-all duration-300
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-2xl' : ''}`}
        >
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {complaint.title}
                    </h3>
                    <p className="text-sm text-white/60 line-clamp-2 mt-1">
                        {complaint.description}
                    </p>
                </div>
                <div className="shrink-0">
                    <StatusBadge status={complaint.status} />
                </div>
            </div>

            {p && (
                <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2 py-1 rounded-md">
                        <Tag className="w-3.5 h-3.5" />
                        {p.category || 'Categorization Pending'}
                    </div>

                    {showAi && (<>
                        <PriorityBadge priority={p.priority} />
                        <SentimentBadge sentiment={p.sentiment} />
                        <div className="flex items-center gap-1.5 text-xs text-white/40 ml-auto" title={`Analyzed by ${p.model_used}`}>
                            <Bot className="w-3.5 h-3.5" /> AI Analyzed
                        </div>
                    </>)}

                    {!showAi && (
                        <div className="flex items-center gap-1.5 text-xs text-white/40 ml-auto">
                            <Calendar className="w-3 h-3" /> {dateStr}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
