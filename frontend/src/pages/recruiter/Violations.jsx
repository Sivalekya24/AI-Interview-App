import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { getAllViolations } from '../../lib/api'
import { Card } from '../../components/ui/primitives'
import { violationLabel } from '../../components/proctoring/ViolationBadge'

export default function Violations() {
  const [violations, setViolations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllViolations()
      .then(({ data }) => setViolations(data.violations ?? data))
      .catch(() => setViolations([]))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
          <ShieldAlert size={20} className="text-alert" /> Violations
        </h1>
        <p className="text-muted text-sm mt-1">Proctoring flags across all interviews</p>
      </div>

      <Card className="divide-y divide-line">
        {isLoading && <p className="p-6 text-muted text-sm">Loading…</p>}
        {!isLoading && violations.length === 0 && (
          <p className="p-6 text-muted text-sm">No violations recorded.</p>
        )}
        {violations.map((v, i) => (
          <Link
            key={v.id ?? i}
            to={`/recruiter/interviews/${v.interview_id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-panel-raised transition-colors"
          >
            <div>
              <p className="text-sm text-ink font-medium">
                {violationLabel(v.type ?? v.violation_type)}
              </p>
              <p className="text-xs text-muted mt-0.5 font-mono">
                {v.candidate_name ?? `Interview #${v.interview_id}`}
              </p>
            </div>
            <span className="text-xs text-muted font-mono">
              {v.timestamp ? new Date(v.timestamp).toLocaleString() : ''}
            </span>
          </Link>
        ))}
      </Card>
    </div>
  )
}
