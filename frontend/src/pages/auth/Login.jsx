import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { ShieldCheck } from "lucide-react";

import { useAuth } from "../../lib/auth-context";
import { Button, Input } from "../../components/ui/primitives";
import Logo from "../../components/ui/Logo";

export default function Login() {

  const { login, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setIsSubmitting(true);

    try {

      const user = await login(form);

      const destination =
        location.state?.from?.pathname ??
        (
          user.role === "RECRUITER"
            ? "/recruiter/dashboard"
            : "/candidate/dashboard"
        );

      toast.success("Signed In");

      navigate(destination, {
        replace: true,
      });

    }

    catch (err) {

      setError(

        err.response?.data?.detail ??

        "Invalid email or password"

      );

    }

    finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="auth-page min-h-screen bg-[#EEF3FA] flex items-center justify-center px-6 py-10">

      <div className="auth-card w-full max-w-7xl min-h-[90vh]  rounded-[28px] shadow-2xl overflow-hidden grid lg:grid-cols-[42%_58%]">

        {/* LEFT PANEL */}

       <div className="bg-[#0E4B8E] text-white p-14 flex flex-col justify-between">
          <div>

            <Logo
              dark={false}
              size={55}
            />

            <div className="mt-14">

              <p className="uppercase tracking-[0.35em] text-blue-200 text-sm">

                WELCOME

              </p>

              <h1 className="font-display text-5xl mt-5 leading-tight">

                AI Interview

                <br />

                Platform

              </h1>

              <p className="mt-8 text-blue-100 leading-8">

                Securely access your recruiter
                or candidate workspace to
                continue AI-powered interviews
                and hiring.

              </p>

            </div>

            <div className="mt-12 space-y-6">

              <div className="flex items-center gap-4">

                <ShieldCheck
                  size={20}
                  className="text-[#F4A321]"
                />

                <span>

                  Secure Authentication

                </span>

              </div>

              <div className="flex items-center gap-4">

                <ShieldCheck
                  size={20}
                  className="text-[#F4A321]"
                />

                <span>

                  AI Powered Recruitment

                </span>

              </div>

              <div className="flex items-center gap-4">

                <ShieldCheck
                  size={20}
                  className="text-[#F4A321]"
                />

                <span>

                  Enterprise Grade Security

                </span>

              </div>

            </div>

          </div>

          <p className="text-blue-200 text-sm">

            
            © 2026 SHNOOR International LLC

          </p>

        </div>


        {/* RIGHT PANEL */}

<div className="flex items-center justify-center px-16 py-12">

<div className="w-full max-w-lg">

<h2 className="auth-heading font-display text-6xl">

Welcome Back

</h2>

<p className="auth-text mt-4  text-xl leading-8">

Sign in to continue to your AI Interview
workspace.

</p>

<form
onSubmit={handleSubmit}
className="space-y-5 mt-8"
>
            <Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
  value={form.email}
  onChange={(e) =>
    setForm({
      ...form,
      email: e.target.value,
    })
  }
/>

<Input
  label="Password"
  type="password"
  placeholder="Enter your password"
  required
  value={form.password}
  onChange={(e) =>
    setForm({
      ...form,
      password: e.target.value,
    })
  }
/>

<div className="flex items-center justify-between text-sm">

  <label className="auth-text flex items-center gap-2">

    <input
      type="checkbox"
      className="w-4 h-4 accent-[#0E4B8E]"
    />

    Remember me

  </label>

  <Link
  to="/forgot-password"
  className="text-[#0E4B8E] hover:underline font-medium"
>
  Forgot Password?
</Link>

</div>

{error && (

  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

    {error}

  </div>

)}

<Button
  type="submit"
  disabled={isSubmitting}
  className="w-full h-12 rounded-xl"
>

  {isSubmitting
    ? "Signing In..."
    : "Sign In"}

</Button>

<div className="flex items-center gap-4">

  <div className="flex-1 border-t border-gray-200"></div>

  <span className="auth-text text-sm">

    OR

  </span>

  <div className="flex-1 border-t border-gray-200"></div>

</div>

<div className="flex justify-center">

  <GoogleLogin

    onSuccess={async (credentialResponse) => {

      try {

        const user = await loginWithGoogle(
          credentialResponse.credential
        );

        toast.success(
          "Signed in with Google"
        );

        const destination =
          location.state?.from?.pathname ??

          (
            user.role === "RECRUITER"
              ? "/recruiter/dashboard"
              : "/candidate/dashboard"
          );

        navigate(destination, {
          replace: true,
        });

      }

      catch (err) {

        console.error(err);

        toast.error(

          err.response?.data?.detail ??

          "Google Sign-In failed"

        );

      }

    }}

    onError={() => {

      toast.error(
        "Google Sign-In failed"
      );

    }}

  />

</div>

<div className="text-center pt-2">

  <p className="auth-text text-sm">

    Don't have an account?{" "}

    <Link
      to="/register"
      className="font-semibold text-[#0E4B8E] hover:text-[#F4A321]"
    >
      Create Account
    </Link>

  </p>

</div>
            </form>

          </div>

        </div>

      </div>

    </div>

  );

}