import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const client = axios.create({ baseURL: BASE_URL })

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Central 401 handling -> bounce to login
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ---------- Authentication ----------

export const registerUser = (payload) =>
  client.post("/auth/register", payload);

export const loginUser = ({ email, password }) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  return client.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
// ---------- Google Authentication ----------

export const googleLogin = (credential) =>
  client.post("/auth/google", {
    credential,
  });
// ---------- Resume (candidate) ----------
export const uploadResume = (file) => {
  const form = new FormData()
  form.append('file', file)
  return client.post('/resume/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const getMyResume = () => client.get('/resume/me')

// ---------- Interview (candidate) ----------
export const startInterview = () => client.post('/interview/start')
export const submitAnswer = (payload) => client.post('/interview/answer', payload)

// ---------- Voice ----------
export const transcribeAudio = (blob) => {
  const form = new FormData()
  form.append('audio', blob, 'answer.webm')
  return client.post('/voice/transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const submitVoiceAnswer = ({ interviewId, audio }) => {

    const form = new FormData()

    form.append("interview_id", interviewId)

    form.append("audio", audio, "answer.webm")

    return client.post(
        "/voice/interview-answer",
        form
    )

}

// ---------- Proctoring ----------
export const faceCheck = (frameBlob, interviewId) => {

    const form = new FormData()

    form.append("image", frameBlob, "frame.jpg")

    return client.post(
        `/proctoring/face-check?interview_id=${interviewId}`,
        form
    )

}


export const submitContactMessage = async (data) => {
    const response = await client.post("/contact", data);
    return response.data;
};

export const getContactMessages = async () => {
    const response = await client.get("/contact/recruiter");
    return response.data;
};

export const getContactMessage = async (id) => {
    const response = await client.get(`/contact/recruiter/${id}`);
    return response.data;
};

export const markContactAsRead = async (id) => {
    const response = await client.patch(`/contact/recruiter/${id}/read`);
    return response.data;
};

export const deleteContactMessage = async (id) => {
    const response = await client.delete(`/contact/recruiter/${id}`);
    return response.data;
};






export const forgotPassword = (email) =>
    client.post("/auth/forgot-password", {
        email,
    });

export const resetPassword = (token, password) =>
    client.post("/auth/reset-password", {
        token,
        password,
    });
// ---------- Frontend Browser Violations ----------

export const reportViolation = (payload) =>
  client.post("/proctoring/violation", payload);

// ---------- Recruiter: dashboard ----------
export const getRecruiterDashboard = () => client.get('/recruiter/dashboard')

// ---------- Recruiter: user management ----------
export const getAllUsers = (params) => client.get('/recruiter/users', { params })
export const createUser = (payload) => client.post('/recruiter/users', payload)
export const getUser = (userId) => client.get(`/recruiter/users/${userId}`)
export const updateUser = (userId, payload) => client.put(`/recruiter/users/${userId}`, payload)
export const activateUser = (userId) => client.patch(`/recruiter/users/${userId}/activate`)
export const deactivateUser = (userId) => client.patch(`/recruiter/users/${userId}/deactivate`)

export const getInterviewStatus = (interviewId) =>
    client.get(`/interview/${interviewId}/status`);

// ---------- Recruiter: downloads ----------
export const downloadUsersFile = () =>
  client.get('/recruiter/download/users', { responseType: 'blob' })
export const downloadInterviewsFile = () =>
  client.get('/recruiter/download/interviews', { responseType: 'blob' })


// ---------- Recruiter: interviews ----------
export const getAllInterviews = (params) => client.get('/recruiter/interviews', { params })
export const getLiveInterviews = () => client.get('/recruiter/live')
export const getLiveInterview = (interviewId) => client.get(`/recruiter/live/${interviewId}`)
export const getInterview = (interviewId) => client.get(`/recruiter/interviews/${interviewId}`)
export const getInterviewAnswers = (interviewId) =>
  client.get(`/recruiter/interviews/${interviewId}/answers`)
export const getInterviewReport = (interviewId) =>
  client.get(`/recruiter/interviews/${interviewId}/report`)


// ---------- Recruiter : Resume ----------

export const viewResume = (interviewId) =>
  client.get(
    `/recruiter/interviews/${interviewId}/resume`,
    {
      responseType: "blob",
    }
  );

export const downloadResume = (interviewId) =>
  client.get(
    `/recruiter/interviews/${interviewId}/resume/download`,
    {
      responseType: "blob",
    }
  );

export const getCurrentInterview = () =>
    client.get("/interview/current");


// ---------- Recruiter : Download Report ----------

export const downloadInterviewReport = (interviewId) =>
  client.get(
    `/recruiter/interviews/${interviewId}/report/download`,
    {
      responseType: "blob",
    }
  );
// ---------- Recruiter: Terminate Interview ----------

export const terminateInterview = (interviewId) =>
    client.patch(`/recruiter/interviews/${interviewId}/terminate`);

// ---------- Recruiter: violations ----------
export const getAllViolations = (params) => client.get('/recruiter/violations', { params })
export const getInterviewViolations = (interviewId) =>
  client.get(`/recruiter/interviews/${interviewId}/violations`)

// ---------- Health ----------
export const healthCheck = () => client.get('/health')

// ---------- Helper: trigger browser download from a blob response ----------
export const downloadBlob = (blobResponse, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobResponse.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
