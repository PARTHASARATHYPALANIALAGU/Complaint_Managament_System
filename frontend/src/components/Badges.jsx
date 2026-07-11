import { CheckCircle2, CircleDashed, Clock } from 'lucide-react'

export function StatusBadge({ status }) {
    if (status === 'Resolved') return <span className="badge-green"><CheckCircle2 className="w-3 h-3" /> Resolved</span>
    if (status === 'In Progress') return <span className="badge-blue"><Clock className="w-3 h-3" /> In Progress</span>
    return <span className="badge-yellow"><CircleDashed className="w-3 h-3" /> Pending</span>
}

export function PriorityBadge({ priority }) {
    if (priority === 'High') return <span className="badge-red">High Priority</span>
    if (priority === 'Medium') return <span className="badge-yellow">Medium Priority</span>
    return <span className="badge-blue">Low Priority</span>
}

export function SentimentBadge({ sentiment }) {
    if (sentiment === 'Negative') return <span className="badge-red">Negative</span>
    if (sentiment === 'Positive') return <span className="badge-green">Positive</span>
    return <span className="badge-gray">Neutral</span>
}
