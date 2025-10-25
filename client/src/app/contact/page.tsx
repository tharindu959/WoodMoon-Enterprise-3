"use client";

import { useState, useEffect } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  replied: boolean;
  responseMessage: string;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8090/api/contact";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to the server.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Contact Us
      </h1>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column: Contact Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Contact Information</h2>
          <p>
            <span className="font-semibold">Phone:</span> +94 77 4903059 / 011 2748117
          </p>
          <p>
            <span className="font-semibold">Email:</span> woodmoon762@gmail.com
          </p>
          <p>
            <span className="font-semibold">Address:</span> No:762/A/16, Panagoda,Homagama                                                 
          </p>

          {/* Google Maps */}
          <div className="w-full h-64 mt-4 rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.13761918063!2d79.9598!3d6.8440!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b2dc8f8b2c7%3A0x9b7d523b6c8b8db!2sHomagama!5e0!3m2!1sen!2slk!4v1696753333333!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Social Links */}
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col items-center text-sm text-gray-700">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <img src="/icons/facebook.png" className="w-8 h-8" alt="Facebook" />
              </a>
              <span>Facebook</span>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-700">
              <a href="https://wa.me/94782306995" target="_blank" rel="noreferrer">
                <img src="/icons/whatsapp.png" className="w-8 h-8" alt="WhatsApp" />
              </a>
              <span>WhatsApp</span>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-700">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <img src="/icons/instagram.png" className="w-8 h-8" alt="Instagram" />
              </a>
              <span>Instagram</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Send us a Message
          </h2>
          {submitted ? (
            <p className="text-green-600 text-lg font-medium">
              Your message was sent and we will contact you sooner
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-gray-200"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-gray-200"
              />
              <textarea
                name="message"
                placeholder="Ask a question\Send a Message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-gray-200"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Send Message
              </button>
              {error && <p className="text-red-600 font-medium">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}