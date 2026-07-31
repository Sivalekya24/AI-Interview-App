import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../lib/auth-context";
import { Button, Input } from "../../components/ui/primitives";
import Logo from "../../components/ui/Logo";

export default function Register() {

  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

      await register(form);

      toast.success(
        "Account created successfully"
      );

      navigate("/login", {
        replace: true,
      });

    }

    catch (err) {

      setError(

        err.response?.data?.detail ??

        "Registration failed"

      );

    }

    finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#EEF3FA] flex items-center justify-center px-6 py-10">

     <div className="w-full max-w-7xl min-h-[90vh] bg-white rounded-[28px] shadow-2xl overflow-hidden grid lg:grid-cols-[42%_58%]">
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

                Start Your

                <br />

                AI Journey

              </h1>

              <p className="mt-8 text-blue-100 leading-8">

                Create your SHNOOR account and
                experience a modern AI-powered
                interview platform designed for
                recruiters and candidates.

                <br /><br />

                From intelligent resume analysis
                to automated interview evaluation,
                SHNOOR simplifies every stage
                of recruitment.

              </p>

            </div>

          </div>

          <p className="text-blue-200 text-sm">

            © 2026 SHNOOR International LLC

          </p>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center px-16 py-12">

          <div className="w-full max-w-lg">

            <h2 className="font-display text-6xl text-[#111827]">

              Create Account

            </h2>

            <p className="mt-4 text-gray-500 text-xl leading-8">

              Join the SHNOOR AI Interview Platforms.

            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 mt-10"
            >
              <Input
  label="Full Name"
  placeholder="Enter your full name"
  required
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value,
    })
  }
/>

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
  placeholder="Create a password"
  minLength={8}
  required
  value={form.password}
  onChange={(e) =>
    setForm({
      ...form,
      password: e.target.value,
    })
  }
/>

{error && (

  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

    {error}

  </div>

)}

<Button
  type="submit"
  disabled={isSubmitting}
  className="w-full h-14 rounded-2xl text-lg"
>

  {isSubmitting
    ? "Creating Account..."
    : "Create Account"}

</Button>

<div className="text-center pt-2">

  <p className="text-gray-600">

    Already have an account?{" "}

    <Link
      to="/login"
      className="font-semibold text-[#0E4B8E] hover:text-[#F4A321]"
    >

      Sign In

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