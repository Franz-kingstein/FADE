import React, { useState } from "react";
import { Camera, Image as ImageIcon, Check, Leaf, FlaskConical, ChevronLeft, ArrowRight } from "lucide-react";
import { Screen, UserProfile } from "../types";

interface SetupScreenProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile, screenTarget: Screen, transition: "push") => void;
}

export default function SetupScreen({ initialProfile, onComplete }: SetupScreenProps) {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState(initialProfile.gender);
  const [measurements, setMeasurements] = useState(initialProfile.measurements);
  const [somatotype, setSomatotype] = useState(initialProfile.somatotype);
  const [season, setSeason] = useState("SOFT AUTUMN");
  const [contrast, setContrast] = useState(74);
  const [aesthetic, setAesthetic] = useState<"MINIMALIST" | "MAXIMALIST">("MAXIMALIST");
  const [lifestyle, setLifestyle] = useState("CREATIVE");
  const [cpwTracking, setCpwTracking] = useState(true);
  const [textilePreference, setTextilePreference] = useState<"NATURAL" | "SYNTHETIC">("NATURAL");

  // Multi-step logic
  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const updatedProfile: UserProfile = {
      ...initialProfile,
      gender,
      somatotype,
      measurements,
      bodyShape: measurements.shoulder > measurements.hip ? "Inverted Triangle" : "Athletic Frame",
      seasonProfile: season === "SOFT AUTUMN" ? "Soft Autumn (Muted, Earthy, Warm)" : "Deep Winter (Vivid, High Contrast)",
      contrastIntensity: contrast,
      textilePreference,
      settings: {
        ...initialProfile.settings,
        cpwTracking
      }
    };
    onComplete(updatedProfile, Screen.Home, "push");
  };

  const handleMeasureChange = (key: keyof typeof measurements, val: number) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: val || 0
    }));
  };

  return (
    <div className="min-h-screen text-on-surface bg-background-ink flex flex-col justify-between pb-36">
      {/* ProgressBar Top */}
      <div className="w-full max-w-lg mx-auto px-4 pt-12">
        <div className="flex gap-2 justify-center mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? "w-10 bg-brand-red" : "w-4 bg-muted-teal"
              }`}
            />
          ))}
        </div>

        {/* Setup Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          
          {/* STEP 1: Anthropometric & Morphological */}
          {step === 1 && (
            <section className="animate-fadeIn space-y-6">
              <header className="space-y-1">
                <span className="text-xs font-semibold tracking-widest text-muted-teal uppercase block">
                  Morphology
                </span>
                <h2 className="text-3xl font-serif leading-tight font-medium">
                  Define Your <span className="italic text-primary-glow font-normal">Silhouette.</span>
                </h2>
              </header>

              {/* Gender Selection */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {["MEN", "WOMEN", "FLUID"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGender(cat)}
                    className={`py-4 text-center rounded-lg border font-semibold text-xs tracking-widest transition-all cursor-pointer ${
                      gender === cat
                        ? "bg-brand-red border-brand-red text-white"
                        : "border-muted-teal/40 hover:border-primary-glow"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Measurements Inputs */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="border-b border-muted-teal/50 py-2">
                  <label className="text-[10px] font-semibold text-muted-teal uppercase block tracking-wider">
                    Shoulder (cm)
                  </label>
                  <input
                    type="number"
                    value={measurements.shoulder || ""}
                    onChange={(e) => handleMeasureChange("shoulder", parseInt(e.target.value))}
                    className="bg-transparent border-none w-full text-2xl font-serif p-0 focus:ring-0 text-on-surface outline-none"
                    placeholder="00"
                  />
                </div>
                <div className="border-b border-muted-teal/50 py-2">
                  <label className="text-[10px] font-semibold text-muted-teal uppercase block tracking-wider">
                    Chest/Bust (cm)
                  </label>
                  <input
                    type="number"
                    value={measurements.chest || ""}
                    onChange={(e) => handleMeasureChange("chest", parseInt(e.target.value))}
                    className="bg-transparent border-none w-full text-2xl font-serif p-0 focus:ring-0 text-on-surface outline-none"
                    placeholder="00"
                  />
                </div>
                <div className="border-b border-muted-teal/50 py-2">
                  <label className="text-[10px] font-semibold text-muted-teal uppercase block tracking-wider">
                    Waist (cm)
                  </label>
                  <input
                    type="number"
                    value={measurements.waist || ""}
                    onChange={(e) => handleMeasureChange("waist", parseInt(e.target.value))}
                    className="bg-transparent border-none w-full text-2xl font-serif p-0 focus:ring-0 text-on-surface outline-none"
                    placeholder="00"
                  />
                </div>
                <div className="border-b border-muted-teal/50 py-2">
                  <label className="text-[10px] font-semibold text-muted-teal uppercase block tracking-wider">
                    Hip (cm)
                  </label>
                  <input
                    type="number"
                    value={measurements.hip || ""}
                    onChange={(e) => handleMeasureChange("hip", parseInt(e.target.value))}
                    className="bg-transparent border-none w-full text-2xl font-serif p-0 focus:ring-0 text-on-surface outline-none"
                    placeholder="00"
                  />
                </div>
              </div>

              {/* Somatotype selection */}
              <div className="pt-6">
                <label className="text-[10px] font-semibold text-muted-teal uppercase block tracking-widest mb-4">
                  Somatotype Selection
                </label>
                <div className="flex flex-wrap gap-2">
                  {["ECTOMORPH", "MESOMORPH", "ENDOMORPH"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSomatotype(type)}
                      className={`px-6 py-2 rounded-full border text-xs font-semibold tracking-widest transition-all cursor-pointer ${
                        somatotype === type
                          ? "bg-on-surface text-background-ink border-on-surface font-bold"
                          : "border-muted-teal/50 hover:bg-muted-teal/20 text-on-surface"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 2: Chromatographic Profiling */}
          {step === 2 && (
            <section className="animate-fadeIn space-y-6">
              <header className="space-y-1">
                <span className="text-xs font-semibold tracking-widest text-muted-teal uppercase block">
                  Chromatographic
                </span>
                <h2 className="text-3xl font-serif leading-tight font-medium">
                  Master Your <span className="italic text-primary-glow font-normal">Spectrum.</span>
                </h2>
              </header>

              {/* Undertone Guide Widget */}
              <div className="bg-surface-raised p-5 rounded-xl border border-muted-teal/20 shadow-lg">
                <h3 className="text-xs font-semibold text-on-surface tracking-wider uppercase mb-1">
                  UNDERTONE ANALYZER
                </h3>
                <p className="text-xs text-muted-teal leading-relaxed mb-4">
                  Check your wrist veins in daylight. Blue/Purple suggests Cool; Green suggests Warm.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 h-12 rounded bg-gradient-to-r from-[#FFD3B6] to-[#A3C1AD] flex items-center justify-center p-1">
                    <span className="text-[10px] font-semibold text-background-ink tracking-widest">WARM</span>
                  </div>
                  <div className="flex-1 h-12 rounded bg-gradient-to-r from-[#A3C1AD] to-[#C7CEEA] flex items-center justify-center p-1">
                    <span className="text-[10px] font-semibold text-background-ink tracking-widest">COOL</span>
                  </div>
                </div>
              </div>

              {/* 12 Season Framework */}
              <div>
                <label className="text-[10px] font-semibold tracking-widest text-muted-teal uppercase block mb-4">
                  12-Season Profile
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "DEEP WINTER", sub: "Vivid, High Contrast" },
                    { key: "SOFT AUTUMN", sub: "Muted, Earthy, Warm" },
                    { key: "LIGHT SUMMER", sub: "Delicate, Cool" },
                    { key: "BRIGHT SPRING", sub: "Warm, Clear" }
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSeason(s.key)}
                      className={`p-4 border rounded-lg text-left transition-all cursor-pointer ${
                        season === s.key
                          ? "bg-brand-red border-brand-red"
                          : "border-muted-teal/40 hover:border-primary-glow bg-surface-raised"
                      }`}
                    >
                      <span className="block text-xs font-semibold tracking-wider font-sans">{s.key}</span>
                      <span className={`text-[10px] font-sans ${season === s.key ? "text-white/80" : "text-muted-teal"}`}>
                        {s.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast Level */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-semibold tracking-widest text-muted-teal uppercase">
                    Contrast Intensity
                  </label>
                  <span className="text-xs font-semibold text-brand-red">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full h-1 bg-muted-teal/40 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
              </div>
            </section>
          )}

          {/* STEP 3: Style DNA */}
          {step === 3 && (
            <section className="animate-fadeIn space-y-6">
              <header className="space-y-1">
                <span className="text-xs font-semibold tracking-widest text-muted-teal uppercase block">
                  Aesthetic DNA
                </span>
                <h2 className="text-3xl font-serif leading-tight font-medium">
                  Curate Your <span className="italic text-primary-glow font-normal">Identity.</span>
                </h2>
              </header>

              {/* Style Seek Selection Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Minimalist */}
                <div
                  onClick={() => setAesthetic("MINIMALIST")}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                    aesthetic === "MINIMALIST" ? "border-brand-red shadow-[0_0_15px_rgba(237,37,78,0.4)]" : "border-transparent"
                  }`}
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg"
                    alt="Minimalist Architecture Look"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-ink via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-semibold tracking-widest text-white">MINIMALIST</span>
                  </div>
                  {aesthetic === "MINIMALIST" && (
                    <div className="absolute top-2 right-2 bg-brand-red text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Maximalist */}
                <div
                  onClick={() => setAesthetic("MAXIMALIST")}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                    aesthetic === "MAXIMALIST" ? "border-brand-red shadow-[0_0_15px_rgba(237,37,78,0.4)]" : "border-transparent"
                  }`}
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx8SJpE-gRtYMx726ZgOfzIV0co4_8XgTMW7loz0rogCD0rX7-2t6RqIAe8StibguCBJ1YRAadhFmB0pQPUVKRxg-AbEYTYrhHzuDXFjsjCyKHuc2KCkwR6lHlVoC6M9mmOGAYBJ7BQ8nn_VRbRzQOU7yjfGLPYC9RDmxxvWOx0Ccqt3jWf_kI7sz_HPStHYVCG1swd0hvUjINY1V0lDb9gEMVbhDkNx8icJ7EAlaagJwnmHjmLBCtKmTMcyFQKMnybAs80T42m83D"
                    alt="Maximalist Emerald Draped Look"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-ink via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-semibold tracking-widest text-white">MAXIMALIST</span>
                  </div>
                  {aesthetic === "MAXIMALIST" && (
                    <div className="absolute top-2 right-2 bg-brand-red text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Life Stage / Lifestyle Context */}
              <div className="pt-4">
                <label className="text-[10px] font-semibold tracking-widest text-muted-teal uppercase block mb-3">
                  Life Stage &amp; Context
                </label>
                <div className="flex flex-wrap gap-2">
                  {["CORPORATE", "CREATIVE", "SOCIALITE", "ACADEMIC"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLifestyle(item)}
                      className={`px-5 py-3 rounded-lg text-xs font-semibold tracking-widest transition-all cursor-pointer ${
                        lifestyle === item
                          ? "bg-muted-teal text-white font-bold"
                          : "border border-muted-teal/40 text-on-surface hover:bg-muted-teal/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 4: Sustainable Utility */}
          {step === 4 && (
            <section className="animate-fadeIn space-y-6">
              <header className="space-y-1">
                <span className="text-xs font-semibold tracking-widest text-muted-teal uppercase block">
                  Sustainable Utility
                </span>
                <h2 className="text-3xl font-serif leading-tight font-medium">
                  Quantify Your <span className="italic text-primary-glow font-normal">Wardrobe.</span>
                </h2>
              </header>

              {/* CPW Tracking toggle */}
              <div className="flex items-center justify-between p-5 bg-surface-raised rounded-xl border border-muted-teal/20 shadow-lg">
                <div>
                  <h3 className="text-xs font-semibold text-on-surface tracking-wider uppercase mb-0.5">
                    CPW TRACKING
                  </h3>
                  <p className="text-xs text-muted-teal">Auto-calculate Cost-Per-Wear analytics</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCpwTracking(!cpwTracking)}
                  className={`w-14 h-8 rounded-full p-1 transition-all flex items-center cursor-pointer ${
                    cpwTracking ? "bg-brand-red justify-end" : "bg-muted-teal justify-start"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Textile Integrity Preference */}
              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-semibold tracking-widest text-muted-teal uppercase block">
                  Textile Integrity
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Natural */}
                  <button
                    type="button"
                    onClick={() => setTextilePreference("NATURAL")}
                    className={`flex flex-col items-center gap-4 p-8 border rounded-xl transition-all cursor-pointer ${
                      textilePreference === "NATURAL"
                        ? "border-brand-red bg-brand-red/15"
                        : "border-muted-teal/40 hover:bg-muted-teal/15 bg-surface-raised"
                    }`}
                  >
                    <Leaf className={`w-10 h-10 ${textilePreference === "NATURAL" ? "text-brand-red" : "text-muted-teal"}`} />
                    <span className="text-xs font-semibold tracking-widest">NATURAL</span>
                  </button>

                  {/* Synthetic */}
                  <button
                    type="button"
                    onClick={() => setTextilePreference("SYNTHETIC")}
                    className={`flex flex-col items-center gap-4 p-8 border rounded-xl transition-all cursor-pointer ${
                      textilePreference === "SYNTHETIC"
                        ? "border-brand-red bg-brand-red/15"
                        : "border-muted-teal/40 hover:bg-muted-teal/15 bg-surface-raised"
                    }`}
                  >
                    <FlaskConical className={`w-10 h-10 ${textilePreference === "SYNTHETIC" ? "text-brand-red" : "text-muted-teal"}`} />
                    <span className="text-xs font-semibold tracking-widest">SYNTHETIC</span>
                  </button>
                </div>
              </div>
            </section>
          )}

        </form>
      </div>

      {/* Navigation Actions Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-6 bg-background-ink/90 backdrop-blur-md border-t border-muted-teal/10 z-40">
        <div className="max-w-lg mx-auto flex gap-4 justify-between items-center">
          
          <button
            type="button"
            onClick={handleBack}
            className={`flex-1 h-14 border border-muted-teal/50 hover:border-brand-red rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer ${
              step === 1 ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-[2] h-14 bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-[0_8px_20px_rgba(237,37,78,0.3)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="complete-btn"
              type="button"
              onClick={handleComplete}
              className="flex-[2] h-14 bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-[0_8px_20px_rgba(237,37,78,0.3)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              Complete Setup
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
