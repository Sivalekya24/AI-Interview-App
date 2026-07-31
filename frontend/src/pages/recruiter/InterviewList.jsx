import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllInterviews } from '../../lib/api'
import { Card, StatusDot } from '../../components/ui/primitives'

export default function InterviewList() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllInterviews()
      .then(({ data }) => setInterviews(data.interviews ?? data))
      .catch((err) => {

    console.error(err)

    setInterviews([])

})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Interviews</h1>
        <p className="text-muted text-sm mt-1">All completed and in-progress interviews</p>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">Candidate</th>
              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">Score</th>
              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">Violations</th>
              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">Loading…</td></tr>
            )}
            {!isLoading && interviews.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No interviews yet</td></tr>
            )}
            {interviews.map((iv) => (
              <tr
                key={iv.id}
                onClick={() => navigate(`/recruiter/interviews/${iv.id}`)}
                className="border-b border-line last:border-0 hover:bg-panel-raised cursor-pointer transition-colors"
              >
                <td className="px-5 py-3 text-ink">{iv.candidate_name ?? `#${iv.id}`}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-xs font-mono text-muted">
                    <StatusDot status={iv.status?.toUpperCase() === 'IN_PROGRESS' ? 'live' : 'idle'} />
                    {iv.status ?? 'completed'}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-ink">{iv.overall_score ?? '—'}</td>
                <td className="px-5 py-3 font-mono text-alert">{iv.violation_count ?? 0}</td>
                <td className="px-5 py-3 text-muted font-mono text-xs">
                  {iv.created_at ? new Date(iv.created_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
