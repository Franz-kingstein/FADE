import React, { useState } from "react";
import { UserProfile, Screen } from "../types";
import { SUBCULTURES } from "../data";
import { Copy, Plus, Trash2, Shield, RefreshCw, CheckCircle, Smartphone } from "lucide-react";

interface SettingScreenProps {
  profile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export default function SettingScreen({ profile, onChangeProfile, onLogout }: SettingScreenProps) {
  // Access Token State
  const [token, setToken] = useState("FD-992-XKL");
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  
  // Circle managers
  const [friendsList, setFriendsList] = useState([
    { name: "Alexander Vance", role: "Vanguard Member", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACAd1IZaOiN19uj0fUe8WYbtHfAdZoYkJaZcS7mcRxQROXSicx8lGmehXxExeVufBQ6VrFb6RCO7cmNS5zf5v1eKQ3sKrkKT36fmskPmOT99JnLUl0sNZjuD9bGCHz_Tmr-ibA9LJwV5QmzP0ILmAe5Nn2U9AZm2hYwAtGd3HaJurKcxOVzQrsaRQhuSHJWB9YYlCED0bQYvdJsW3pcJr69NhEOoj8MS6PzW4eKW1_gQjlIiTOIJPyoDv9cx5ObiX3tmUtXcUdu19H" },
    { name: "Elena Rossi", role: "Curator", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aj_LCmzJGr4QTezh3IABobr798-Kcc9YrtUAuyroxgkUx-8zK6sSUSxKZSa-CnVyIDoxvXoqb0PAUeaKRvcf7cEj-E7su3iVzLhxxVP_rs9GFx56seP82jDmm75-pr_IIHiZW1KrYZBKdMNDsaFoiys79dDd3SgNldPR_BESBlM4CG14MyD9yg2r2JSdNRQKLiopAE3LWk6fKk_1L19AdoSZ_sFW5FHt16tvs1fB3Fv2uFxGdSJVqbnSVsn19pemshscNCMQHyKt" },
    { name: "Marcello Wu", role: "Elite Member", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUi2gsS1ybE0vQdr9244mdiUZwwzFlX9bQ_BY3TY8cQC-uEpEC6cettrzOw1GIYa_qmpxS3OjpdWeELt88sPxrblTxk1GCjbbKcRqrBw4X-mSKutluHqAsMAfrPGNfgXKWHKZnTQLQJc0Fm4xl8YmElh3b-rBfu9lapCAxytm3dCwljg7rojoUOj-H7j7xooEJYzbW4AmLrE_wVFZd6ZaXpSDLUrbeoaXombPdtZShymiJ3p4xnU6Qy4khPnWN_gN5_cT9BnnMFFo4" }
  ]);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendRole, setNewFriendRole] = useState("Junior Stylist");

  const generateNewToken = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let generated = "FD-";
    for (let i = 0; i < 3; i++) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    generated += "-";
    for (let i = 0; i < 3; i++) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    setToken(generated);
    setCopied(false);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSubculture = (sub: string) => {
    const subs = profile.subcultures.includes(sub)
      ? profile.subcultures.filter((s) => s !== sub)
      : [...profile.subcultures, sub];
    onChangeProfile({
      ...profile,
      subcultures: subs
    });
  };

  const toggleSetting = (key: keyof typeof profile.settings) => {
    onChangeProfile({
      ...profile,
      settings: {
        ...profile.settings,
        [key]: !profile.settings[key]
      }
    });
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    setFriendsList([
      ...friendsList,
      {
        name: newFriendName,
        role: newFriendRole,
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWT849ATgRumTqcQr6Omh7ZAAaqyEgWve2yKwdCC5720Y_Cxp99tJjuPTSQZ-renyewDsc8RALLqnIIZwUalq3vaEsDTvUueCPpKzaCoJQ6wzSVZjfGReIBNI-RfYnsE1qieip8jiIOds4sdOPuXEyK2yr9D4ptmZ3kuKHQPoPdvinTm6aLuQ7oqgg9CxCqDuCq7Qb8UOU6UD_uAvGUcb42FGD0C_HX5i0-fUhXoaSgBG46Y_c0RvYeSouEYwn8-Q_M7-1XZdbhs-j"
      }
    ]);
    setNewFriendName("");
    setCustomMsg("Circle member invited to syndicate!");
    setTimeout(() => setCustomMsg(""), 3000);
  };

  const handleDeleteFriend = (name: string) => {
    setFriendsList(friendsList.filter(f => f.name !== name));
  };

  const purgeBiometrics = () => {
    onChangeProfile({
      ...profile,
      measurements: { shoulder: 0, chest: 0, waist: 0, hip: 0 },
      bodyShape: "Purged Frame"
    });
    setCustomMsg("Biometric databases purged safely");
    setTimeout(() => setCustomMsg(""), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12 bg-background-ink mb-16 animate-fadeIn pb-16">
      
      {/* User Header Block */}
      <section className="flex flex-col items-center text-center space-y-4 pb-6 sm:pb-8 border-b border-muted-teal/10">
        <div className="relative group">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-24 h-24 rounded-full border-2 border-brand-red object-cover shadow-2xl group-hover:scale-103 duration-300 transition-transform"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-0 right-1 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center border-2 border-background-ink shadow-lg">
            <Smartphone className="w-3 h-3 text-white" />
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F5F5] font-bold">
            {profile.name}
          </h2>
          <p className="text-xs font-sans text-muted-teal tracking-wider uppercase">
            {profile.email}
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={onLogout}
          className="px-8 py-3 rounded-full border border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer focus:outline-none"
        >
          Logout
        </button>
      </section>

      {/* Message Notifications banner */}
      {customMsg && (
        <div className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-2xl text-xs tracking-wider uppercase text-[#FFB3B6] flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-[#FFB3B6]" />
          {customMsg}
        </div>
      )}

      {/* Style Subcultures / Aesthetic Style Tuner */}
      <section className="space-y-4">
        <div className="flex justify-between items-baseline px-1">
          <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase">
            AESTHETIC STYLE TUNER (AI RECALIBRATION)
          </h3>
          <span className="text-[10px] font-sans text-brand-red font-bold uppercase tracking-wider">{profile.subcultures.length} / {SUBCULTURES.length} Calibrated</span>
        </div>
        <p className="text-[10px] text-muted-teal leading-relaxed px-1">
          Specify your exact subculture worlds. FADE automatically recalibrates its computer vision matrix logic to evaluate silhouettes and apparel balance within the guidelines of your selected aesthetics rather than generic mainstream rules.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {SUBCULTURES.map((sub) => {
            const isActive = profile.subcultures.includes(sub);
            return (
              <button
                key={sub}
                onClick={() => toggleSubculture(sub)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-red border border-brand-red text-white shadow-[0_4px_12px_rgba(237,37,78,0.2)]"
                    : "border border-muted-teal/30 text-on-surface hover:border-[#FFB3B6]"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </section>

      {/* Personalization Matrix & Weight Balancers */}
      <section className="space-y-5">
        <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block px-1">
          AI PERSONALIZATION MATRIX
        </h3>
        <div className="space-y-4 bg-[#001c22]/50 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 shadow-lg">
          
          <div className="flex items-center justify-between gap-5">
            <div>
              <h4 className="text-xs font-bold text-on-surface">Brutalist Honesty</h4>
              <p className="text-[10px] text-muted-teal mt-0.5">AI will not sugarcoat critiques on proportions.</p>
            </div>
            <button
              onClick={() => toggleSetting("brutalistHonesty")}
              className={`w-11 h-6 rounded-full p-0.5 transition-all flex items-center cursor-pointer flex-shrink-0 focus:outline-none ${
                profile.settings.brutalistHonesty ? "bg-brand-red justify-end" : "bg-muted-teal/60 justify-start"
              }`}
              aria-label="Toggle Brutalist Honesty"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-lg" />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-muted-teal/10 pt-4 gap-5">
            <div>
              <h4 className="text-xs font-bold text-on-surface">Trend Anticipation</h4>
              <p className="text-[10px] text-muted-teal mt-0.5">Focus scoring on future-facing trends over classics.</p>
            </div>
            <button
              onClick={() => toggleSetting("trendAnticipation")}
              className={`w-11 h-6 rounded-full p-0.5 transition-all flex items-center cursor-pointer flex-shrink-0 focus:outline-none ${
                profile.settings.trendAnticipation ? "bg-brand-red justify-end" : "bg-muted-teal/60 justify-start"
              }`}
              aria-label="Toggle Trend Anticipation"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-lg" />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-muted-teal/10 pt-4 gap-5">
            <div>
              <h4 className="text-xs font-bold text-on-surface">Color Theory Strictness</h4>
              <p className="text-[10px] text-muted-teal mt-0.5">Flag palette dissonance more aggressively.</p>
            </div>
            <button
              onClick={() => toggleSetting("colorTheoryStrictness")}
              className={`w-11 h-6 rounded-full p-0.5 transition-all flex items-center cursor-pointer flex-shrink-0 focus:outline-none ${
                profile.settings.colorTheoryStrictness ? "bg-brand-red justify-end" : "bg-[#001014] justify-start"
              }`}
              aria-label="Toggle Color Theory Strictness"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-lg z-10" />
            </button>
          </div>

          {/* AI Score vs Friends Consensus Balance Weighing */}
          <div className="border-t border-muted-teal/10 pt-4 space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs font-bold text-on-surface">Consensus Score Balance Weighing</h4>
              <span className="text-[10px] font-mono font-bold text-brand-red">75% AI / 25% Peer</span>
            </div>
            <p className="text-[10px] text-muted-teal">Select how aggressively recommending algorithms balance structural AI telemetry vs qualitative peer rating averages.</p>
            <input 
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full accent-brand-red cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-muted-teal font-mono">
              <span>Weighted Friend consensus</span>
              <span>Weighted AI Diagnostic</span>
            </div>
          </div>

        </div>
      </section>

      {/* Anthropometric Profile */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block px-1">
          ANTHROPOMETRIC PROFILE
        </h3>
        <div className="bg-[#001c22] p-5 sm:p-6 rounded-2xl border border-muted-teal/15 shadow-lg space-y-6">
          <div className="flex justify-between items-baseline pb-4 border-b border-muted-teal/10">
            <span className="text-xs text-muted-teal uppercase font-bold tracking-wider">Body Shape Layout</span>
            <span className="text-base font-serif font-bold text-[#FFB3B6]">{profile.bodyShape}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#001014] p-4 rounded-xl border border-muted-teal/15 text-left">
              <span className="text-[9px] uppercase text-muted-teal font-sans tracking-widest font-bold">SHOULDERS</span>
              <p className="text-xl font-serif text-white mt-1 font-black">
                {profile.measurements.shoulder ? `${profile.measurements.shoulder}cm` : "Purged"}
              </p>
            </div>
            <div className="bg-[#001014] p-4 rounded-xl border border-muted-teal/15 text-left">
              <span className="text-[9px] uppercase text-muted-teal font-sans tracking-widest font-bold">WAISTLINE</span>
              <p className="text-xl font-serif text-white mt-1 font-black">
                {profile.measurements.waist ? `${profile.measurements.waist}cm` : "Purged"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Utility */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block px-1">
          SUSTAINABLE UTILITY
        </h3>
        <div className="bg-[#001c22]/50 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h4 className="text-xs font-bold text-on-surface">Cost-Per-Wear (CPW)</h4>
              <p className="text-[10px] text-muted-teal mt-0.5">Auto-calculate wear counts vs retail metrics.</p>
            </div>
            <button
              onClick={() => toggleSetting("cpwTracking")}
              className={`w-11 h-6 rounded-full p-0.5 transition-all flex items-center cursor-pointer flex-shrink-0 focus:outline-none ${
                profile.settings.cpwTracking ? "bg-brand-red justify-end" : "bg-muted-teal/60 justify-start"
              }`}
              aria-label="Toggle Cost Per Wear tracking"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-lg" />
            </button>
          </div>
        </div>
      </section>

      {/* Access Token Generator */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block px-1">
          SHOWROOM ACCESS TOKEN
        </h3>
        <div className="bg-[#001c22] p-5 sm:p-6 rounded-2xl border border-muted-teal/15 shadow-xl text-center space-y-6">
          <div className="relative bg-[#001014] border border-muted-teal/20 rounded-xl p-5 flex items-center justify-between">
            <span className="font-mono text-lg text-[#FFB3B6] tracking-widest font-extrabold">{token}</span>
            <button
              onClick={copyToken}
              className="p-2.5 hover:bg-[#001c22] rounded-xl text-muted-teal hover:text-white transition-all cursor-pointer"
              title="Copy Token"
            >
              {copied ? (
                <span className="text-[10px] font-sans font-bold text-green-500 uppercase tracking-widest">
                  Copied
                </span>
              ) : (
                <Copy className="w-4 h-4 text-muted-teal" />
              )}
            </button>
          </div>

          <button
            onClick={generateNewToken}
            className="w-full bg-[#ED254E] hover:bg-[#ED254E]/90 text-white font-bold text-[10px] tracking-widest uppercase py-4 rounded-full transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(237,37,78,0.25)] focus:outline-none"
          >
            <RefreshCw className="w-4 h-4" /> Generate New Code
          </button>
        </div>
      </section>

      {/* Share QR Access block */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block px-1">
          SHARE QR ACCESS PASS
        </h3>
        <div className="bg-[#001c22]/55 p-6 sm:p-8 rounded-2xl border border-muted-teal/10 shadow-lg flex flex-col items-center">
          <div className="w-36 h-36 border border-muted-teal/30 p-2.5 rounded-xl bg-white flex items-center justify-center shadow-inner relative">
            {/* Custom stylized QR block details */}
            <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1.5">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${(i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 4 || i === 20 || i === 24 ? "bg-[#001014]" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
          <span className="text-[9px] font-sans font-bold tracking-widest text-muted-teal uppercase mt-4 text-center">
            QR Pass for offline showroom checks
          </span>
        </div>
      </section>

      {/* Circle Management */}
      <section className="space-y-6">
        <div className="flex justify-between items-baseline px-1">
          <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase">
            CIRCLE ROSTER MANAGEMENT
          </h3>
        </div>

        {/* Invite Friend Form */}
        <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-3 bg-[#001c22]/40 p-4 rounded-2xl border border-muted-teal/10">
          <input
            type="text"
            placeholder="Name"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            className="flex-1 bg-background-ink border border-muted-teal/20 focus:border-brand-red rounded-xl py-3 px-4 text-xs text-on-surface outline-none transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={newFriendRole}
            onChange={(e) => setNewFriendRole(e.target.value)}
            className="flex-1 bg-background-ink border border-muted-teal/20 focus:border-brand-red rounded-xl py-3 px-4 text-xs text-on-surface outline-none transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-brand-red hover:bg-brand-red/90 text-white font-extrabold text-[10px] py-3 px-5 rounded-full transition-colors cursor-pointer uppercase tracking-widest flex-shrink-0"
          >
            Add Member
          </button>
        </form>

        {/* Friend circles roster list */}
        <div className="space-y-3">
          {friendsList.map((f) => (
            <div
              key={f.name}
              className="bg-[#001c22] p-4 rounded-2xl border border-muted-teal/10 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <img
                  src={f.avatar}
                  alt={f.name}
                  className="w-10 h-10 rounded-full border border-muted-teal/30 object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-sans font-bold text-on-surface truncate">
                    {f.name}
                  </h4>
                  <p className="text-[10px] text-muted-teal truncate">
                    {f.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteFriend(f.name)}
                className="p-2 hover:bg-background-ink rounded-full text-muted-teal hover:text-brand-red transition-all cursor-pointer flex-shrink-0"
                title="Remove peer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Audit & Privacy Controls */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase flex items-center gap-2 px-1">
          <Shield className="w-3.5 h-3.5 text-brand-red" /> DATA SECURITY AUDIT
        </h3>
        <div className="bg-[#001c22] p-4.5 rounded-2xl border border-muted-teal/15 shadow-md flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-on-surface">Purge Biometric Data</h4>
            <p className="text-[10px] text-muted-teal mt-0.5">Delete all body dimensions and scans securely.</p>
          </div>
          <button
            onClick={purgeBiometrics}
            className="p-2.5 hover:bg-brand-red/10 rounded-full text-muted-teal hover:text-brand-red transition-all cursor-pointer"
            title="Purge database"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
}
