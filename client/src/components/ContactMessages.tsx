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

export default function ContactMessagePage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  const API_URL = "http://localhost:8090/api/contact";

  // Fetch all messages for admin view
  const fetchMessages = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []); // ✅ Fix: use data.data from backend response
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new contact message
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

  // Handle admin reply input
  const handleReplyChange = (id: number, value: string) => {
    setReplyText({ ...replyText, [id]: value });
  };

  // ✅ Fixed: Send reply properly as JSON { responseMessage: "text" }
  const handleReply = async (id: number) => {
    const text = replyText[id];
    if (!text) return;

    try {
      const res = await fetch(`${API_URL}/reply/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseMessage: text }), // ✅ FIXED LINE
      });

      if (res.ok) {
        fetchMessages(); // Refresh messages
        setReplyText({ ...replyText, [id]: "" });
      } else {
        console.error("Failed to send reply");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-16">
      {/* Page Heading */}
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Contact Us
      </h1>

      {/* Contact Info & Map */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-semibold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> +94 77 123 4567
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> info@yourshop.lk
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Address:</span> Homagama, Sri Lanka
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Facebook
            </a>
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 font-semibold"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Google Map */}
        <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <iframe
            title="Shop Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6337.679232238673!2d79.9854577!3d6.843649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b2dc8f8b2c7%3A0x9b7d523b6c8b8db!2sPanagoda%2C%20Homagama!5e0!3m2!1sen!2slk!4v1735231234567!5m2!1sen!2slk"
            width="100%"
            height="100%"
            className="aspect-[16/9] w-full"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Send us a Message</h2>
        {submitted ? (
          <p className="text-green-600 text-lg font-medium">
            Your message was sent and we will contact you via email.
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
              placeholder="Ask a Question/Send a Message"
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

      {/* Admin Messages List */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">All Messages (Admin)</h2>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white shadow-lg rounded-2xl p-6 space-y-3 border border-gray-100"
          >
            <p>
              <span className="font-semibold">Name:</span> {msg.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {msg.email}
            </p>
            <p>
              <span className="font-semibold">Message:</span> {msg.message}
            </p>
            <p>
              <span className="font-semibold">Replied:</span> {msg.replied ? "Yes" : "No"}
            </p>
            {msg.replied && (
              <p>
                <span className="font-semibold">Response:</span> {msg.responseMessage}
              </p>
            )}
            {!msg.replied && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Write a reply"
                  value={replyText[msg.id] || ""}
                  onChange={(e) => handleReplyChange(msg.id, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => handleReply(msg.id)}
                  className="bg-green-600 text-white px-4 rounded-lg"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
