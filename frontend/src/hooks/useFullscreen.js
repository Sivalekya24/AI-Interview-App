import { useEffect, useRef } from "react";

export default function useFullscreen({
    enabled = true,
    onViolation,
}) {

    const count = useRef(0);

    useEffect(() => {

        if (!enabled) return;

        const handleFullscreen = () => {

            if (!document.fullscreenElement) {

                count.current += 1;

                if (onViolation) {

                    onViolation({

                        type: "FULLSCREEN_EXIT",

                        count: count.current,

                        timestamp: new Date().toISOString(),

                    });

                }

            }

        };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreen
        );

        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleFullscreen
            );

        };

    }, [enabled, onViolation]);

}