import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  Search,
  Trash2,
  CheckCircle,
  Eye,
  X,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/inbox")({
  component: AdminInbox,
});

function AdminInbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [replyNotes, setReplyNotes] = useState("");

  useEffect(() => {
    loadInbox();
  }, [statusFilter]);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const data = await api.getInboxAdmin(statusFilter === "all" ? undefined : statusFilter);
      setMessages(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg: any) => {
    setSelectedMsg(msg);
    setReplyNotes(msg.reply_notes || "");
    if (msg.status === "unread") {
      try {
        await api.updateMessageStatus(msg.id, { status: "read" });
        setMessages(messages.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMsg) return;
    try {
      const updated = await api.updateMessageStatus(selectedMsg.id, {
        reply_notes: replyNotes,
        status: "replied",
      });
      setMessages(messages.map((m) => (m.id === selectedMsg.id ? updated : m)));
      setSelectedMsg(updated);
      alert("Inquiry notes saved!");
    } catch (err: any) {
      alert(err.message || "Failed to save notes");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this inquiry message?")) return;
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete message");
    }
  };

  return (
    <AdminLayout
      title="Classified Inquiries Inbox"
      subtitle="Public Inquiries & Investigation Requests"
    >
      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
        {["all", "unread", "read", "replied"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-blood text-white font-bold"
                : "bg-white/[0.03] text-white/50 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Decrypting Transmission Inbox...
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <h3 className="font-display text-lg uppercase text-white">No Inquiries Found</h3>
          <p className="mt-1 font-mono text-xs text-white/40">New public submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden divide-y divide-white/[0.05]">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => handleOpenMessage(m)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMsg?.id === m.id
                    ? "bg-white/[0.06]"
                    : m.status === "unread"
                    ? "bg-blood/10 hover:bg-blood/15"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-white">{m.name}</span>
                  <span className="font-mono text-[9px] text-white/40">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-mono text-xs text-blood font-semibold mt-0.5 truncate">{m.subject}</div>
                <p className="font-sans text-xs text-white/50 mt-1 line-clamp-2">{m.message}</p>
              </div>
            ))}
          </div>

          {/* Viewer */}
          <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#070707] p-6">
            {selectedMsg ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-white">{selectedMsg.subject}</h3>
                    <div className="font-mono text-xs text-white/50 mt-1">
                      From: <span className="text-white font-semibold">{selectedMsg.name}</span> ({selectedMsg.email})
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="p-2 text-white/40 hover:text-blood transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 font-sans text-sm text-white/90 whitespace-pre-line leading-relaxed">
                  {selectedMsg.message}
                </div>

                {/* Internal Reply Notes */}
                <div className="space-y-2 font-mono text-xs">
                  <label className="block uppercase text-white/50">Internal Case Notes / Reply Log</label>
                  <textarea
                    rows={4}
                    value={replyNotes}
                    onChange={(e) => setReplyNotes(e.target.value)}
                    placeholder="Log agent response or investigation actions taken..."
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-xs outline-none focus:border-blood"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90"
                  >
                    Save Notes & Mark Replied
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center font-mono text-xs text-white/40">
                Select an inquiry from the left to view full transmission.
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
