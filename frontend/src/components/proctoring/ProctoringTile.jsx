import {
  Eye,
  AlertTriangle,
  Clock3,
  BookOpen,
  Activity,
} from "lucide-react";

import { StatusDot } from "../ui/primitives";

export default function ProctoringTile({
  candidateName,
  violationCount = 0,
  status = "RUNNING",
  difficulty = "Easy",
  currentQuestion = 1,
  totalQuestions = 20,
  startedAt,
  onClick,
}) {

  const started = startedAt
    ? new Date(startedAt)
    : null;

  const duration = started
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - started.getTime()) / 60000
        )
      )
    : "--";

  return (

    <div
      onClick={onClick}
      className="
        cursor-pointer
        rounded-2xl
        border
        border-line
        bg-panel
        hover:border-[#0E4B8E]
        hover:shadow-xl
        transition-all
        duration-300
        p-6
        space-y-6
      "
    >

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold text-ink">

            {candidateName}

          </h2>

          <p className="text-sm text-muted mt-1">

            Candidate Interview

          </p>

        </div>

        <div className="flex items-center gap-2">

          <StatusDot status="live" />

          <span className="text-sm font-semibold text-green-600">

            {status}

          </span>

        </div>

      </div>

      {/* Interview Information */}

      <div className="rounded-2xl bg-void border border-line p-5 space-y-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <BookOpen
              size={18}
              className="text-[#0E4B8E]"
            />

            <span className="text-sm text-muted">

              Current Question

            </span>

          </div>

          <span className="font-semibold text-ink">

            {currentQuestion} / {totalQuestions}

          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Activity
              size={18}
              className="text-[#0E4B8E]"
            />

            <span className="text-sm text-muted">

              Difficulty

            </span>

          </div>

          <span className="font-semibold text-ink">

            {difficulty}

          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Clock3
              size={18}
              className="text-[#0E4B8E]"
            />

            <span className="text-sm text-muted">

              Duration

            </span>

          </div>

          <span className="font-semibold text-ink">

            {duration} min

          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-red-50 border border-red-100 p-4">

          <p className="text-xs text-gray-500">

            Violations

          </p>

          <div className="flex items-center gap-2 mt-2">

            <AlertTriangle
              size={18}
              className="text-red-600"
            />

            <span className="text-xl font-bold text-red-600">

              {violationCount}

            </span>

          </div>

        </div>

        <button
          onClick={(e) => {

            e.stopPropagation();

            onClick?.();

          }}
          className="
            rounded-2xl
            bg-[#0E4B8E]
            hover:bg-[#0B417C]
            text-white
            flex
            items-center
            justify-center
            gap-2
            font-semibold
            transition-all
          "
        >

          <Eye size={18} />

          Monitor

        </button>

      </div>

    </div>

  );

}