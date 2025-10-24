"use client";
import { useState } from "react";
import Link from "next/link";
import "../auth.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="name-row">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <input
          name="address1"
          type="text"
          placeholder="Address Line 1"
          onChange={handleChange}
          required
        />
        <input
          name="address2"
          type="text"
          placeholder="Address Line 2"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
