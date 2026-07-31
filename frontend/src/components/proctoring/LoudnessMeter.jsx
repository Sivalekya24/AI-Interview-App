import { motion } from 'framer-motion'

export default function LoudnessMeter({ level = 0 }) {
  return (
    <div>
      <p className="text-xs font-mono text-muted uppercase tracking-wide mb-2">Mic level</p>
      <div className="h-1.5 bg-void rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-signal"
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}
