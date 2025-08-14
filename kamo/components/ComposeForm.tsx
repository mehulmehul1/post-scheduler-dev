"use client";

import { useState } from "react";
import { scheduleSchema } from "@/lib/validation";

export function ComposeForm() {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const payload = scheduleSchema.parse({
        text,
        imageUrl: imageUrl || undefined,
        scheduledAt: new Date(scheduledAt).toISOString(),
        fid: "1",
      });
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      setText("");
      setImageUrl("");
      setScheduledAt("");
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={280}
        className="w-full border p-2"
        placeholder="What's on your mind?"
        required
      />
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border p-2"
        placeholder="Image URL (optional)"
      />
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="w-full border p-2"
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
        Schedule
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Scheduled!</p>}
    </form>
  );
}

export default ComposeForm;
