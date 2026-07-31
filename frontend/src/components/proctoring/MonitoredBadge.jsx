export default function MonitoredBadge({ label = 'MONITORED' }) {
  return (
    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-void/70 backdrop-blur px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-alert animate-pulse" />
      <span className="text-xs font-mono text-ink">{label}</span>
    </div>
  )
}
