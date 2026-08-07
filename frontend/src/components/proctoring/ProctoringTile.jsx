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
      proctoring-tile
      cursor-pointer
      rounded-2xl
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

          <h2 className="proctoring-tile-heading text-xl font-bold">

            {candidateName}

          </h2>

          <p className="proctoring-tile-text text-sm mt-1">

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

      <div className="proctoring-tile-panel rounded-2xl p-5 space-y-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <BookOpen
              size={18}
              className="proctoring-tile-primary"
            />

            <span className="text-sm proctoring-tile-text">

              Current Question

            </span>

          </div>

          <span className="proctoring-tile-heading font-semibold">

            {currentQuestion} / {totalQuestions}

          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Activity
              size={18}
              className="proctoring-tile-primary"
            />

            <span className="text-sm proctoring-tile-text">

              Difficulty

            </span>

          </div>

          <span className="proctoring-tile-heading font-semibold">

            {difficulty}

          </span>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Clock3
              size={18}
              className="proctoring-tile-primary"
            />

            <span className="text-sm proctoring-tile-text">

              Duration

            </span>

          </div>

          <span className="proctoring-tile-heading font-semibold">

            {duration} min

          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-4">

        <div className="proctoring-tile-danger-box rounded-2xl p-4">

          <p className="proctoring-tile-text text-xs">

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
          proctoring-tile-button
          rounded-2xl
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