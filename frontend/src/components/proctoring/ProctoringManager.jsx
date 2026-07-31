import { useCallback, useEffect,useRef, useState } from "react";

import WarningModal from "./WarningModal";

import useTabSwitch from "../../hooks/useTabSwitch";
import useFullscreen from "../../hooks/useFullscreen";
import useWindowBlur from "../../hooks/useWindowBlur";

import { reportViolation } from "../../lib/api";

const MAX_VIOLATIONS = 5;

const VIOLATION_MESSAGES = {
    FULLSCREEN_EXIT:
        "You exited fullscreen mode. Please return to fullscreen before continuing the interview.",

    TAB_SWITCH:
        "You switched to another browser tab. Please stay on the interview page.",

    WINDOW_BLUR:
        "The interview window lost focus. Please return to the interview window.",
};

export default function ProctoringManager({
    interviewId,
    onViolation,
}) {

    const [warning, setWarning] = useState(null);

    const [count, setCount] = useState(0);

    const lastViolationRef = useRef({
    type: null,
    time: 0,
});

    const handleViolation = useCallback(async ({ type }) => {

        const now = Date.now();

        if (now - lastViolationRef.current.time < 1000) {
            return;
        }

        lastViolationRef.current = {
            type,
            time: now,
        };

        setCount((prev) => {

            const total = prev + 1;

            setWarning({
                title: "Security Warning",
                message:
                    VIOLATION_MESSAGES[type] ??
                    `${type.replaceAll("_", " ")} detected.`,
                count: total,
            });

            return total;
        });

        try {

            await reportViolation({
                interview_id: interviewId,
                violation_type: type,
            });

            onViolation?.(type);

        } catch (err) {

            console.error(err);

        }

    }, [count, interviewId, onViolation]);

    useTabSwitch({
        enabled: !!interviewId,
        onViolation: handleViolation,
    });

    useFullscreen({
        enabled: !!interviewId,
        onViolation: handleViolation,
    });

    useWindowBlur({
        enabled: !!interviewId,
        onViolation: handleViolation,
    });

    useEffect(() => {
    if (count >= MAX_VIOLATIONS) {

        toast.error(
            "Interview terminated due to repeated violations."
        );

        window.speechSynthesis.cancel();

        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        window.location.href = "/candidate/dashboard";
    }
}, [count]);

    const handleResume = async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement.requestFullscreen();

            }

            setWarning(null);

        } catch (err) {

            console.error(err);

            alert(
                "Fullscreen mode is required to continue the interview."
            );

        }

    };

    return (

        <WarningModal
            open={!!warning}
            title={warning?.title}
            message={warning?.message}
            count={warning?.count}
            onClose={handleResume}
        />

    );

}