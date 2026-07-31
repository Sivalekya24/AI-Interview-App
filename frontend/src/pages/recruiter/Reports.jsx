import { useEffect, useRef, useState } from 'react'
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale,
  DoughnutController, ArcElement, Tooltip,
} from 'chart.js'
import { getAllInterviews, getAllViolations } from '../../lib/api'
import { Card } from '../../components/ui/primitives'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, DoughnutController, ArcElement, Tooltip)

const CHART_COLORS = ['#3ddbd9', '#e8a33d', '#e5484d', '#7c8699']

function ScoreDistributionChart({ interviews }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const buckets = { '0-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
    interviews.forEach((iv) => {
      const s = iv.overall_score ?? 0
      if (s <= 40) buckets['0-40']++
      else if (s <= 60) buckets['41-60']++
      else if (s <= 80) buckets['61-80']++
      else buckets['81-100']++
    })

    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(buckets),
        datasets: [{ data: Object.values(buckets), backgroundColor: '#3ddbd9', borderRadius: 4, maxBarThickness: 40 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#7c8699', font: { size: 11 } } },
          y: { grid: { color: '#232935' }, ticks: { color: '#7c8699', font: { size: 11 } } },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [interviews])

  return <canvas ref={canvasRef} />
}

function ViolationBreakdownChart({ violations }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const counts = {}
    violations.forEach((v) => {
      const key = v.type ?? v.violation_type ?? 'other'
      counts[key] = (counts[key] ?? 0) + 1
    })

    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [{ data: Object.values(counts), backgroundColor: CHART_COLORS, borderWidth: 0 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#7c8699', font: { size: 11 }, padding: 12 } },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [violations])

  return <canvas ref={canvasRef} />
}

export default function Reports() {
  const [interviews, setInterviews] = useState([])
  const [violations, setViolations] = useState([])

  useEffect(() => {
    getAllInterviews().then(({ data }) => setInterviews(data.interviews ?? data)).catch((err) => {console.error(err); setInterviews([])})
    getAllViolations().then(({ data }) => setViolations(data.violations ?? data)).catch((err) => {console.error(err); setViolations([])})
  }, [])

  const avgScore = interviews.length
    ? Math.round(interviews.reduce((sum, iv) => sum + (iv.overall_score ?? 0), 0) / interviews.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Reports</h1>
        <p className="text-muted text-sm mt-1">Aggregate performance and proctoring trends</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="font-display text-2xl font-semibold text-signal">{avgScore}</p>
          <p className="text-xs text-muted mt-1">Average score</p>
        </Card>
        <Card className="p-5">
          <p className="font-display text-2xl font-semibold text-ink">{interviews.length}</p>
          <p className="text-xs text-muted mt-1">Interviews analyzed</p>
        </Card>
        <Card className="p-5">
          <p className="font-display text-2xl font-semibold text-alert">{violations.length}</p>
          <p className="text-xs text-muted mt-1">Total violations</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <p className="text-xs font-mono text-muted uppercase tracking-wide mb-4">Score distribution</p>
          <div className="h-56">
            <ScoreDistributionChart interviews={interviews} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-mono text-muted uppercase tracking-wide mb-4">Violation breakdown</p>
          <div className="h-56">
            <ViolationBreakdownChart violations={violations} />
          </div>
        </Card>
      </div>
    </div>
  )
}
