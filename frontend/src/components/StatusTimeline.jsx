import { CheckCircle, Clock, Loader2, Circle } from 'lucide-react'

const STEPS = [
  { key: 'Pending',     label: 'Submitted',   icon: Clock },
  { key: 'In Progress', label: 'In Progress', icon: Loader2 },
  { key: 'Resolved',    label: 'Resolved',    icon: CheckCircle },
]

const stepIndex = (status) => {
  if (status === 'Pending')     return 0
  if (status === 'In Progress') return 1
  if (status === 'Resolved')    return 2
  return 0
}

export default function StatusTimeline({ status, compact = false }) {
  const current = stepIndex(status)

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const done    = i < current
          const active  = i === current
          const pending = i > current

          return (
            <div key={step.key} className="flex items-center gap-1">
              {/* Circle */}
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-500
                  ${compact ? 'w-5 h-5' : 'w-7 h-7'}
                  ${done    ? 'bg-emerald-50 border border-emerald-200' : ''}
                  ${active  ? 'bg-blue-50 border border-blue-200 ring-2 ring-blue-100' : ''}
                  ${pending ? 'bg-gray-50 border border-gray-200' : ''}
                `}
              >
                {done && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                {active && step.key === 'In Progress' && <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />}
                {active && step.key !== 'In Progress' && <Circle className="w-2 h-2 text-blue-600 fill-blue-600" />}
                {pending && <Circle className="w-2 h-2 text-gray-300" />}
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className={`h-px w-4 transition-all duration-700 ${i < current ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
        <span className={`ml-2 text-xs font-medium
          ${status === 'Resolved'    ? 'text-emerald-600' : ''}
          ${status === 'In Progress' ? 'text-blue-600' : ''}
          ${status === 'Pending'     ? 'text-amber-600' : ''}
        `}>
          {status}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center w-full gap-0">
      {STEPS.map((step, i) => {
        const done    = i < current
        const active  = i === current
        const pending = i > current
        const Icon    = step.icon

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${done    ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : ''}
                  ${active  ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-md shadow-blue-500/10' : ''}
                  ${pending ? 'bg-gray-50 border-gray-200 text-gray-400' : ''}
                `}
              >
                {done && <CheckCircle className="w-4 h-4" />}
                {active && step.key === 'In Progress' && <Loader2 className="w-4 h-4 animate-spin" />}
                {active && step.key !== 'In Progress' && <Icon className="w-4 h-4" />}
                {pending && <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap
                ${done    ? 'text-emerald-600' : ''}
                ${active  ? 'text-blue-600'    : ''}
                ${pending ? 'text-gray-400'    : ''}
              `}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-700
                ${i < current ? 'bg-gradient-to-r from-emerald-400 to-blue-400' : 'bg-gray-200'}
              `} />
            )}
          </div>
        )
      })}
    </div>
  )
}
