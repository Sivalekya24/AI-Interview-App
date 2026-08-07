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
    <div className="violations-page space-y-6">
      <div>
        <h1 className="violations-heading font-display text-2xl font-semibold flex items-center gap-2">
          <ShieldAlert size={20} className="text-alert" /> Violations
        </h1>
        <p className="violations-text text-sm mt-1">Proctoring flags across all interviews</p>
      </div>

      <Card className="violations-card divide-y">
        {isLoading && <p className="p-6 violations-text text-sm">Loading…</p>}
        {!isLoading && violations.length === 0 && (
          <p className="p-6 violations-text text-sm">No violations recorded.</p>
        )}
        {violations.map((v, i) => (
          <Link
            key={v.id ?? i}
            to={`/recruiter/interviews/${v.interview_id}`}
           className="violations-row flex items-center justify-between px-5 py-4 transition-colors"
          >
            <div>
              <p className="violations-heading text-sm font-medium">
                {violationLabel(v.type ?? v.violation_type)}
              </p>
              <p className="text-xs violations-text mt-0.5 font-mono">
                {v.candidate_name ?? `Interview #${v.interview_id}`}
              </p>
            </div>
            <span className="violations-text text-xs font-mono">
              {v.timestamp ? new Date(v.timestamp).toLocaleString() : ''}
            </span>
          </Link>
        ))}
      </Card>
    </div>
  )
}
