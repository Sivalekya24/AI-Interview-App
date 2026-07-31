import { useEffect, useRef } from "react";

export default function useWindowBlur({
    enabled = true,
    onViolation,
}) {

    const count = useRef(0);

    useEffect(() => {

        if (!enabled) return;

        const handleBlur = () => {

            count.current += 1;

            if (onViolation) {

                onViolation({

                    type: "WINDOW_BLUR",

                    count: count.current,

                    timestamp: new Date().toISOString(),

                });

            }

        };

        window.addEventListener(
            "blur",
            handleBlur
        );

        return () => {

            window.removeEventListener(
                "blur",
                handleBlur
            );

        };

    }, [enabled, onViolation]);

}