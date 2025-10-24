"use client";
import { useState } from "react";
import Link from "next/link";
import "../auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage("✅ Password reset link sent to your email.");
      } else {
        setMessage("❌ Unable to send reset link. Try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Server not reachable.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
        {message && <p>{message}</p>}

        <p>
          Remembered your password? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
