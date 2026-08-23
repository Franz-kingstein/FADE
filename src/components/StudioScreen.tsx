import React, { useState, useEffect, useRef } from "react";
import { Camera, Image as ImageIcon, Users, AlertCircle, CheckCircle, Sparkles, Send, Play, MapPin, Sliders, Volume2, HelpCircle } from "lucide-react";

const OUTFIT_PRESETS = [
  {
    id: "preset-1",
    name: "Avant-Garde Architectural Silhouette",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6",
    scores: { harmony: 94, balance: 89, seasonal: 91, occasion: 95, overall: 9.2 }
  },
  {
    id: "preset-2",
    name: "Minimalist Cashmere & Tailored Wool",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg",
    scores: { harmony: 88, balance: 92, seasonal: 85, occasion: 90, overall: 8.9 }
  },
  {
    id: "preset-3",
    name: "Cyber Punk Technical Shell",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACAd1IZaOiN19uj0fUe8WYbtHfAdZoYkJaZcS7mcRxQROXSicx8lGmehXxExeVufBQ6VrFb6RCO7cmNS5zf5v1eKQ3sKrkKT36fmskPmOT99JnLUl0sNZjuD9bGCHz_Tmr-ibA9LJwV5QmzP0ILmAe5Nn2U9AZm2hYwAtGd3HaJurKcxOVzQrsaRQhuSHJWB9YYlCED0bQYvdJsW3pcJr69NhEOoj8MS6PzW4eKW1_gQjlIiTOIJPyoDv9cx5ObiX3tmUtXcUdu19H",
    scores: { harmony: 96, balance: 95, seasonal: 90, occasion: 86, overall: 9.4 }
  }
];

const OCCASIONS = [
  "Corporate Pitch",
  "Casual Brunch",
  "High-Fashion Gala",
  "Content Film Set",
  "After Hours"
];

interface Pin {
  x: number;
  y: number;
  note: string;
  tag: "Elevate" | "Appreciate";
  rating: number;
}

export default function StudioScreen() {
  const [selectedOutfit, setSelectedOutfit] = useState(OUTFIT_PRESETS[0]);
  const [occasion, setOccasion] = useState("Corporate Pitch");
  const [inputMode, setInputMode] = useState<"Camera" | "Gallery">("Camera");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Scored meters
  const [scores, setScores] = useState({ ...OUTFIT_PRESETS[0].scores });
  const [customFile, setCustomFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sound response simulator
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Pin point commentary
  const [pins, setPins] = useState<Pin[]>([
    { x: 48, y: 32, note: "Stellar lapel draping. Perfect structural accent.", tag: "Appreciate", rating: 9 },
    { x: 50, y: 72, note: "Narrow the belt line to amplify the waist ratio.", tag: "Elevate", rating: 8 }
  ]);
  const [editingPin, setEditingPin] = useState<{ x: number; y: number } | null>(null);
  const [newPinNote, setNewPinNote] = useState("");
  const [newPinTag, setNewPinTag] = useState<"Elevate" | "Appreciate">("Appreciate");
  const [newPinRating, setNewPinRating] = useState(9);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Simulate evaluation diagnostic countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + 15;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const triggerEvaluation = () => {
    setIsRunning(true);
    setProgress(15);
    setIsSubmitted(true);

    // Calculate variations based on Selected Preset & Occasion Rules
    setTimeout(() => {
      let penalty = occasion === "Corporate Pitch" ? -5 : 4;
      const baseScores = selectedOutfit.scores;
      setScores({
        harmony: Math.min(100, Math.max(60, baseScores.harmony + penalty)),
        balance: Math.min(100, Math.max(60, baseScores.balance + Math.floor(penalty / 2))),
        seasonal: Math.min(100, Math.max(60, baseScores.seasonal + (penalty > 0 ? 3 : -2))),
        occasion: Math.min(100, Math.max(60, baseScores.occasion + (penalty * 1.5))),
        overall: Math.min(10.0, Math.max(5.0, Number((baseScores.overall + (penalty / 15)).toFixed(1))))
      });
      setIsRunning(false);
      setProgress(100);
    }, 3500);
  };

  const handlePresetSelect = (preset: typeof OUTFIT_PRESETS[0]) => {
    setSelectedOutfit(preset);
    setCustomFile(null);
    setScores({ ...preset.scores });
    setIsSubmitted(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomFile(url);
      setScores({
        harmony: 82,
        balance: 78,
        seasonal: 74,
        occasion: 80,
        overall: 8.1
      });
      setIsSubmitted(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setEditingPin({ x, y });
    setNewPinNote("");
  };

  const savePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPin || !newPinNote.trim()) return;
    setPins([
      ...pins,
      {
        x: editingPin.x,
        y: editingPin.y,
        note: newPinNote,
        tag: newPinTag,
        rating: newPinRating
      }
    ]);
    setEditingPin(null);
    setNewPinNote("");
  };

  const handleVoicePreview = () => {
    setIsPlayingVoice(true);
    setTimeout(() => setIsPlayingVoice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-10 bg-background-ink animate-fadeIn pb-24">
      
      {/* Page Title Header */}
      <header className="space-y-1 pb-4 sm:pb-6 border-b border-muted-teal/10 mb-8">
        <span className="text-[10px] font-bold tracking-widest text-[#FFB3B6] uppercase block">
          AVANT-GARDE EVALUATION PORTAL
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F7F5F5] font-bold tracking-tight">
          Studio &amp; <span className="italic text-[#FFB3B6] font-normal">Diagnostic Engine</span>
        </h2>
        <p className="text-xs text-muted-teal font-sans">
          Upload whole garments, align focus vectors, configure target rulesets, and drop critique pins with the syndicate.
        </p>
      </header>

      {/* Responsive Grid Structure: Stacks on mobile, flows perfectly on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (Upload Coordinates, Preset Catalogs & Occasion Tags) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Upload Canvas Block */}
          <section className="space-y-4">
            <div className="flex justify-between items-baseline px-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-teal">
                GARMENT WORKPLACE PREVIEW
              </h3>
              <span className="text-[10px] text-brand-red font-semibold font-mono uppercase">
                {inputMode === "Camera" ? "Live Focus Matrix" : "Static Lookbook Upload"}
              </span>
            </div>

            <div 
              ref={imageContainerRef}
              onClick={handleImageClick}
              className="relative w-full aspect-square sm:aspect-[4/5] bg-[#001014] rounded-2xl overflow-hidden border border-muted-teal/20 group shadow-[0_20px_50px_rgba(0,0,0,0.65)] cursor-crosshair"
            >
              
              {/* Camera focus aligning guides (stripping background distraction preview) */}
              {inputMode === "Camera" && (
                <div className="absolute inset-0 border-[24px] border-[#001014]/65 pointer-events-none z-10 flex items-center justify-center">
                  <div className="w-[85%] h-[85%] border border-dashed border-[#FFB3B6]/30 rounded-lg relative flex items-center justify-center">
                    <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-brand-red font-black" />
                    <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-brand-red font-black" />
                    <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-brand-red font-black" />
                    <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-brand-red font-black" />
                    
                    <span className="text-[9px] text-[#FFB3B6]/60 bg-background-ink/75 py-1 px-2.5 rounded-full uppercase tracking-widest text-[#FFB3B6] font-bold text-center">
                      Auto-Focus Alignment
                    </span>
                  </div>
                </div>
              )}

              {/* Holographic scanner laser visual overlay */}
              {isRunning && (
                <div className="absolute inset-x-0 h-[2px] bg-[#ED254E] shadow-[0_0_15px_#ED254E,0_0_6px_#ED254E] animate-scan z-25 pointer-events-none" />
              )}

              {/* Portrait Preview Backdrop */}
              <img
                src={customFile || selectedOutfit.img}
                alt="Selected dress silhouette"
                className={`w-full h-full object-cover transition-all duration-700 ${isRunning ? "opacity-30 scale-102 filter blur-[2px] sepia-[0.2]" : "opacity-75"}`}
                referrerPolicy="no-referrer"
              />

              {/* Placed Interactive Review coordinate Pins */}
              {pins.map((pin, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer z-20"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  onClick={(event) => {
                    event.stopPropagation();
                    alert(`Pin critique index #${i+1}:\n[${pin.tag.toUpperCase()} - Rating: ${pin.rating}/10]\n"${pin.note}"`);
                  }}
                >
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 items-center justify-center bg-brand-red text-[10px] font-bold text-white shadow-lg">
                      {i+1}
                    </span>
                  </span>
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute left-8 -top-3 hidden group-hover/pin:block bg-[#001c22] border border-muted-teal/30 p-2.5 rounded-lg shadow-xl text-[10px] leading-relaxed max-w-xs text-left text-on-surface whitespace-nowrap z-50">
                    <span className={`font-bold uppercase tracking-wider text-[9px] mr-1 ${pin.tag === "Appreciate" ? "text-green-400" : "text-brand-red"}`}>
                      {pin.tag} ({pin.rating}/10):
                    </span>
                    {pin.note}
                  </div>
                </div>
              ))}

              {/* Editing new pin form popover */}
              {editingPin && (
                <div 
                  className="absolute bg-[#001c22] border border-brand-red rounded-xl p-3 shadow-2xl z-30 space-y-2 text-xs w-60 text-left pointer-events-auto"
                  style={{ left: `${editingPin.x > 50 ? editingPin.x - 55 : editingPin.x + 3}%`, top: `${editingPin.y > 60 ? editingPin.y - 45 : editingPin.y + 3}%` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[9px] uppercase font-bold text-[#FFB3B6] tracking-wider">Drop Outfit Critique Pin</p>
                  
                  <form onSubmit={savePin} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Comment e.g. Lapel folds are perfect..."
                      value={newPinNote}
                      onChange={(e) => setNewPinNote(e.target.value)}
                      className="w-full bg-background-ink border border-muted-teal/30 focus:border-brand-red rounded-lg py-1.5 px-2 text-[11px] text-on-surface outline-none"
                      required
                      autoFocus
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newPinTag}
                        onChange={(e) => setNewPinTag(e.target.value as "Elevate" | "Appreciate")}
                        className="bg-background-ink border border-muted-teal/30 rounded px-1.5 py-1 text-[10px] text-white"
                      >
                        <option value="Appreciate">🎉 Appreciate</option>
                        <option value="Elevate">🛠️ Elevate</option>
                      </select>

                      <select
                        value={newPinRating}
                        onChange={(e) => setNewPinRating(Number(e.target.value))}
                        className="bg-background-ink border border-muted-teal/30 rounded px-1.5 py-1 text-[10px] text-white"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i+1} value={i+1}>Rating: {i+1}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-1 justify-end pt-1">
                      <button 
                        type="button" 
                        onClick={() => setEditingPin(null)} 
                        className="text-[10px] text-muted-teal hover:text-white px-2 py-1"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded"
                      >
                        Pin Note
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Click to add instructions tooltip */}
              <div className="absolute top-4 left-4 bg-background-ink/80 border border-muted-teal/15 py-1 px-3 rounded-full text-[9px] uppercase tracking-widest text-muted-teal/90 pointer-events-none z-10 font-bold">
                💡 Click on clothing image to drop critique pins
              </div>

              {/* Toggle switch control overlays */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-background-ink/90 backdrop-blur-md rounded-full p-1.5 border border-muted-teal/30 flex items-center shadow-2xl z-20 whitespace-nowrap justify-between gap-1 w-max max-w-[95%]">
                <button
                  id="toggle-camera"
                  onClick={() => setInputMode("Camera")}
                  className={`px-4 py-2 flex-grow rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer select-none ${
                    inputMode === "Camera" ? "bg-brand-red text-white shadow-lg" : "text-muted-teal hover:text-white"
                  }`}
                >
                  Camera Focus
                </button>
                <button
                  id="toggle-gallery"
                  onClick={() => setInputMode("Gallery")}
                  className={`px-4 py-2 flex-grow rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer select-none ${
                    inputMode === "Gallery" ? "bg-brand-red text-white shadow-lg" : "text-muted-teal hover:text-white"
                  }`}
                >
                  Gallery File
                </button>
              </div>
            </div>
          </section>

          {/* Preset lookbooks Selector */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#FFB3B6] uppercase block px-1">
              OR CHOOSE MASTER SILHOUETTES LOOKBOOK
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {OUTFIT_PRESETS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handlePresetSelect(item)}
                  className={`p-2 border rounded-xl bg-surface-raised cursor-pointer hover:border-brand-red transition-all flex flex-col justify-between ${
                    selectedOutfit.id === item.id && !customFile
                      ? "border-brand-red shadow-[0_0_10px_rgba(237,37,78,0.2)]"
                      : "border-muted-teal/15"
                  }`}
                >
                  <img src={item.img} alt={item.name} className="w-full aspect-square object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                  <p className="text-[9px] font-sans font-bold leading-tight uppercase truncate text-muted-teal block text-center">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Hard file selector block */}
          <section className="p-4 bg-[#001c22]/30 border border-muted-teal/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-on-surface">Upload Your Physical Look</p>
              <p className="text-[10px] text-muted-teal mt-0.5">Captures alignment, silhouette balance, and color layers instantly.</p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="hard-file-upload"
              />
              <label
                htmlFor="hard-file-upload"
                className="px-5 py-2.5 bg-[#001c22] border border-[#FFB3B6]/30 hover:border-[#FFB3B6] text-on-surface rounded-full text-[10px] font-mono hover:text-brand-red transition-colors duration-250 cursor-pointer block select-none uppercase tracking-widest"
              >
                Choose File
              </label>
            </div>
          </section>

          {/* Target ruleset occasion tagging selector */}
          <section className="space-y-4 bg-[#001c22]/40 p-5 sm:p-6 rounded-2xl border border-muted-teal/10">
            <div className="flex justify-between items-baseline px-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6]">
                METADATA: OCCASION RULESET TAG
              </h3>
              <span className="text-[10px] text-muted-teal uppercase tracking-wider font-semibold">MANDATORY RULE MATCH</span>
            </div>
            <p className="text-[10px] text-muted-teal leading-relaxed px-1">
              Select the contextual background rules. The AI diagnostics will judge your folds, fabric contrasts, and draping specifically against this event context.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {OCCASIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => setOccasion(item)}
                  className={`px-4.5 py-2.5 rounded-full border text-[11px] font-bold tracking-wider transition-all cursor-pointer select-none ${
                    occasion === item
                      ? "border-brand-red text-brand-red bg-brand-red/10 shadow-[0_0_12px_rgba(237,37,78,0.15)]"
                      : "border-muted-teal/30 text-on-surface hover:border-[#FFB3B6]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Live Status track feedback & scored meters dashboard) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Diagnostics track monitor */}
          <section className="space-y-6 bg-[#001c22] p-6 rounded-2xl border border-muted-teal/15 shadow-2.5xl">
            
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFB3B6] border-b border-muted-teal/10 pb-4 block">
              SYNDICATE TRACK MONITOR
            </h3>

            {/* Simultaneously tracked activities */}
            <div className="space-y-5">
              
              {/* Track 1: AI running 3.5s execution diagnostic */}
              <div className="p-4 bg-background-ink/65 border border-muted-teal/10 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-teal block font-mono">
                    TRACK 1: COMPUTER VISION DIAGNOSTIC
                  </span>
                  <span className={`text-[10px] font-bold uppercase font-mono ${isRunning ? "text-brand-red" : "text-green-500"}`}>
                    {isRunning ? "PROCESSING..." : "READY"}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-grow bg-[#051518] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-red h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-white text-right w-8">{progress}%</span>
                </div>
                
                <p className="text-[10px] text-muted-teal leading-relaxed italic text-left">
                  {isRunning 
                    ? "Evaluating structural coordinates, garment draping ratios, and fabric undertone contrasts..." 
                    : "Analysis completely calibrated. Proportions vector stored cleanly."
                  }
                </p>
              </div>

              {/* Track 2: Push dispatch notification to Inner Circle peers */}
              <div className="p-4 bg-background-ink/65 border border-muted-teal/10 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-teal block font-mono">
                    TRACK 2: CIRCLE DISPATCH TRANSMITTER
                  </span>
                  <span className="text-[10px] font-bold text-green-500 uppercase font-mono">
                    [DISPATCHED]
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-brand-red text-[8px] font-bold flex items-center justify-center text-white border border-[#001c22]">E</div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-[8px] font-bold flex items-center justify-center text-white border border-[#001c22]">J</div>
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-[8px] font-bold flex items-center justify-center text-white border border-[#001c22]">M</div>
                  </div>
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-white">
                    Sent to 3 Active Tastemakers
                  </p>
                </div>

                <p className="text-[10px] text-muted-teal leading-relaxed italic text-left">
                  Live encrypted notification dispatched. Your Circle peers have been pinged to rate the active look details synchronously.
                </p>
              </div>

            </div>

            {/* Core Score Output */}
            <div className="pt-4 border-t border-muted-teal/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-[#FFB3B6] uppercase tracking-widest font-mono">
                  DIAGNOSTIC SYNTHESIS
                </span>
                <div className="text-right">
                  <span className="text-5xl font-serif font-black text-brand-red leading-none">
                    {scores.overall}
                  </span>
                  <span className="text-muted-teal text-xs ml-1 font-mono">/ 10</span>
                </div>
              </div>

              {/* Scored Meters */}
              <div className="space-y-3.5">
                {/* Color */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-muted-teal uppercase tracking-widest font-sans">
                    <span>Color Harmony Spectrum</span>
                    <span className="font-mono text-on-surface">{scores.harmony}%</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red transition-all duration-700 shadow-[0_0_8px_#ED254E]" style={{ width: `${scores.harmony}%` }} />
                  </div>
                </div>

                {/* Silhouette */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-muted-teal uppercase tracking-widest font-sans">
                    <span>Fit &amp; Silhouette Balance</span>
                    <span className="font-mono text-on-surface">{scores.balance}%</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red transition-all duration-700 shadow-[0_0_8px_#ED254E]" style={{ width: `${scores.balance}%` }} />
                  </div>
                </div>

                {/* Seasonal Coordination */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-muted-teal uppercase tracking-widest font-sans">
                    <span>Seasonal Contrast Coordination</span>
                    <span className="font-mono text-on-surface">{scores.seasonal}%</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red transition-all duration-700 shadow-[0_0_8px_#ED254E]" style={{ width: `${scores.seasonal}%` }} />
                  </div>
                </div>

                {/* Occasion */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-[#FFB3B6] uppercase tracking-widest font-sans">
                    <span>Occasion Matching Metric ({occasion})</span>
                    <span className="font-mono text-on-surface">{scores.occasion}%</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red transition-all duration-700 shadow-[0_0_8px_#ED254E]" style={{ width: `${scores.occasion}%` }} />
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <button
                onClick={triggerEvaluation}
                disabled={isRunning}
                className="w-full mt-4 bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs tracking-widest uppercase py-4 rounded-full shadow-[0_12px_30px_rgba(237,37,78,0.3)] transition-all ease-out active:scale-98 cursor-pointer text-center select-none"
              >
                {isRunning ? "EVALUATING METRIC LAYERS..." : "SUBMIT FOR INSTANT EVALUATION"}
              </button>
            </div>
          </section>

          {/* Peer Reviews human feedback sidebar */}
          <section className="bg-[#001c22]/55 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFB3B6] block">
              INNER CIRCLE HUMAN FEEDBACK
            </h3>
            
            {/* Interactive sliders & voice feedback panel */}
            <div className="p-4 bg-background-ink/40 border border-muted-teal/20 rounded-xl space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-muted-teal/15">
                <span className="font-bold text-white uppercase tracking-wider block">Syndicate Voice Commentary</span>
                
                <button 
                  onClick={handleVoicePreview}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest transition-colors select-none ${
                    isPlayingVoice ? "bg-green-600 font-extrabold text-white" : "bg-brand-red text-white hover:bg-brand-red/80"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>{isPlayingVoice ? "PLAYING AUDIO..." : "LISTEN FEEDBACK"}</span>
                </button>
              </div>

              {/* Active list of pins */}
              <div className="space-y-3 pt-1">
                <span className="text-[9px] font-bold text-muted-teal uppercase tracking-widest block">Active Clothing Pins ({pins.length})</span>
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 text-[11px] hide-scrollbar text-left">
                  {pins.map((pin, i) => (
                    <div key={i} className="p-2.5 bg-background-ink/60 border border-muted-teal/10 rounded-lg flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-red text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i+1}
                      </span>
                      <div className="space-y-0.5 flex-grow">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className={pin.tag === "Appreciate" ? "text-green-400" : "text-brand-red"}>
                            {pin.tag.toUpperCase()}
                          </span>
                          <span className="text-muted-teal font-mono">Rating: {pin.rating}/10</span>
                        </div>
                        <p className="text-on-surface/90 leading-normal font-sans italic">
                          "{pin.note}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Critique commentary log */}
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 hide-scrollbar">
              
              <div className="bg-[#001c22] p-4 rounded-xl border border-muted-teal/10 space-y-2 hover:border-[#FFB3B6]/20 transition-colors block text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FF5168] text-xs font-bold flex items-center justify-center text-white">E</div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Elena V.</h4>
                      <p className="text-[9px] text-[#FFB3B6] tracking-wide uppercase font-bold">VOGUE EDITORIALIST</p>
                    </div>
                  </div>
                  <span className="text-base font-serif font-black text-brand-red">9.0</span>
                </div>
                <p className="text-xs text-on-surface/85 font-sans leading-relaxed italic">
                  "Perfect draping index. The monochromatic line holds beautifully against modern corporate requirements."
                </p>
              </div>

              <div className="bg-[#001c22] p-4 rounded-xl border border-muted-teal/10 space-y-2 hover:border-[#FFB3B6]/20 transition-colors block text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 text-xs font-bold flex items-center justify-center text-white">J</div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Julian Black</h4>
                      <p className="text-[9px] text-muted-teal tracking-wide uppercase font-bold">CREATIVE DIRECTOR</p>
                    </div>
                  </div>
                  <span className="text-base font-serif font-black text-brand-red">8.0</span>
                </div>
                <p className="text-xs text-on-surface/85 font-sans leading-relaxed italic">
                  "Recommended: a narrower lapel contrast would elevate this into a higher tier. Strong silhouette balance otherwise."
                </p>
              </div>

            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
