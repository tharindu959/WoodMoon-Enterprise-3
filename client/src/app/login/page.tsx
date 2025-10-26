"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";
import "../auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loginStore = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();

        // ✅ Save login info in Zustand store
        loginStore.login(email, token);

        setMessage("✅ Login successful!");
        localStorage.setItem("token", token);

        // Redirect to homepage or cart
        router.push("/");
      } else {
        setMessage("❌ Invalid email or password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Server error. Try again later.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        {message && <p>{message}</p>}

        <p>
          Don’t have an account? <Link href="/register">Sign up</Link>
        </p>
        <p>
          Forgot password? <Link href="/forgot-password">Reset</Link>
        </p>
      </form>
    </div>
  );
}
