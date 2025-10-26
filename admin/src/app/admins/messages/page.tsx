"use client";

import { useEffect, useState } from "react";
import { Trash2, Send, Mail, MailOpen, Star } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  replied: boolean;
  responseMessage: string;
  createdAt?: string;
  starred?: boolean;
  type?: string;
  rating?: number;
}

export default function MessagesPage() {
  const API_URL = "http://localhost:8080/api/contact";
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [sortOrder, setSortOrder] = useState("newest");
  const [messageType, setMessageType] = useState<"questions" | "feedbacks" | "ratings">(
    "questions"
  );
  const [ratingSummary, setRatingSummary] = useState<{
    averageRating: number;
    totalFeedbacks: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch messages or ratings
  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      if (messageType === "ratings") {
        const res = await fetch(`${API_URL}/ratings-summary`);
        if (res.ok) {
          const data = await res.json();
          setRatingSummary(data);
        }
        setMessages([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/${messageType}`);
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data || [];

        let sortedData = [...data];
        if (sortOrder === "newest") {
          sortedData.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortOrder === "oldest") {
          sortedData.sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortOrder === "unread") {
          sortedData = sortedData.filter((m: any) => !m.replied);
        } else if (sortOrder === "starred") {
          sortedData = sortedData.filter((m: any) => m.starred);
        }

        setMessages(sortedData);
      } else {
        setError("Server error while fetching messages.");
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [messageType, sortOrder]);

  // ✅ Reply
  const handleReply = async (id: number) => {
    const text = replyText[id];
    if (!text) return;

    try {
      const res = await fetch(`${API_URL}/reply/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseMessage: text }),
      });
      if (res.ok) {
        setReplyText({ ...replyText, [id]: "" });
        fetchMessages();
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // ✅ Toggle star
  const toggleStar = async (id: number) => {
    const updated = messages.map((msg) =>
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    );
    setMessages(updated);

    try {
      await fetch(`${API_URL}/star/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          starred: !messages.find((m) => m.id === id)?.starred,
        }),
      });
    } catch {
      console.warn("Highlight not persisted — backend may not have star endpoint.");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-md">
        Client Messages
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-8">
        <button
          onClick={() => setMessageType("questions")}
          className={`px-8 py-4 text-lg rounded-2xl font-bold shadow-md transition-transform duration-300 ${
            messageType === "questions"
              ? "bg-blue-600 text-white scale-105"
              : "bg-gray-100 text-gray-800 hover:bg-blue-100"
          }`}
        >
          💬 Questions
        </button>

        <button
          onClick={() => setMessageType("feedbacks")}
          className={`px-8 py-4 text-lg rounded-2xl font-bold shadow-md transition-transform duration-300 ${
            messageType === "feedbacks"
              ? "bg-amber-400 text-white scale-105"
              : "bg-gray-100 text-gray-800 hover:bg-amber-100"
          }`}
        >
          📝 Feedbacks
        </button>

        <button
          onClick={() => setMessageType("ratings")}
          className={`px-8 py-4 text-lg rounded-2xl font-bold shadow-md transition-transform duration-300 ${
            messageType === "ratings"
              ? "bg-green-500 text-white scale-105"
              : "bg-gray-100 text-gray-800 hover:bg-green-100"
          }`}
        >
          ⭐ Ratings
        </button>
      </div>

      {/* Sort Menu */}
      {messageType !== "ratings" && (
        <div className="flex items-center gap-3 justify-center">
          <label className="font-medium text-gray-700 text-lg">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="unread">Unread</option>
            <option value="starred">Starred</option>
          </select>
        </div>
      )}

      {/* Loading / Error */}
      {loading && <p className="text-gray-500 text-center">Loading messages...</p>}
      {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

      {/* Ratings Summary */}
      {messageType === "ratings" && ratingSummary && (
        <div className="mt-8 p-8 rounded-2xl border bg-green-50 shadow text-center max-w-xl mx-auto">
          <h2 className="text-4xl font-bold text-green-700 mb-3">⭐ Ratings Summary</h2>
          <p className="text-xl text-gray-700">
            Average Rating: <strong>{ratingSummary.averageRating}</strong> / 5
          </p>
          <p className="text-lg text-gray-600">
            Total Count: <strong>{ratingSummary.totalFeedbacks}</strong>
          </p>
          <div className="flex justify-center mt-4 text-yellow-400 text-5xl">
            {"★".repeat(Math.round(ratingSummary.averageRating))}
            {"☆".repeat(5 - Math.round(ratingSummary.averageRating))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messageType !== "ratings" &&
        !loading &&
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-2xl border shadow-sm transition ${
              msg.starred
                ? "bg-yellow-50 border-yellow-300"
                : msg.replied
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  {msg.replied ? (
                    <MailOpen className="text-green-600 w-5 h-5" />
                  ) : (
                    <Mail className="text-blue-600 w-5 h-5" />
                  )}
                  <h2 className="text-xl font-semibold">{msg.name}</h2>
                </div>
                <p className="text-sm text-gray-600">{msg.email}</p>
                <p className="text-sm text-gray-400">{formatDate(msg.createdAt)}</p>
                <p className="mt-2 text-gray-800">{msg.message}</p>

                {/* Stars for feedbacks */}
                {msg.type === "feedback" && msg.rating && (
                  <div className="mt-2 text-yellow-500 text-lg">
                    {"★".repeat(msg.rating)}{"☆".repeat(5 - msg.rating)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleStar(msg.id)}
                  title={msg.starred ? "Unstar" : "Star"}
                  className={`${
                    msg.starred
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                >
                  <Star
                    className="w-5 h-5"
                    fill={msg.starred ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ✅ Reply / Response */}
            {msg.replied ? (
              <div className="mt-3 p-3 border rounded-md bg-green-50 text-gray-800">
                <strong>Response:</strong> {msg.responseMessage}
              </div>
            ) : (
              messageType === "questions" && (
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[msg.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [msg.id]: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                  />
                  <button
                    onClick={() => handleReply(msg.id)}
                    className="bg-blue-600 text-white px-4 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" /> Reply
                  </button>
                </div>
              )
            )}
          </div>
        ))}
    </div>
  );
}
