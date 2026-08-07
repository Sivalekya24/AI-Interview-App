import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio } from "lucide-react";

import { getLiveInterviews } from "../../lib/api";
import { Card } from "../../components/ui/primitives";
import ProctoringTile from "../../components/proctoring/ProctoringTile";

const POLL_INTERVAL_MS = 4000;

export default function LiveProctoring() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchLiveInterviews = async () => {

            try {

                const { data } =
                    await getLiveInterviews();
                console.log("LIVE API RESPONSE:", data);    

                setInterviews(data
                );

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        };

        fetchLiveInterviews();

        const interval = setInterval(
            fetchLiveInterviews,
            POLL_INTERVAL_MS
        );

        return () =>
            clearInterval(interval);

    }, []);

    return (

        <div className="live-proctoring-page space-y-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                   <h1 className="live-proctoring-heading font-display text-4xl flex items-center gap-3">

                        <Radio
                            size={28}
                           className="live-proctoring-primary"
                        />

                        Live Proctoring

                    </h1>

                    <p className="live-proctoring-text text-gray-500 mt-3">

                        Monitor all interviews currently in progress.

                    </p>

                </div>

                <div className="live-proctoring-box rounded-2xl px-6 py-4">

                    <p className="text-sm live-proctoring-text">

                        Active Interviews

                    </p>

                    <h2 className="font-display text-3xl live-proctoring-heading mt-1">

                        {interviews.length}

                    </h2>

                </div>

            </div>

            {/* Loading */}

            {loading && (

               <Card className="live-proctoring-card rounded-3xl border-0 shadow-lg p-12 text-center">

                    Loading live interviews...

                </Card>

            )}

            {/* Empty */}

            {!loading &&
                interviews.length === 0 && (

                <Card className="live-proctoring-card rounded-3xl border-0 shadow-lg p-14">

                    <div className="flex flex-col items-center">

                        <Radio
                            size={60}
                            className="live-proctoring-muted"
                        />

                        <h2 className="live-proctoring-heading font-display text-3xl mt-6">

                            No Live Interviews

                        </h2>

                        <p className="live-proctoring-text  mt-3">

                            There are currently no interviews running.

                        </p>

                    </div>

                </Card>

            )}

            {/* Cards */}

            {!loading &&
                interviews.length > 0 && (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {interviews.map((interview) => (

                        <ProctoringTile

                            key={interview.id}

                            candidateName={
                                interview.candidate_name ??
                                `Candidate #${interview.id}`
                            }

                            status={
                                interview.status ??
                                "RUNNING"
                            }

                            difficulty={
                                interview.difficulty ??
                                "Easy"
                            }

                            currentQuestion={
                                interview.current_question ??
                                1
                            }

                            totalQuestions={20}

                            startedAt={
                                interview.started_at
                            }

                            violationCount={
                                interview.violation_count ??
                                0
                            }

                            onClick={() =>
                                navigate(
                                    `/recruiter/live/${interview.id}`
                                )
                            }

                        />

                    ))}

                </div>

            )}

        </div>

    );

}