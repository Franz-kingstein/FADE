import React, { useState } from "react";
import { ArrowRight, Sparkles, Key, Compass, Eye, Heart } from "lucide-react";
import { Screen } from "../types";

interface WelcomeScreenProps {
  onNavigate: (target: Screen, transition: "push" | "none") => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const [inviteToken, setInviteToken] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken.trim()) {
      setValidationError("Please enter your exclusive guest token.");
      return;
    }

    setIsValidating(true);
    setValidationError("");

    setTimeout(() => {
      const token = inviteToken.toUpperCase().trim();
      if (token.startsWith("FD-") || token.length >= 6) {
        setSuccess(true);
        setIsValidating(false);
        setTimeout(() => {
          onNavigate(Screen.Setup, "push");
        }, 1200);
      } else {
        setValidationError("Passcode not recognized. Check your invite with your circle contact.");
        setIsValidating(false);
      }
    }, 1500);
  };

  const autofillTemplateCode = () => {
    setInviteToken("FD-992-XKL");
    setValidationError("");
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-background-ink animate-fadeIn pb-24">
      
      {/* Background elegant architectural blur coords */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full border-[1px] border-muted-teal/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full border-[1px] border-[#FFB3B6]/30 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* Left Side: Campaign Artwork & Exclusivity Typography (col-span-7) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 flex flex-col justify-center text-left">
          
          <div className="space-y-3 sm:space-y-5">
            <div className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFB3B6]/20 bg-[#001c22]/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB3B6] animate-pulse" />
              <span className="text-[9px] sm:text-xs font-sans tracking-widest text-[#FFB3B6] font-bold uppercase whitespace-nowrap">
                COUTURE DESIGN SANCTUARY • BY INVITATION
              </span>
            </div>
            
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-serif text-on-surface tracking-tighter leading-none font-black select-none">
              FADE
            </h1>
            
            <p className="font-serif italic text-2xl sm:text-4xl lg:text-5xl text-[#FFB3B6] leading-snug">
              Elevated aesthetics, calibrated for you.
            </p>
          </div>

          <div className="space-y-5 text-on-surface/90 font-sans text-xs sm:text-sm leading-relaxed max-w-xl">
            <p className="border-l-2 border-brand-red/40 pl-4 py-1 italic text-muted-teal">
              A private showroom for the avant-garde. We bypass mass algorithms to offer a quiet, focused environment for garment drapes, silhouette proportions, and high-fashion validation.
            </p>
            <p>
              By entering your showroom key, you activate your digital wardrobe twin, connect with an invite-only peer evaluation circle, and gain deep design diagnostics tailored to your specific aesthetic subcultures.
            </p>
          </div>

          {/* Aesthetic Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#001c22]/30 rounded-xl border border-muted-teal/10 space-y-1">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 font-mono">
                <Compass className="w-3.5 h-3.5 text-brand-red" /> 1. SUB-CULTURE INTEGRATION
              </span>
              <p className="text-[11px] text-muted-teal leading-relaxed">
                Calibrate computer vision models to evaluate silhouettes against strict genre guidelines, not trend noise.
              </p>
            </div>

            <div className="p-4 bg-[#001c22]/30 rounded-xl border border-muted-teal/10 space-y-1">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 font-mono">
                <Heart className="w-3.5 h-3.5 text-brand-red" /> 2. PEER REVIEW CIRCUITS
              </span>
              <p className="text-[11px] text-muted-teal leading-relaxed">
                Publish high-resolution, context-aware cards for feedback from your trusted personal styler circle.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Log In Frame Token Gate (col-span-5) */}
        <div className="w-full lg:col-span-5 max-w-md mx-auto bg-[#001c22]/90 border border-muted-teal/15 rounded-2xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-md">
          {/* Subtle gradient identity top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-[#FFB3B6] to-muted-teal" />
          
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-serif text-[#F7F5F5] font-semibold tracking-wide">
                Enter Showroom
              </h2>
              <p className="text-[9px] font-bold text-[#FFB3B6] mt-1 tracking-widest uppercase">
                VALIDATE ACCESS CREDENTIALS
              </p>
            </div>

            <form onSubmit={handleValidation} className="space-y-5 text-left text-xs font-sans">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-teal block px-1">
                  Exclusive Invitation Token
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-teal">
                    <Key className="w-4 h-4 text-brand-red" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., FD-992-XKL"
                    value={inviteToken}
                    onChange={(e) => setInviteToken(e.target.value)}
                    className="w-full bg-background-ink border border-muted-teal/20 focus:border-brand-red rounded-xl py-3.5 pl-10 pr-4 text-on-surface placeholder-muted-teal/30 focus:outline-none focus:ring-1 focus:ring-brand-red transition-all font-mono uppercase tracking-widest text-xs"
                    disabled={isValidating || success}
                    required
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-3 bg-brand-red/10 border border-brand-red/30 rounded-lg text-[10px] font-mono text-[#FFB3B6] leading-relaxed uppercase tracking-wider text-center">
                  {validationError}
                </div>
              )}

              {isValidating && (
                <div className="p-3 bg-[#051518] border border-[#FFB3B6]/10 rounded-lg text-[10px] font-mono text-[#FFB3B6] tracking-widest text-center uppercase animate-pulse">
                  Unlocking showroom coordinates...
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-950/20 border border-green-500 rounded-lg text-[10px] font-mono text-green-400 tracking-wider text-center uppercase font-bold animate-pulse">
                  Token Confirmed. Welcome in.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isValidating || success}
                  className="w-full bg-brand-red hover:bg-[#ff1e4a] text-white py-4 rounded-full font-bold text-[10px] tracking-widest uppercase text-center transition-all cursor-pointer focus:outline-none shadow-[0_6px_25px_rgba(237,37,78,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>REQUEST ENTRY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="text-center font-sans">
              <button 
                type="button"
                onClick={autofillTemplateCode}
                className="text-[10px] font-mono uppercase text-[#FFB3B6]/80 hover:text-white underline cursor-pointer select-none transition-colors"
              >
                Autofill demo invite key
              </button>
            </div>

            <div className="text-center font-sans text-[10px] text-muted-teal/60 leading-relaxed pt-3 border-t border-muted-teal/10">
              The Atelier prioritizes absolute discretion. Personal look telemetry is hosted on an isolated layer.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
