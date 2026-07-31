import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Button, Input } from "../../components/ui/primitives";
import { forgotPassword } from "../../lib/api";
import Logo from "../../components/ui/Logo";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const { data } = await forgotPassword(email);

      toast.success(
        data.message || "Password reset link sent successfully."
      );

      setEmail("");

    }

    catch (err) {

      toast.error(

        err.response?.data?.detail ||

        "Failed to send password reset link."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#EEF3FA] flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10">

        <div className="flex justify-center mb-6">

          <Logo size={55} />

        </div>

        <h1 className="text-3xl font-bold text-center">

          Forgot Password

        </h1>

        <p className="text-gray-500 text-center mt-2">

          Enter your registered email address.
          We'll send you a password reset link.

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >

            {

              loading

                ? "Sending..."

                : "Send Reset Link"

            }

          </Button>

        </form>

        <div className="text-center mt-6">

          <Link
            to="/login"
            className="text-[#0E4B8E] hover:underline"
          >

            Back to Login

          </Link>

        </div>

      </div>

    </div>

  );

}