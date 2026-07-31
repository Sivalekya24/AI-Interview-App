import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function WarningModal({

    open,

    title,

    message,

    count,

    onClose,

}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999]">

            <div className="w-[500px] rounded-[30px] bg-white shadow-2xl border border-red-100 overflow-hidden">

                {/* Header */}

                <div className="bg-red-50 border-b border-red-100 px-8 py-6">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

                            <AlertTriangle
                                size={28}
                                className="text-red-600"
                            />

                        </div>

                        <div>

                            <p className="uppercase tracking-[0.35em] text-xs text-red-500">

                                Security Alert

                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">

                                {title || "Warning"}

                            </h2>

                        </div>

                    </div>

                </div>

                {/* Body */}

                <div className="px-8 py-8">

                    <p className="text-gray-700 leading-8">

                        {message}

                    </p>

                    <div className="mt-6 rounded-2xl bg-[#EEF4FF] border border-[#D7E3FF] p-5">

                        <div className="flex items-center gap-3">

                            <ShieldAlert
                                size={24}
                                className="text-[#0E4B8E]"
                            />

                            <div>

                                <h3 className="font-semibold text-[#0E4B8E]">

                                    Interview Integrity

                                </h3>

                                <p className="text-sm text-gray-600 mt-1">

                                    Please return to fullscreen mode before
                                    continuing your interview.

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="mt-6 inline-flex items-center rounded-full bg-red-100 text-red-700 px-4 py-2 font-semibold">

                        Violation Count : {count}

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            mt-8
                            w-full
                            h-14
                            rounded-2xl
                            bg-[#0E4B8E]
                            hover:bg-[#0B417C]
                            text-white
                            font-semibold
                            transition-all
                        "

                    >

                        Return to Fullscreen

                    </button>

                    <p className="text-center text-sm text-gray-500 mt-5">

                        Repeated violations may result in automatic
                        interview termination.

                    </p>

                </div>

            </div>

        </div>

    );

}