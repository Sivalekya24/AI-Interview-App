import { useEffect, useRef } from "react";

export default function useTabSwitch({
    enabled = true,
    onViolation,
}) {

    const count = useRef(0);

    useEffect(() => {

        if (!enabled) return;

        const handleVisibility = () => {

            if (document.visibilityState === "hidden") {

                count.current += 1;

                if (onViolation) {

                    onViolation({

                        type: "TAB_SWITCH",

                        count: count.current,

                        timestamp: new Date().toISOString(),

                    });

                }

            }

        };

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );

        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );

        };

    }, [enabled, onViolation]);

}