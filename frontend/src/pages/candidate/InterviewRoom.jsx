import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mic, Square, Loader2, Volume2 } from 'lucide-react'
import { startInterview, submitVoiceAnswer, faceCheck,getLiveInterview } from '../../lib/api'
import { Card } from '../../components/ui/primitives'
import MonitoredBadge from '../../components/proctoring/MonitoredBadge'
import LoudnessMeter from '../../components/proctoring/LoudnessMeter'
import ProctoringManager from "../../components/proctoring/ProctoringManager";

const TOTAL_QUESTIONS = 20
const FACE_CHECK_INTERVAL_MS = 5000
const STATUS_CHECK_INTERVAL_MS = 3000
export default function InterviewRoom() {
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const interviewStartedRef = useRef(false);
  const localStreamRef = useRef(null)
  const streamRef = useRef(null)
  const socketRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const [interviewId, setInterviewId] = useState(null)
  const [question, setQuestion] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [loudness, setLoudness] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [liveWords, setLiveWords] = useState('')

  // ---- start interview / first question ----
  useEffect(() => {
    if (interviewStartedRef.current) {
        return;
    }

    interviewStartedRef.current = true;

    
    startInterview()
  .then(({ data }) => {

    console.log(data)

    setInterviewId(data.interview_id)

    // ----------------------------
// WebSocket Connection
// ----------------------------

const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/candidate/${data.interview_id}`
);

socket.onopen = () => {

    console.log("✅ Candidate WebSocket Connected");

    socket.send(
        JSON.stringify({
            type: "INTERVIEW_STARTED",
            interviewId: data.interview_id,
        })
    );

};

socket.onmessage = (event) => {

    const message = JSON.parse(event.data);

    console.log(message);

    
    if (message.type === "TERMINATED") {

        window.speechSynthesis.cancel();

        mediaRecorderRef.current?.stop();

        if (document.fullscreenElement) {

            document.exitFullscreen();

        }

        toast.error(
            "Interview terminated by recruiter."
        );

        socket.close();

        navigate("/candidate/dashboard");

    }

};

socket.onerror = (error) => {

    console.error("WebSocket Error:", error);

};

socket.onclose = () => {

    console.log("Candidate WebSocket Closed");

};

socketRef.current = socket;




// ----------------------------
// Fullscreen
// ----------------------------

if (document.documentElement.requestFullscreen) {

    document.documentElement.requestFullscreen().catch(() => {

        toast.error("Please allow fullscreen mode.");

    });

}

    setQuestion(data.question)

    setQuestionNumber(data.question_number)

    setTranscript([
      {
        role: "interviewer",
        text: data.question,
      },
    ])

  })
      .catch((err) => {

    console.error(err);

    toast.error(
        err.response?.data?.detail ||
        "Could not start the interview"
    );

    navigate("/candidate/dashboard", { replace: true });

    return;

})
      .finally(() => setIsBootstrapping(false))
  }, [])

  // ---- loudness meter via Web Audio API, once the webcam stream is live ----
  const attachLoudnessMeter = useCallback((stream) => {
    streamRef.current = stream
    localStreamRef.current = stream;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)
    audioCtxRef.current = ctx
    analyserRef.current = analyser

    const data = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(data)
      const avg = data.reduce((sum, v) => sum + v, 0) / data.length
      setLoudness(Math.min(100, Math.round((avg / 128) * 100)))
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
  }, [])

  useEffect(() => {

    return () => {

        window.speechSynthesis.cancel()

        cancelAnimationFrame(
            rafRef.current
        )

        audioCtxRef.current?.close()

        streamRef.current
            ?.getTracks()
            .forEach((t) => t.stop())

        socketRef.current?.close();

    }

}, [])

// =============================
// Live Camera Streaming
// =============================
useEffect(() => {
    if (!interviewId) return;

    if (!socketRef.current) return;

    const interval = setInterval(() => {

        const webcam = webcamRef.current;

        if (!webcam) return;

        const video = webcam.video;

        if (!video) return;

        if (video.readyState !== 4) return;

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {

          if (
              blob &&
              socketRef.current &&
              socketRef.current.readyState === WebSocket.OPEN
          ) {
              socketRef.current.send(blob);
          }

      }, "image/jpeg", 0.7);

    }, 100);

    return () => clearInterval(interval);

}, [interviewId]);

  const speakQuestion = useCallback((text) => {

  if (!text) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  utterance.lang = "en-US"

  utterance.rate = 0.95

  utterance.pitch = 1

  utterance.volume = 1

  setIsSpeaking(true)

  utterance.onstart = () => {

    setIsSpeaking(true)

  }

  utterance.onend = () => {

    setIsSpeaking(false)

  }

  utterance.onerror = () => {

    setIsSpeaking(false)

  }

  window.speechSynthesis.speak(utterance)

}, [])


  useEffect(() => {

  if (!question) return

  speakQuestion(question)

}, [question, speakQuestion])

  // ---- periodic proctoring frame capture ----
  useEffect(() => {

    if (isBootstrapping) return

    if (!interviewId) return

    const interval = setInterval(() => {

        const shot = webcamRef.current?.getScreenshot()

        if (!shot) return

        fetch(shot)

            .then((r) => r.blob())

            .then((blob) =>

                faceCheck(blob, interviewId)

                    .catch((err) => {

                        console.error(
                            "Face Check Error:",
                            err
                        )

                    })

            )

    }, FACE_CHECK_INTERVAL_MS)

    return () => clearInterval(interval)

}, [isBootstrapping, interviewId])

  const startRecording = useCallback(() => {

  if (!streamRef.current) {
    toast.error("Microphone not available")
    return
  }

  try {

    const audioTracks = streamRef.current.getAudioTracks()

    if (audioTracks.length === 0) {
      toast.error("No microphone detected")
      return
    }

    const audioStream = new MediaStream(audioTracks)

    chunksRef.current = []

    const recorder = new MediaRecorder(audioStream)

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onerror = (event) => {
      console.error("Recorder Error:", event)
      toast.error("Recording failed")
      setIsRecording(false)
    }

    recorder.onstart = () => {
      console.log("Recording Started")
      setIsRecording(true)
      setLiveWords("Listening...")
    }

    recorder.start()

    mediaRecorderRef.current = recorder

  } catch (error) {

    console.error(error)

    toast.error("Unable to start recording")

  }

}, [])

  const stopRecordingAndSubmit = useCallback(async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder) return
    setIsRecording(false)
    setIsSubmitting(true)
    setLiveWords('')

    const audioBlob = await new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: 'audio/webm' }))
      recorder.stop()
    })

    try {
      const { data } = await submitVoiceAnswer({
        interviewId,
    audio: audioBlob
      })

      setTranscript((t) => [...t, { role: 'candidate', text: data.transcript || '(voice answer submitted)' }])

      socketRef.current?.send(
    JSON.stringify({
        type: "ANSWER",
        answer: data.transcript,
    })
);

      if (data.status === "INTERVIEW_COMPLETED") {
        toast.success('Interview complete')
        socketRef.current?.send(
    JSON.stringify({
        type: "INTERVIEW_COMPLETED",
    })
);
        navigate('/candidate/complete')
        return
      }
      const nextQ = data.question
      setQuestion(nextQ)
      setTranscript((t) => [...t, { role: 'interviewer', text: nextQ }])
      setQuestionNumber(data.question_number ?? questionNumber + 1)
      socketRef.current?.send(
    JSON.stringify({
        type: "QUESTION",
        question: nextQ,
        questionNumber: data.question_number,
    })
);
    } catch (err) {

          console.error(err)

          toast.error(

              err.response?.data?.detail ||

              "Could not submit your answer"

          )
    } finally {
      setIsSubmitting(false)
    }
  }, [questionNumber, navigate])

  return (
  <div className="interview-room-page min-h-screen px-8 py-8">

    <ProctoringManager
      interviewId={interviewId}
      onViolation={(type) => {
        socketRef.current?.send(
          JSON.stringify({
            type: "VIOLATION",
            violation: type,
          })
        );
      }}
    />

    <div className="max-w-7xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}

      <div className="rounded-[32px] interview-room-hero shadow-xl px-10 py-8 text-white">

        <div className="flex items-center justify-between">

          <div>

            <p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

              AI Interview

            </p>

            <h1 className="font-display text-5xl mt-4">

              Interview In Progress

            </h1>

            <p className="mt-5 text-blue-100 text-lg leading-8 max-w-xl">

              Stay focused and answer each question clearly.
              Your interview is securely monitored using AI.

            </p>

          </div>

          <div className="hidden lg:block rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-7 text-center">

            <p className="uppercase tracking-widest text-blue-200 text-xs">

              Progress

            </p>

            <h2 className="text-5xl font-bold mt-3">

              {questionNumber}/{TOTAL_QUESTIONS}

            </h2>

            <p className="mt-3 text-blue-100">

              Questions Completed

            </p>

          </div>

        </div>

      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid grid-cols-3 gap-6">

        {/* ================= LEFT PANEL ================= */}

        <div className="col-span-1 space-y-6">

          <Card className="interview-room-card rounded-[28px] overflow-hidden shadow-lg border-0">

            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>

                <p className="uppercase tracking-[0.3em] text-xs text-gray-400">

                  Live Camera

                </p>

                <h2 className="font-display text-2xl mt-2">

                  Candidate View

                </h2>

              </div>

              <MonitoredBadge />

            </div>

            <div className="relative aspect-[3/4] bg-black">

              <Webcam
                ref={webcamRef}
                audio
                muted
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                onUserMedia={attachLoudnessMeter}
                onUserMediaError={() =>
                  toast.error("Camera and microphone access are required")
                }
              />

              <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold">

                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>

                LIVE

              </div>

            </div>

          </Card>

          <Card className="interview-room-card rounded-[28px] p-6 shadow-lg border-0">

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="uppercase tracking-[0.3em] text-xs text-gray-400">

                  Voice Activity

                </p>

                <h3 className="font-display text-2xl mt-2">

                  Microphone

                </h3>

              </div>

              <Mic
                size={22}
                className="text-[#0E4B8E]"
              />

            </div>

            <LoudnessMeter level={loudness} />

          </Card>

        </div>

        {/* ================= Question + Controls ================= */}

<div className="col-span-1 flex flex-col gap-6">

  {/* Question Card */}

  <Card className="interview-room-card rounded-[28px] border-0 shadow-lg p-8">

    <div className="flex items-center justify-between mb-6">

      <div>

        <p className="uppercase tracking-[0.35em] text-xs text-gray-400">

          Current Question

        </p>

        <h2 className="font-display text-2xl mt-2">

          Question {questionNumber}

        </h2>

      </div>

      <div className="text-right">

        <p className="text-xs text-gray-400">

          Progress

        </p>

       <p className="font-semibold interview-room-primary">

          {questionNumber}/{TOTAL_QUESTIONS}

        </p>

      </div>

    </div>

    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-8">

      <motion.div
        className="h-full interview-room-progress"
        animate={{
          width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%`,
        }}
        transition={{
          duration: 0.4,
        }}
      />

    </div>

    {isBootstrapping ? (

      <div className="py-20 flex flex-col items-center">

        <Loader2
          size={40}
         
className="animate-spin interview-room-primary"

        />

        <p className="mt-5 text-gray-500">

          Preparing your interview...

        </p>

      </div>

    ) : (

      <AnimatePresence mode="wait">

        <motion.div
          key={question}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >

          <p className="text-2xl interview-room-heading leading-10 font-medium">

            {question}

          </p>

        </motion.div>

      </AnimatePresence>

    )}

  </Card>

  {/* Controls */}

  <Card className="interview-room-card rounded-[28px] border-0 shadow-lg p-8">

    <div className="text-center">

      <p className="uppercase tracking-[0.35em] text-xs text-gray-400">

        Interview Status

      </p>

      <h2 className="font-display text-3xl mt-3">

        {isSpeaking
          ? "AI Speaking"
          : isRecording
          ? "Recording"
          : "Ready"}

      </h2>

      <p className="mt-4 text-gray-500 leading-7">

        {isSpeaking
          ? "Listen carefully while the AI asks the question."
          : isRecording
          ? "Speak clearly and press Stop when finished."
          : "Press Record when you are ready to answer."}

      </p>

    </div>

    <div className="flex justify-center gap-6 mt-10">

      {!isRecording ? (

        <button
          disabled={
            isBootstrapping ||
            isSubmitting ||
            isSpeaking
          }
          onClick={startRecording}
          className="w-20 h-20 rounded-full interview-room-button text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50"
        >

          {isSubmitting ? (

            <Loader2
              size={30}
              className="animate-spin interview-room-primary"
            />

          ) : (

            <Mic size={30} />

          )}

        </button>

      ) : (

        <button
          onClick={stopRecordingAndSubmit}
          className="w-20 h-20 rounded-full bg-red-600 text-white shadow-lg animate-pulse flex items-center justify-center"
        >

          <Square size={30} />

        </button>

      )}

      <button
        onClick={() => speakQuestion(question)}
        disabled={isSpeaking || !question}
        className="interview-room-outline-button px-8 rounded-2xl transition-all flex items-center gap-3"
      >

        <Volume2 size={20} />

        Replay Question

      </button>

     </div>

     </Card>

    </div>
{/* ================= LIVE TRANSCRIPT ================= */}

<div className="col-span-1">

  <Card className="interview-room-card rounded-[28px] border-0 shadow-lg h-full flex flex-col overflow-hidden">

    <div className="px-6 py-5 border-b border-gray-200">

      <p className="uppercase tracking-[0.35em] text-xs text-gray-400">

        Live Transcript

      </p>

      <h2 className="font-display text-2xl mt-2">

        Conversation

      </h2>

    </div>

    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 max-h-[620px]">

      {transcript.length === 0 && (

        <div className="h-full flex flex-col items-center justify-center text-center py-16">

          <div className="w-16 h-16 rounded-full interview-room-blue-bg flex items-center justify-center">

            <Volume2
              size={28}
              className="interview-room-primary"
            />

          </div>

          <h3 className="font-semibold text-gray-700 mt-5">

            Waiting for Conversation

          </h3>

          <p className="text-gray-500 text-sm mt-2">

            Transcript will appear here as the
            interview progresses.

          </p>

        </div>

      )}

      {transcript.map((entry, index) => (

        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className={`rounded-2xl p-4 ${
            entry.role === "interviewer"
              ? "interview-room-ai-message"
              : "interview-room-user-message"
          }`}
        >

          <p className="uppercase tracking-widest text-[10px] font-semibold text-gray-400 mb-2">

            {entry.role === "interviewer"
              ? "AI Interviewer"
              : "You"}

          </p>

          <p className="text-gray-700 leading-7 text-sm">

            {entry.text}

          </p>

        </motion.div>

      ))}

      {liveWords && (

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="rounded-2xl interview-room-listening p-4"
        >

          <p className="uppercase tracking-widest text-[10px] font-semibold text-[#F4A321]">

            Listening...

          </p>

          <p className="mt-2 italic text-gray-700">

            {liveWords}

          </p>

        </motion.div>

      )}

    </div>

    <div className="border-t border-gray-200 px-6 py-4 interview-room-footer">

      <div className="flex items-center justify-between">

        <span className="text-sm text-gray-500">

          AI Monitoring

        </span>

        <div className="flex items-center gap-2">

          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>

          <span className="text-sm font-medium text-green-600">

            Active

          </span>

        </div>

      </div>

    </div>

  </Card>

</div>

</div>

</div>

</div>

);
}