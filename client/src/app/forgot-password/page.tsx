"use client";
import { useState } from "react";
import Link from "next/link";
import "../auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "#4b5563" }}>
          Enter your email to receive a reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>

        <p>
          Back to <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
