import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { uploadResume } from "../../lib/api";
import { Card, Button } from "../../components/ui/primitives";

export default function ResumeUpload() {

  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [file, setFile] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFile = (selectedFile) => {

    if (!selectedFile) return;

    const allowed = [

      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    ];

    if (!allowed.includes(selectedFile.type)) {

      toast.error("Please upload PDF, DOC or DOCX");

      return;

    }

    setFile(selectedFile);

  };

  const handleSubmit = async () => {

    if (!file) {

      toast.error("Please choose a resume");

      return;

    }

    setIsSubmitting(true);

    try {

      await uploadResume(file);

      toast.success("Resume uploaded successfully");

      navigate("/candidate/dashboard", {
        replace: true,
      });

    }

    catch (err) {

      toast.error(

        err.response?.data?.detail ??

        "Resume upload failed"

      );

    }

    finally {

      setIsSubmitting(false);

    }

  };

  return (

<div className="resume-upload-page space-y-8">
{/* ================= HERO ================= */}

<div className="resume-upload-hero relative overflow-hidden rounded-[32px] px-10 py-10 text-white shadow-xl">

<div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

<div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#F4A321]/20 blur-3xl"></div>

<div className="relative flex justify-between items-center">

<div>

<p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

Resume Upload

</p>

<h1 className="font-display text-5xl mt-4">

Upload Your Resume

</h1>

<p className="mt-5 text-blue-100 text-lg leading-8 max-w-2xl">

Upload your latest resume to generate personalized
AI interview questions based on your skills,
experience and projects.

</p>

</div>

<div className="hidden lg:block">

<div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-7">

<p className="uppercase tracking-widest text-blue-200 text-sm">

Supported

</p>

<h2 className="text-4xl font-bold mt-4">

PDF

</h2>

<p className="mt-3 text-blue-100">

DOC & DOCX

</p>

</div>

</div>

</div>

</div>
{/* ================= UPLOAD AREA ================= */}

<Card
className={`resume-upload-card rounded-[30px] border-2 border-dashed transition-all duration-300 p-16 cursor-pointer hover:shadow-xl ${
isDragging
? "resume-upload-active"
: ""
}`}
onClick={() => inputRef.current?.click()}
onDragOver={(e) => {

e.preventDefault();

setIsDragging(true);

}}
onDragLeave={() => setIsDragging(false)}
onDrop={(e) => {

e.preventDefault();

setIsDragging(false);

handleFile(e.dataTransfer.files[0]);

}}
>

<input

ref={inputRef}

type="file"

accept=".pdf,.doc,.docx"

className="hidden"

onChange={(e) =>
handleFile(e.target.files[0])
}

/>

{file ? (

<div className="flex flex-col items-center text-center">

<div className="resume-upload-icon-bg w-24 h-24 rounded-full flex items-center justify-center">

<CheckCircle2

size={54}

className="text-green-600"

/>

</div>

<h2 className="resume-upload-heading font-display text-3xl mt-8">

Resume Selected

</h2>

<p className="text-xl font-semibold text-[#0E4B8E] mt-5">

{file.name}

</p>

<p className="text-gray-500 mt-3">

{(file.size / 1024).toFixed(1)} KB

</p>

<div className="mt-6 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">

Ready to Upload

</div>

<Button

variant="secondary"

className="mt-8"

onClick={(e) => {

e.stopPropagation();

inputRef.current?.click();

}}

>

Replace Resume

</Button>

</div>

) : (

<div className="flex flex-col items-center text-center">

<div className="w-24 h-24 rounded-full bg-[#EEF4FF] flex items-center justify-center">

<UploadCloud

size={60}

className="text-[#0E4B8E]"

/>

</div>

<h2 className="font-display text-3xl text-[#111827] mt-8">

Drag & Drop Resume

</h2>

<p className="text-gray-500 mt-4 text-lg">

or click anywhere to browse your computer

</p>

<div className="flex flex-wrap justify-center gap-3 mt-8">

<span className="resume-upload-chip px-4 py-2 rounded-full font-medium">

PDF

</span>

<span className="resume-upload-chip px-4 py-2 rounded-full bg-[#EEF4FF] text-[#0E4B8E] font-medium">

DOC

</span>

<span className="resume-upload-chip px-4 py-2 rounded-full bg-[#EEF4FF] text-[#0E4B8E] font-medium">

DOCX

</span>

</div>

<p className="mt-8 text-gray-400">

Maximum File Size: 10 MB

</p>

</div>

)}

</Card>
{/* ================= GUIDELINES ================= */}

<Card className="rounded-[30px] border-0 shadow-md p-8">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-2xl resume-upload-icon-bg flex items-center justify-center">

<ShieldCheck
size={28}
className="text-[#0E4B8E]"
/>

</div>

<div>

<p className="uppercase tracking-[0.35em] text-xs text-gray-400">

Guidelines

</p>

<h2 className="text-2xl font-display mt-1">

Resume Requirements

</h2>

</div>

</div>

<div className="mt-8 grid md:grid-cols-2 gap-6">

<div className="flex gap-4">

<CheckCircle2
size={22}
className="text-green-600 mt-1"
/>

<div>

<h3 className="font-semibold">

Latest Resume

</h3>

<p className="text-gray-500 mt-1">

Upload your most recent resume with updated skills,
projects and experience.

</p>

</div>

</div>

<div className="flex gap-4">

<CheckCircle2
size={22}
className="text-green-600 mt-1"
/>

<div>

<h3 className="font-semibold">

Supported Formats

</h3>

<p className="text-gray-500 mt-1">

PDF, DOC and DOCX files are accepted.

</p>

</div>

</div>

<div className="flex gap-4">

<CheckCircle2
size={22}
className="text-green-600 mt-1"
/>

<div>

<h3 className="font-semibold">

Maximum Size

</h3>

<p className="text-gray-500 mt-1">

Please keep your resume below 10 MB.

</p>

</div>

</div>

<div className="flex gap-4">

<CheckCircle2
size={22}
className="text-green-600 mt-1"
/>

<div>

<h3 className="font-semibold">

AI Resume Parsing

</h3>

<p className="text-gray-500 mt-1">

Your resume will be analyzed to generate
personalized interview questions.

</p>

</div>

</div>

</div>

</Card>

{/* ================= ACTION ================= */}

<Button

className="resume-upload-button w-full h-14 text-lg rounded-2xl"

disabled={!file || isSubmitting}

onClick={handleSubmit}

>

{isSubmitting

? "Uploading Resume..."

: "Upload Resume"}

</Button>

{/* ================= SECURITY NOTE ================= */}

<div className="resume-security-box rounded-2xl p-6 text-center">

<p className="font-semibold resume-upload-heading">

Secure Resume Processing

</p>

<p className="mt-3 text-gray-600 leading-7">

Your resume is securely stored and used only for
AI-powered resume analysis and interview generation.
Your information is never shared with third parties.

</p>

</div>

</div>

);

}