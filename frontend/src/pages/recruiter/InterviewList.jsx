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
    <div className="interview-list-page">

    <div className="mb-8">

      <h1 className="interview-list-heading font-display text-4xl">
        Interviews
      </h1>

      <p className="interview-list-text mt-2">
        All completed and in-progress interviews
      </p>

    </div>

      <Card className="interview-list-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="interview-list-border text-left">
              <th className="px-5 py-3 text-xs font-mono interview-list-secondary uppercase tracking-wide">Candidate</th>
              <th className="px-5 py-3 text-xs font-mono interview-list-secondary uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-xs font-mono interview-list-secondary uppercase tracking-wide">Score</th>
              <th className="px-5 py-3 text-xs font-mono interview-list-secondary uppercase tracking-wide">Violations</th>
              <th className="px-5 py-3 text-xs font-mono interview-list-secondary uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="px-5 py-8 text-center interview-list-empty">Loading…</td></tr>
            )}
            {!isLoading && interviews.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center interview-list-empty">No interviews yet</td></tr>
            )}
            {interviews.map((iv) => (
              <tr
                key={iv.id}
                onClick={() => navigate(`/recruiter/interviews/${iv.id}`)}
                className="interview-list-row last:border-0 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3 interview-list-heading">{iv.candidate_name ?? `#${iv.id}`}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-xs font-mono interview-list-secondary">
                    <StatusDot status={iv.status?.toUpperCase() === 'IN_PROGRESS' ? 'live' : 'idle'} />
                    {iv.status ?? 'completed'}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono interview-list-heading">{iv.overall_score ?? '—'}</td>
                <td className="px-5 py-3 font-mono interview-list-danger">{iv.violation_count ?? 0}</td>
                <td className="px-5 py-3 interview-list-secondary font-mono text-xs">
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
