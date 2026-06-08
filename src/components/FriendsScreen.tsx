import React, { useState } from "react";
import { Users, UserPlus, MessageSquare, Send, CheckCircle, Star, Sliders, HelpCircle, Volume2, Plus, Pin } from "lucide-react";

interface FriendSubmission {
  id: string;
  name: string;
  role: string;
  avatar: string;
  image: string;
  caption: string;
  occasion: string;
  ratingsBreakdown: { fit: number; color: number; vibe: number; occasion: number };
  comments: { author: string; text: string; pinIndex?: number }[];
}

const INITIAL_FRIEND_SUBMISSIONS: FriendSubmission[] = [
  {
    id: "f-sub-1",
    name: "Elena V.",
    role: "Vogue Guest Curator",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWT849ATgRumTqcQr6Omh7ZAAaqyEgWve2yKwdCC5720Y_Cxp99tJjuPTSQZ-renyewDsc8RALLqnIIZwUalq3vaEsDTvUueCPpKzaCoJQ6wzSVZjfGReIBNI-RfYnsE1qieip8jiIOds4sdOPuXEyK2yr9D4ptmZ3kuKHQPoPdvinTm6aLuQ7oqgg9CxCqDuCq7Qb8UOU6UD_uAvGUcb42FGD0C_HX5i0-fUhXoaSgBG46Y_c0RvYeSouEYwn8-Q_M7-1XZdbhs-j",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6",
    caption: "Trying out heavy dark linen with asymmetric silver collar loops. Check overall draping alignment.",
    occasion: "High-Fashion Gala",
    ratingsBreakdown: { fit: 9.4, color: 8.8, vibe: 9.1, occasion: 9.5 },
    comments: [
      { author: "Julian Black", text: "Heavy draping matches the venue perfectly.", pinIndex: 1 }
    ]
  },
  {
    id: "f-sub-2",
    name: "Julian S.",
    role: "Stealth Director",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUi2gsS1ybE0vQdr9244mdiUZwwzFlX9bQ_BY3TY8cQC-uEpEC6cettrzOw1GIYa_qmpxS3OjpdWeELt88sPxrblTxk1GCjbbKcRqrBw4X-mSKutluHqAsMAfrPGNfgXKWHKZnTQLQJc0Fm4xl8YmElh3b-rBfu9lapCAxytm3dCwljg7rojoUOj-H7j7xooEJYzbW4AmLrE_wVFZd6ZaXpSDLUrbeoaXombPdtZShymiJ3p4xnU6Qy4khPnWN_gN5_cT9BnnMFFo4",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg",
    caption: "Charcoal cashmere blazers layered back against wool tapered trousers. Does it balance?",
    occasion: "Corporate Pitch",
    ratingsBreakdown: { fit: 8.5, color: 9.2, vibe: 8.7, occasion: 9.0 },
    comments: []
  }
];

export default function FriendsScreen() {
  const [submissions, setSubmissions] = useState<FriendSubmission[]>(INITIAL_FRIEND_SUBMISSIONS);
  const [successMsg, setSuccessMsg] = useState("");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"Feed" | "Messages">("Feed");

  // Interaction variables for rating and commenting on a friend outfit
  const [activeCritiqueId, setActiveCritiqueId] = useState<string | null>(null);
  const [critiqueRating, setCritiqueRating] = useState(9);
  const [critiqueComment, setCritiqueComment] = useState("");
  const [critiqueCategory, setCritiqueCategory] = useState<"fit" | "color" | "vibe" | "occasion">("fit");

  const [messages, setMessages] = useState([
    { sender: "Elena V.", text: "Did you check the fit analytics breakdown from yesterday's submission? I think the draping was scored correctly.", time: "9:42 AM" },
    { sender: "Julian Black", text: "Agreed. The CPW looks stellar.", time: "9:51 AM" }
  ]);
  const [reply, setReply] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail) return;
    setSuccessMsg(`Access Key generated & dispatched directly to ${invitedEmail}!`);
    setInvitedEmail("");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setMessages([
      ...messages,
      { sender: "Julian Thorne", text: reply, time: "Just now" }
    ]);
    setReply("");
  };

  const submitCritique = (id: string) => {
    if (!critiqueComment.trim()) return;
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            comments: [
              ...sub.comments,
              { author: "Julian Thorne", text: critiqueComment }
            ],
            ratingsBreakdown: {
              ...sub.ratingsBreakdown,
              [critiqueCategory]: Number(((sub.ratingsBreakdown[critiqueCategory] + critiqueRating) / 2).toFixed(1))
            }
          };
        }
        return sub;
      })
    );
    setCritiqueComment("");
    setActiveCritiqueId(null);
    alert("Critique successfully applied to friend submission!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 space-y-10 bg-background-ink animate-fadeIn pb-24">
      
      {/* Title Header */}
      <header className="space-y-1.5 pb-4 border-b border-muted-teal/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#FFB3B6] uppercase block">
            PRIVATE DISCOURSE ORBIT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F7F5F5] font-bold tracking-tight">
            Inner Circle &amp; <span className="italic text-[#FFB3B6] font-normal">Peer Review</span>
          </h2>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#001c22] p-1.5 rounded-full border border-muted-teal/15 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("Feed")}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none transition-colors ${
              activeTab === "Feed" ? "bg-brand-red text-white animate-pulse" : "text-muted-teal hover:text-white"
            }`}
          >
            Review Friends Feed
          </button>
          <button
            onClick={() => setActiveTab("Messages")}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none transition-colors ${
              activeTab === "Messages" ? "bg-brand-red text-white" : "text-muted-teal hover:text-white"
            }`}
          >
            Direct Socket Thread
          </button>
        </div>
      </header>

      {/* 
        ======================================================================
        SIDEBAR: THEIR RATING OF YOU & ACTIVE STATUS INDEX
        ======================================================================
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Scoreboard averages and active peers roster (col-span-4) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Their Average of your recent look */}
          <section className="bg-[#001c22] p-5 sm:p-6 rounded-2xl border border-muted-teal/15 shadow-xl block text-left space-y-4">
            <div>
              <span className="text-[9px] font-bold text-muted-teal tracking-widest uppercase block font-mono">HUMAN VALIDATION SYNCHRONIZER</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight mt-1">Their Average of your look</h3>
            </div>
            
            <div className="flex items-baseline gap-1 bg-background-ink p-4 rounded-xl border border-muted-teal/10">
              <span className="text-4xl font-serif font-black text-brand-red">8.8</span>
              <span className="text-muted-teal text-xs font-mono">/ 10</span>
              <span className="text-[9px] text-[#FFB3B6] tracking-widest font-bold uppercase ml-auto">Strong Consensus</span>
            </div>

            {/* Multiple Category split view of your rating */}
            <div className="space-y-2 text-[10px] uppercase font-mono tracking-widest text-muted-teal pt-1">
              <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                <span>Fit Alignment:</span>
                <span className="text-white font-bold">9.2</span>
              </div>
              <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                <span>Color Harmony:</span>
                <span className="text-white font-bold">8.4</span>
              </div>
              <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                <span>Vibe Conformance:</span>
                <span className="text-white font-bold">8.9</span>
              </div>
              <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                <span>Event Matches:</span>
                <span className="text-white font-bold">8.7</span>
              </div>
            </div>
          </section>

          {/* Connected roster online state */}
          <section className="space-y-4 bg-[#001c22]/30 p-5 rounded-2xl border border-muted-teal/10 block text-left">
            <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block border-b border-muted-teal/5 pb-2">
              ONLINE STATUS COUNTER
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] font-bold text-white truncate">Elena V. (Active)</span>
                </div>
                <span className="text-[8px] font-mono text-muted-teal">FEEDBACK IN 5M</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-white truncate">Julian Black (Active)</span>
                </div>
                <span className="text-[8px] font-mono text-muted-teal">FEEDBACK INSTANT</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="w-2.5 h-2.5 rounded-full bg-muted-teal/40 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-muted-teal truncate">Marilyn Rose (Away)</span>
                </div>
                <span className="text-[8px] font-mono text-muted-teal">8h ago</span>
              </div>
            </div>
          </section>

          {/* Secure Circle Invitation Panel */}
          <section className="bg-[#001c22] p-5 rounded-2xl border border-muted-teal/15 shadow-xl space-y-4 block text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-red" /> PRIVATE DISCOVERY CODE
            </h3>
            <p className="text-[10px] text-muted-teal leading-relaxed">
              FADE is cryptographic and invite-only. Dispatch unique access tokens directly to peers.
            </p>
            <form onSubmit={handleInvite} className="space-y-3">
              <input
                type="email"
                placeholder="colleague@fade.exclusive"
                value={invitedEmail}
                onChange={(e) => setInvitedEmail(e.target.value)}
                className="w-full bg-background-ink border border-muted-teal/20 focus:border-brand-red rounded-xl py-2.5 px-3 text-xs text-on-surface outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-[10px] tracking-widest uppercase py-3 rounded-full transition-all cursor-pointer shadow-md select-none"
              >
                GENERATE DISPATCH TOKEN
              </button>
            </form>
            {successMsg && (
              <div className="p-2.5 bg-brand-red/5 border border-brand-red/25 rounded-md text-[9px] uppercase font-mono text-[#FFB3B6] text-center mt-2.5">
                {successMsg}
              </div>
            )}
          </section>

        </div>

        {/* Right Side Views (col-span-8) */}
        <div className="md:col-span-8 space-y-8">
          
          {activeTab === "Feed" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-muted-teal/10 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-teal text-left block">
                  REVIEW THEIR SUBMISSIONS
                </h3>
                <span className="text-[9px] text-brand-red font-bold uppercase font-mono">Private Shared Wardrobes</span>
              </div>

              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#001c22] border border-muted-teal/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col block text-left"
                >
                  <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-muted-teal/10">
                    {/* Img frame */}
                    <div className="sm:w-1/2 aspect-square relative bg-[#001014] shrink-0">
                      <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      
                      <div className="absolute top-3 left-3 bg-[#001c22]/95 border border-[#FFB3B6]/20 px-3 py-1 rounded-full text-[9px] font-bold text-[#FFB3B6]">
                        {sub.occasion.toUpperCase()}
                      </div>

                      {/* Floating review count pin indicator */}
                      <div className="absolute bottom-3 left-3 bg-background-ink/90 px-2.5 py-1 rounded-full border border-muted-teal/30 text-[9px] font-bold text-white">
                        📍 1 Critique Pin Latched
                      </div>
                    </div>

                    {/* Meta info & ratings breakdown */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-5">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3">
                          <img src={sub.avatar} alt={sub.name} className="w-8 h-8 rounded-full border border-brand-red object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="text-xs font-bold text-white leading-tight">{sub.name}</h4>
                            <p className="text-[9px] text-[#FFB3B6] uppercase tracking-wider font-extrabold">{sub.role}</p>
                          </div>
                        </div>

                        <p className="text-xs text-on-surface leading-relaxed font-serif italic">
                          "{sub.caption}"
                        </p>

                        {/* Interactive spreadsheet ratings metrics */}
                        <div className="pt-2 border-t border-muted-teal/5 space-y-2">
                          <span className="text-[9px] font-bold text-muted-teal uppercase tracking-widest block font-mono">Peer metrics weights</span>
                          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                            <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                              <span>Fit Weight:</span>
                              <span className="text-brand-red font-black">{sub.ratingsBreakdown.fit}</span>
                            </div>
                            <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                              <span>Chroma Map:</span>
                              <span className="text-brand-red font-black">{sub.ratingsBreakdown.color}</span>
                            </div>
                            <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                              <span>Aesthetic:</span>
                              <span className="text-brand-red font-black">{sub.ratingsBreakdown.vibe}</span>
                            </div>
                            <div className="flex justify-between border-b border-muted-teal/5 pb-1">
                              <span>Event Rule:</span>
                              <span className="text-brand-red font-black">{sub.ratingsBreakdown.occasion}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Critiques list */}
                      <div className="space-y-2">
                        <span className="text-[8px] font-bold text-muted-teal uppercase tracking-widest block font-mono">Activity comments</span>
                        {sub.comments.map((comment, cIndex) => (
                          <div key={cIndex} className="p-2 bg-background-ink border border-muted-teal/10 rounded text-[10px] font-sans">
                            <span className="text-white font-bold">{comment.author}: </span>
                            <span className="text-muted-teal italic">"{comment.text}"</span>
                          </div>
                        ))}
                      </div>

                      {/* Direct Critiquing forms */}
                      <div className="pt-4 border-t border-muted-teal/10">
                        {activeCritiqueId === sub.id ? (
                          <div className="space-y-3 bg-[#031518] p-3 rounded-xl border border-brand-red/30">
                            <div className="flex justify-between items-center text-[10px] text-white">
                              <span>Category:</span>
                              <select
                                value={critiqueCategory}
                                onChange={(e) => setCritiqueCategory(e.target.value as "fit" | "color" | "vibe" | "occasion")}
                                className="bg-background-ink border border-muted-teal/20 text-[9px] font-bold uppercase rounded px-1.5 py-0.5 text-[#FFB3B6]"
                              >
                                <option value="fit">📐 Silhouette Fit</option>
                                <option value="color">🎨 Chroma Color</option>
                                <option value="vibe">✨ Vibe Conform</option>
                                <option value="occasion">👔 Event Match</option>
                              </select>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-white">
                              <span>Rating: <span className="font-bold text-brand-red font-mono">{critiqueRating}/10</span></span>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={critiqueRating}
                                onChange={(e) => setCritiqueRating(Number(e.target.value))}
                                className="w-1/2 accent-brand-red"
                              />
                            </div>

                            <div className="flex gap-1">
                              <input
                                type="text"
                                placeholder="Add custom accessory pin commentary..."
                                value={critiqueComment}
                                onChange={(e) => setCritiqueComment(e.target.value)}
                                className="flex-grow bg-[#001014] text-[11px] py-1 px-2 border border-muted-teal/20 rounded focus:border-brand-red select-all outline-none"
                              />
                              <button
                                onClick={() => submitCritique(sub.id)}
                                className="bg-brand-red px-2.5 py-1 rounded text-[10px] font-bold text-white select-none whitespace-nowrap"
                              >
                                Rate Look
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveCritiqueId(sub.id);
                              setCritiqueRating(9);
                            }}
                            className="bg-brand-red py-2.5 w-full rounded-xl text-center text-white text-[10px] font-bold uppercase tracking-widest transition-transform select-none"
                          >
                            📝 LATCH ACCESSORY PIN &amp; RATE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#001c22]/50 p-6 rounded-2xl border border-muted-teal/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-muted-teal/10 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6] flex items-center gap-2 text-left">
                  <MessageSquare className="w-4 h-4 text-brand-red" /> ENCRYPTED CONTEXT DIRECT Direct Message Socket
                </h3>
                <span className="text-[9px] font-mono font-bold bg-muted-teal/10 text-[#FFB3B6] py-0.5 px-2 rounded-xl border border-muted-teal/15 uppercase tracking-wider">
                  Live direct chat
                </span>
              </div>

              {/* Message log */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar text-xs font-sans">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl max-w-[85%] space-y-1.5 shadow-md flex flex-col ${
                      m.sender === "Julian Thorne"
                        ? "ml-auto bg-[#ED254E]/10 border border-[#ED254E]/25 text-right items-end"
                        : "bg-background-ink border border-muted-teal/10 text-left items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[9px] text-muted-teal font-extrabold uppercase tracking-widest">
                      <span className={m.sender === "Julian Thorne" ? "text-[#FFB3B6]" : ""}>{m.sender}</span>
                      <span className="text-[8px] font-normal text-muted-teal/75">• {m.time}</span>
                    </div>
                    <p className="text-on-surface/90 leading-relaxed font-normal text-xs">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSend} className="flex gap-2 border-t border-muted-teal/10 pt-4">
                <input
                  type="text"
                  placeholder="Post styling feedback now..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-grow bg-background-ink border border-muted-teal/20 focus:border-brand-red rounded-xl py-3 px-4 text-xs text-on-surface outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 bg-brand-red hover:bg-brand-red/90 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                  aria-label="Send direct message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
