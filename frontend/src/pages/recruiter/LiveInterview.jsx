import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    Camera,
    ShieldAlert,
    User,
    Mail,
    FileText,
    Activity,
    Clock3,
    RefreshCcw,
    Ban,
} from "lucide-react";

import {
    Card,
    Button,
} from "../../components/ui/primitives";

import {
    getLiveInterview,
    terminateInterview,
} from "../../lib/api";

const REFRESH_INTERVAL = 4000;

export default function LiveInterview() {

    const navigate = useNavigate();

    const { interviewId } = useParams();

    
    const socketRef = useRef(null);

    const [frame, setFrame] = useState(null);

    const [loading, setLoading] = useState(true);

    

    const [terminating, setTerminating] = useState(false);

    const [interview, setInterview] = useState(null);

    const fetchInterview = async () => {

        try {

            const { data } =
                await getLiveInterview(interviewId);

            setInterview(data);

        }

        catch (err) {

            console.error(err);

            toast.error(
                "Unable to load interview"
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchInterview();

        const interval = setInterval(

            fetchInterview,

            REFRESH_INTERVAL

        );

        return () =>
            clearInterval(interval);

    }, [interviewId]);

    useEffect(() => {

    if (!interviewId) return;

    const socket = new WebSocket(

        `ws://127.0.0.1:8000/ws/recruiter/${interviewId}`

    );

    socketRef.current = socket;

    socket.onopen = () => {

        console.log("Recruiter Connected");

    };

    socket.onmessage = (event) => {

    const message = JSON.parse(event.data);

    console.log(message);

    if (message.type === "frame") {

        setFrame(
            `data:image/jpeg;base64,${message.data}`
        );

    }

};
    socket.onclose = () => {

        console.log("Recruiter Closed");

    };

    socket.onerror = (err) => {

        console.error(err);

    };

    return () => {

        socket.close();

    };

}, [interviewId]);

    const handleTerminate = async () => {

        if (

            !window.confirm(

                "Terminate this interview?"

            )

        ) {

            return;

        }

        try {

            setTerminating(true);

            await terminateInterview(interviewId);

            toast.success(
                "Interview terminated"
            );

            fetchInterview();

        }

        catch (err) {

            console.error(err);

            toast.error(
                "Unable to terminate interview"
            );

        }

        finally {

            setTerminating(false);

        }

    };
        if (loading) {

        return (

            <Card className="rounded-3xl p-12 shadow-lg text-center">

                Loading live interview...

            </Card>

        );

    }

    return (

        <div className="live-interview-page space-y-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <button

                        onClick={() =>
                            navigate("/recruiter/live")
                        }

                        className="flex items-center gap-2 live-interview-primary hover:underline"

                    >

                        <ArrowLeft size={18} />

                        Back to Live Proctoring

                    </button>

                   <h1 className="font-display text-4xl mt-4 live-interview-heading">

                        Live Interview

                    </h1>

                    <p className=" mt-2 live-interview-text">

                        Monitor the interview in real time.

                    </p>

                </div>

                <Button

                    onClick={fetchInterview}

                    className="rounded-xl live-interview-button"
                >

                    <RefreshCcw size={18} />

                    Refresh

                </Button>

            </div>

            <div className="grid grid-cols-12 gap-6">
                                <Card className="col-span-4 rounded-3xl p-6 shadow-lg">

                    <div className="flex items-center gap-3">

                        <User

                            className="live-interview-primary"
                            size={26}

                        />

                        <h2 className="font-display text-2xl">

                            Candidate

                        </h2>

                    </div>

                    <div className="mt-6 space-y-6">

                        <div>

                            <p className="text-sm live-interview-text">

                                Full Name

                            </p>

                            <h3 className="font-semibold text-lg">

                                {interview?.candidate_name}

                            </h3>

                        </div>

                        <div>

                            <p className="text-sm live-interview-text">

                                Email

                            </p>

                            <div className="flex items-center gap-2 mt-2">

                                <Mail size={16} />

                                <span>

                                    {interview?.candidate_email}

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="text-sm live-interview-text">

                                Resume

                            </p>

                            <div className="flex items-center gap-2 mt-2">

                                <FileText size={16} />

                                <span>

                                    {interview?.resume_filename ??

                                        "Not Available"}

                                </span>

                            </div>

                        </div>

                    </div>

                </Card>
                    <Card className="live-interview-card col-span-4 rounded-3xl p-6 shadow-lg">

                    <div className="flex items-center gap-3">

                        <Activity

                            size={26}

                            className="live-interview-primary"

                        />

                        <h2 className="font-display text-2xl">

                            Interview Status

                        </h2>

                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-8">

                        <div>

                            <p className="text-sm live-interview-text">

                                Status

                            </p>

                           <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
        interview?.status === "IN_PROGRESS"
            ? "bg-green-100 text-green-700"
            : interview?.status === "TERMINATED"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
    }`}
>

    {interview?.status}

</span>

                        </div>

                        <div>

                            <p className="text-sm live-interview-text">

                                Difficulty

                            </p>

                            <h3 className="font-semibold text-xl">

                                {interview?.difficulty}

                            </h3>

                        </div>

                        <div>

                            <p className="text-sm live-interview-text">

                                Current Question

                            </p>

                            <h3 className="font-semibold text-xl">

                                {interview?.current_question}/20

                            </h3>
                            <div className="mt-4">

    <div className="w-full h-3 rounded-full live-interview-progress-bg">

        <div

            className="h-3 rounded-full live-interview-progress"

            style={{

                width: `${

                    ((interview?.current_question ?? 0) / 20) * 100

                }%`

            }}

        />

    </div>

</div>

                        </div>

                        <div>

                            <p className="text-sm live-interview-text">

                                Started At

                            </p>

                            <div className="flex items-center gap-2 mt-2">

                                <Clock3 size={16} />

                                <span>

                                    {
    interview?.started_at
        ? new Date(
            interview.started_at
        ).toLocaleString()
        : "-"
}

                                </span>

                            </div>

                        </div>

                    </div>

                </Card>
                                {/* Live Camera */}

                <Card className="live-interview-card col-span-4 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-3">

                        <Camera
                            size={26}
                            className="live-interview-primary"
                        />

                        <h2 className="font-display text-2xl">

                            Live Camera Feed

                        </h2>

                    </div>

                    <div
                        className="
                            mt-6
                            rounded-2xl
                            live-interview-camera
                            h-[420px]
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                            "
                    >

                        {frame ? (

    <img
        src={frame}
        alt="Candidate"
        className="w-full h-full object-cover"
    />

) : (

    <div
        id="camera-placeholder"
        className="flex flex-col items-center gap-4"
    >

        <Camera
            size={70}
            className="text-gray-500"
        />

        <p className="live-interview-text text-lg">

            Waiting for candidate camera...

        </p>

    </div>

)}
                        
                    </div>

                </Card>

                {/* Violations */}

                <Card className="live-interview-card col-span-4 rounded-3xl p-6 shadow-lg">

                    <div className="flex items-center gap-3">

                        <ShieldAlert
                            size={26}
                            className="text-red-600"
                        />

                        <h2 className="font-display text-2xl">

                            Violations

                        </h2>

                    </div>

                    <div className="mt-6 space-y-4 max-h-[340px] overflow-y-auto">

                        {interview?.violations?.length > 0 ? (

                            interview.violations.map((violation) => (

                                <div

                                    key={violation.id}

                                    className="live-interview-violation rounded-2xl p-4"

                                >

                                    <h4 className="font-semibold live-interview-danger">

                                        {violation.type}

                                    </h4>

                                    <p className="text-sm live-interview-text mt-1">

                                        {violation.description}

                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">

                                        {violation.detected_at}

                                    </p>

                                </div>

                            ))

                        ) : (

                            <div className="text-center py-10 live-interview-text">

                                No violations detected

                            </div>

                        )}

                    </div>

                </Card>
                                {/* Recruiter Actions */}

                <Card className="live-interview-card col-span-12 rounded-3xl p-6 shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="font-display text-2xl">

                                Recruiter Actions

                            </h2>

                            <p className="live-interview-text mt-2">

                                Control the running interview.

                            </p>

                        </div>

                        <div className="flex gap-4">

                            <Button

                                onClick={fetchInterview}

                               className="rounded-xl live-interview-button"

                            >

                                <RefreshCcw size={18} />

                                Refresh

                            </Button>

                            <Button

                                onClick={handleTerminate}

                                disabled={terminating}

                               className="rounded-xl live-interview-danger-button"
                            >

                                <Ban size={18} />

                                {

                                    terminating

                                        ? "Terminating..."

                                        : "Terminate Interview"

                                }

                            </Button>

                        </div>

                    </div>

                </Card>
                            </div>

        </div>

    );

}