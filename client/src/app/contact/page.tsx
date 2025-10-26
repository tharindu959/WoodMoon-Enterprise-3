"use client";

import { useState } from "react";

export default function ContactPage() {
  const API_URL = "http://localhost:8080/api/contact";

  const [form, setForm] = useState({
    name: "",
    email: "",
    question: "",
    feedback: "",
    rating: 0,
  });

  // Separate submission states
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [errorQuestion, setErrorQuestion] = useState("");
  const [errorFeedback, setErrorFeedback] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Ask a Question
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorQuestion("");
    setQuestionSubmitted(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          question: form.question,
          feedback: null,
          rating: null,
        }),
      });

      if (res.ok) {
        setQuestionSubmitted(true);
        setForm({ ...form, question: "" });
      } else {
        setErrorQuestion("Failed to send your question. Please try again.");
      }
    } catch {
      setErrorQuestion("Error connecting to the server.");
    }
  };

  // ✅ Feedback Submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback("");
    setFeedbackSubmitted(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          question: null,
          feedback: form.feedback,
          rating: null,
        }),
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
        setForm({ ...form, feedback: "" });
      } else {
        setErrorFeedback("Failed to send feedback. Please try again.");
      }
    } catch {
      setErrorFeedback("Error connecting to the server.");
    }
  };

  // ✅ Rating Submission (Independent endpoint)
  const handleRatingSubmit = async () => {
    setErrorFeedback("");
    setRatingSubmitted(false);

    try {
      const res = await fetch(`${API_URL}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          stars: form.rating, // renamed to match backend
        }),
      });

      if (res.ok) {
        setRatingSubmitted(true);
        setForm({ ...form, rating: 0 });
      } else {
        setErrorFeedback("Failed to send rating. Please try again.");
      }
    } catch {
      setErrorFeedback("Error connecting to the server.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Contact Us
      </h1>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Contact Information</h2>
          <p>
            <span className="font-semibold">Email:</span> woodmoon762@gmail.com
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +94 77 4903059 / 011 2748117
          </p>
          <p>
            <span className="font-semibold">Address:</span> No:762/A/16, Panagoda, Homagama
          </p>

          {/* Map */}
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

          {/* Social Icons */}
          <div className="flex gap-6 mt-6">
            {[
              { name: "Facebook", icon: "/icons/facebook.png", url: "https://facebook.com" },
              { name: "WhatsApp", icon: "/icons/whatsapp.png", url: "https://wa.me/94782306995" },
              { name: "Instagram", icon: "/icons/instagram.png", url: "https://instagram.com" },
            ].map((s) => (
              <div key={s.name} className="flex flex-col items-center text-sm text-gray-700">
                <a href={s.url} target="_blank" rel="noreferrer">
                  <img src={s.icon} className="w-8 h-8" alt={s.name} />
                </a>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Ask a Question */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Ask a Question</h2>
          {questionSubmitted ? (
            <p className="text-green-600 text-lg font-medium">
              Message submission sucessfull! <br />
               We will contact you via email soon
            </p>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="grid gap-6">
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
                name="question"
                placeholder="Ask your question..."
                rows={6}
                value={form.question}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-gray-200"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700"
              >
                Submit Question
              </button>
              {errorQuestion && (
                <p className="text-red-600 font-medium">{errorQuestion}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Bottom Row: Feedback + Rate Us */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Feedback - Cream Tone */}
        <div className="p-6 bg-gradient-to-r from-green-100 via-lime-50 to-green-200 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            Give Us Feedback
          </h3>
          {feedbackSubmitted ? (
            <p className="text-green-600 text-lg font-medium">
              Thank you for your feedback!
            </p>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="grid gap-4">
              <textarea
                name="feedback"
                placeholder="Share your thoughts or suggestions..."
                rows={5}
                value={form.feedback}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-gray-200 bg-white/70"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-200 via-emerald-200 to-green-300 text-gray-800 font-semibold py-3 px-6 rounded-xl hover:from-green-300 hover:to-emerald-300 shadow-md transition-all"
              >
                Submit Feedback
              </button>
              {errorFeedback && (
                <p className="text-red-600 font-medium">{errorFeedback}</p>
              )}
            </form>
          )}
        </div>

        {/* Rate Us */}
        <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl shadow-md flex flex-col items-center justify-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
            Rate Us
          </h3>
          {ratingSubmitted ? (
            <p className="text-green-600 text-lg font-medium">
              Thanks for rating us!
            </p>
          ) : (
            <>
              <div className="flex justify-center gap-4 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`text-7xl transition-transform transform hover:scale-110 ${
                      star <= form.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleRatingSubmit}
                className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-amber-600 shadow-lg transition-all"
              >
                Submit Rating
              </button>
            </>
          )}
          {errorFeedback && (
            <p className="text-red-600 font-medium mt-2">{errorFeedback}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 text-center text-gray-600">
        <p>© 2025 WoodMoon Enterprise. All rights reserved.</p>
      </footer>
    </div>
  );
}
