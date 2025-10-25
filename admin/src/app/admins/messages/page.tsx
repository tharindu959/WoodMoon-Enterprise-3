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
  starred?: boolean; // ⭐ new field for highlights
}

export default function MessagesPage() {
  const API_URL = "http://localhost:8090/api/contact";
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [sortOrder, setSortOrder] = useState("newest");

  // ✅ Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        let data = await res.json();

        // Sort options
        if (sortOrder === "newest") {
          data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortOrder === "oldest") {
          data.sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortOrder === "unread") {
          data = data.filter((m: any) => !m.replied);
        } else if (sortOrder === "starred") {
          data = data.filter((m: any) => m.starred);
        }

        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [sortOrder]);

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

  // ✅ Toggle star (highlight)
  const toggleStar = async (id: number) => {
    const updated = messages.map((msg) =>
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    );
    setMessages(updated);

    // Optional backend sync (if you want to save stars)
    try {
      await fetch(`${API_URL}/star/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !messages.find((m) => m.id === id)?.starred }),
      });
    } catch {
      console.warn("Highlight not persisted — backend endpoint not implemented yet.");
    }
  };

  // ✅ Format time
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Client Messages
        </h1>

        {/* Sorting */}
        <div className="flex items-center gap-3">
          <label className="font-medium text-gray-700">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="unread">Unread</option>
            <option value="starred">Starred</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500">No messages found.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-xl border shadow-sm transition ${
              msg.starred
                ? "bg-yellow-50 border-yellow-300"
                : msg.replied
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  {msg.replied ? (
                    <MailOpen className="text-green-600 w-5 h-5" />
                  ) : (
                    <Mail className="text-blue-600 w-5 h-5" />
                  )}
                  <h2 className="text-lg font-semibold">{msg.name}</h2>
                </div>
                <p className="text-sm text-gray-600">{msg.email}</p>
                <p className="text-sm text-gray-400">{formatDate(msg.createdAt)}</p>
                <p className="mt-2 text-gray-800">{msg.message}</p>
              </div>

              {/* Actions: Star + Delete */}
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
                  <Star className="w-5 h-5" fill={msg.starred ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reply or Response */}
            {msg.replied ? (
              <div className="mt-3 p-3 border rounded-md bg-green-50 text-gray-800">
                <strong>Response:</strong> {msg.responseMessage}
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
