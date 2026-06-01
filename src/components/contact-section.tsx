"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  Heart,
  Bug,
  Lightbulb,
  Star,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

const CONTACT_EMAIL = "nikunj.gupta011@gmail.com";

const FEEDBACK_TYPES = [
  { value: "feature",  label: "Feature Request", icon: Lightbulb, color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  { value: "bug",      label: "Bug Report",       icon: Bug,       color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20" },
  { value: "feedback", label: "General Feedback", icon: Star,      color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { value: "love",     label: "Just saying hi 👋", icon: Heart,     color: "text-pink-400",   bg: "bg-pink-500/10",   border: "border-pink-500/20" },
];

export default function ContactSection() {
  const [selectedType, setSelectedType] = useState("feedback");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const selected = FEEDBACK_TYPES.find(f => f.value === selectedType)!;
  const SelectedIcon = selected.icon;

  function handleMailto() {
    if (!message.trim()) return;
    const subject = encodeURIComponent(
      `[Occasionly] ${selected.label}${name ? ` from ${name}` : ""}`
    );
    const body = encodeURIComponent(
      `Hi Nikunj,\n\n${message}\n\n${name ? `— ${name}` : "— Occasionly User"}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage("");
      setName("");
    }, 3000);
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Get in touch
        </p>
        <h2 className="text-2xl font-bold text-white mt-1">Contact & Feedback</h2>
        <p className="text-xs text-gray-500 mt-1">
          Ideas, bugs, or just want to say hello — we read everything.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Feedback form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-5"
        >
          {/* Type selector */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
              What&apos;s this about?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FEEDBACK_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? `${type.bg} ${type.border} ${type.color}`
                        : "bg-white/[0.02] border-white/8 text-gray-500 hover:border-white/15 hover:text-gray-300"
                    }`}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Your name <span className="normal-case font-normal text-gray-600">(optional)</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul"
              className="w-full border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-white/5 text-gray-200 placeholder-gray-600 text-sm transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedType === "bug"
                  ? "Describe what happened and how to reproduce it..."
                  : selectedType === "feature"
                  ? "What feature would make Occasionly better for you?"
                  : selectedType === "love"
                  ? "Tell us what you think 😊"
                  : "Share your thoughts, suggestions, or feedback..."
              }
              rows={4}
              className="w-full border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-white/5 text-gray-200 placeholder-gray-600 text-sm transition resize-none"
            />
          </div>

          {/* Send button */}
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl py-3 text-sm font-semibold"
              >
                <CheckCircle2 size={16} />
                Message opened — thanks!
              </motion.div>
            ) : (
              <motion.button
                key="send"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMailto}
                disabled={!message.trim()}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer shadow-lg shadow-violet-600/20"
              >
                <Send size={15} />
                Send via Email
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right — Info cards */}
        <div className="space-y-4">
          {/* Direct email */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-200 text-sm">Direct Email</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Reach out directly for anything — support, collaboration, or just to say hi.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors duration-150"
                >
                  {CONTACT_EMAIL}
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Response time */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-200 text-sm">Response Time</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Typically reply within 24–48 hours. All feedback is read personally — no bots, no auto-replies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* About card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-violet-500/15 bg-violet-500/5 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-violet-300" />
              </div>
              <div>
                <p className="font-semibold text-violet-200 text-sm">Built with care</p>
                <p className="text-xs text-violet-300/60 mt-1 leading-relaxed">
                  Occasionly is a personal project built to help people stay meaningfully connected. Your feedback directly shapes what gets built next.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
