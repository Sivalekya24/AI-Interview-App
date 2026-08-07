import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button, Input } from "../../components/ui/primitives";
import { resetPassword } from "../../lib/api";
import Logo from "../../components/ui/Logo";

export default function ResetPassword() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {

      toast.error("Passwords do not match.");

      return;

    }

    setLoading(true);

    try {

      const { data } = await resetPassword(
        token,
        password
      );

      toast.success(
        data.message
      );

      navigate("/login");

    }

    catch (err) {

      toast.error(

        err.response?.data?.detail ||

        "Unable to reset password."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page min-h-screen bg-[#EEF3FA] flex items-center justify-center">

      <div className="auth-card  shadow-xl rounded-3xl p-10 w-full max-w-md">

        <div className="flex justify-center mb-6">

          <Logo size={55} />

        </div>

        <h2 className="auth-heading text-3xl font-bold text-center">

          Reset Password

        </h2>

        <p className="auth-text text-center mt-2">

          Enter your new password.

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <Input
            label="New Password"
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <Input
            label="Confirm Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >

            {
              loading

                ? "Updating..."

                : "Reset Password"
            }

          </Button>

        </form>

      </div>

    </div>

  );

}