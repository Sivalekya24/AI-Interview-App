export const VIOLATION_LABELS = {
  no_face: 'No face detected',
  multiple_faces: 'Multiple faces detected',
  mobile_detected: 'Mobile phone detected',
  loud_voice: 'Loud voice detected',
  lip_sync_mismatch: 'Lip sync mismatch',
}

export function violationLabel(type) {
  return VIOLATION_LABELS[type] ?? type ?? 'Unknown violation'
}

export default function ViolationBadge({ type, severity, className = '' }) {
  return (
    <span
className={`violation-badge inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded ${className}`}
    >
      {violationLabel(type)}
      {severity && <span className="opacity-60">· {severity}</span>}
    </span>
  )
}
