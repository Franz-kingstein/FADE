import React, { useState } from "react";
import { Globe, Trophy, Compass, Star, Instagram, Youtube, BookOpen, Layers, CheckCircle } from "lucide-react";
import { GLOBAL_HUBS, CURRENT_CHALLENGES } from "../data";

const INSTAGRAM_TRENDS = [
  { 
    tag: "#Deconstructivism", 
    growth: "+148%", 
    searchVolume: "2.4M", 
    palette: ["#001014", "#7F9F9F", "#FFB3B6"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    account: "@avant_drapes",
    caption: "Raw edge asymmetrical cuts and structured layers styled directly in Paris. #fashiondrapery"
  },
  { 
    tag: "#CyberBrutalism", 
    growth: "+92%", 
    searchVolume: "980K", 
    palette: ["#051518", "#ED254E", "#8A9A86"],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    account: "@sub_tectonics",
    caption: "High impact technical outerwear with customized harness loops and stark color blocking."
  },
  { 
    tag: "#StealthLuxury", 
    growth: "+112%", 
    searchVolume: "1.8M", 
    palette: ["#0A0A0A", "#E5E5E5", "#3D3D3D"],
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
    account: "@matte_minimalist",
    caption: "Pure premium cashmere blended seamlessly back with muted coordinates. Less is infinite."
  }
];

const PINTEREST_BOARDS = [
  { id: "p-1", name: "Neo-Classical Dark Drapings", pinCount: 145, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80", synced: true },
  { id: "p-2", name: "Textile Textures & Metallic Clasps", pinCount: 88, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80", synced: false },
  { id: "p-3", name: "Techwear Outerwear Form & Folds", pinCount: 210, image: "https://images.unsplash.com/photo-15569055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80", synced: true }
];

const YOUTUBE_TUTORIALS = [
  { id: "S6bB_9Lg6-Y", title: "Savile Row Style Blazer Draping & Silhouette Proportion Balancing", duration: "18:45", channel: "Avant Tailoring", views: "142K", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" },
  { id: "tCisMccN2B4", title: "Beginner's Guide to Draping Fabric & Asymmetry Form Assembly", duration: "12:10", channel: "Drape Lab", views: "98K", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80" }
];

const VOGUE_TRENDS = [
  { title: "The Return of Deep Winter Minimalist Elements", source: "Vogue India", date: "June 2026 Edition", caption: "How high contrast charcoal drapes and steel pins are establishing dominance over transient street palettes this season.", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=800&q=80" },
  { title: "Asymmetric Folds take Center Stage in Corporate Gala Orbits", source: "Vogue India", date: "Weekly Radar", caption: "A global shifts check from Paris and Tokyo confirms sharp neck lines and layered waist silhouettes are replacing mainstream collars.", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&h=800&q=80" }
];

export default function WorldScreen() {
  const [selectedHub, setSelectedHub] = useState("Paris");
  const [copiedChallenge, setCopiedChallenge] = useState("");
  const [activeTab, setActiveTab] = useState<"Radar" | "Feeds">("Radar");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const handleCopyPass = (pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedChallenge(pass);
    setTimeout(() => setCopiedChallenge(""), 2200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 space-y-10 bg-background-ink animate-fadeIn pb-24">
      
      {/* Title Header */}
      <header className="space-y-1.5 pb-4 border-b border-muted-teal/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#FFB3B6] uppercase block">
            GLOBAL LOOK CODES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F7F5F5] font-bold tracking-tight">
            World Feed &amp; <span className="italic text-[#FFB3B6] font-normal">Aggregators</span>
          </h2>
        </div>

        {/* Tab filters toggle between styling codes list and visual feeds */}
        <div className="flex bg-[#001c22] p-1.5 rounded-full border border-muted-teal/15 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("Radar")}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none transition-colors ${
              activeTab === "Radar" ? "bg-brand-red text-white" : "text-muted-teal hover:text-white"
            }`}
          >
            Hubs &amp; Challenges
          </button>
          <button
            onClick={() => setActiveTab("Feeds")}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none transition-colors ${
              activeTab === "Feeds" ? "bg-brand-red text-white" : "text-muted-teal hover:text-white"
            }`}
          >
            Aesthetic Channels
          </button>
        </div>
      </header>

      {activeTab === "Radar" ? (
        <>
          {/* Global Stylist Hub Coordinates Map */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-muted-teal tracking-widest uppercase block px-1 text-left">
              STYLING HUB COORDINATES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOBAL_HUBS.map((hub) => (
                <div
                  key={hub.name}
                  onClick={() => setSelectedHub(hub.name)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between block text-left ${
                    selectedHub === hub.name
                      ? "bg-[#001c22] border-brand-red shadow-[0_15px_30px_rgba(237,37,78,0.15)]"
                      : "bg-[#001c22]/40 border-muted-teal/15 hover:border-[#FFB3B6]/20"
                  }`}
                >
                  {selectedHub === hub.name && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75 animate-bounce"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                    </span>
                  )}
                  
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-baseline gap-x-2.5">
                      <span className="text-xl sm:text-2xl font-serif font-bold text-white block">{hub.name}</span>
                      <span className="text-[9px] font-mono font-bold text-[#FFB3B6] tracking-tight">{hub.coordinates}</span>
                    </div>
                    <p className="text-xs text-muted-teal leading-relaxed font-sans">
                      {hub.vibe}
                    </p>
                    <div className="text-[9px] text-muted-teal/80 tracking-widest font-bold uppercase pt-1">
                      Active Tastemakers: <span className="text-brand-red font-mono text-[11px] font-black">{hub.activeTastemakers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Challenges and community design tasks */}
          <section className="space-y-5">
            <h3 className="text-xs font-bold text-[#FFB3B6] tracking-widest uppercase flex items-center gap-2 px-1 text-left">
              <Trophy className="w-4 h-4 text-brand-red animate-pulse" /> ACTIVE STYLE DESIGN CHALLENGES
            </h3>
            <div className="space-y-4">
              {CURRENT_CHALLENGES.map((challenge) => (
                <div
                  key={challenge.title}
                  className="bg-[#001c22]/55 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 hover:border-muted-teal/20 transition-all duration-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 block text-left"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <h4 className="text-sm font-sans font-extrabold text-on-surface flex items-center gap-1.5">
                      {challenge.title}
                      <Star className="w-3.5 h-3.5 text-brand-red fill-brand-red" />
                    </h4>
                    <p className="text-xs text-muted-teal leading-relaxed">
                      {challenge.description}
                    </p>
                    <div className="text-[10px] text-muted-teal/80 font-semibold uppercase">
                      Submissions: <span className="text-[#FFB3B6] font-mono">{challenge.submissions}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyPass(challenge.rewardPass)}
                    className="w-full md:w-auto px-5 py-3 border border-muted-teal/30 rounded-full text-[10px] font-mono hover:text-brand-red hover:border-brand-red transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 justify-center h-10 select-none uppercase tracking-widest"
                  >
                    {copiedChallenge === challenge.rewardPass ? (
                      <span className="text-green-500 font-extrabold tracking-widest">Token Copied</span>
                    ) : (
                      <>
                        <span>ENTRY: {challenge.rewardPass}</span>
                        <Compass className="w-3.5 h-3.5 text-muted-teal" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="space-y-12">
          
          {/* Instagram trends macro tracker & Pinterest Mood Ingestion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Instagram trends */}
            <section className="bg-[#001c22]/50 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 space-y-5 block text-left shadow-lg">
              <h3 className="text-xs font-bold text-[#FFB3B6] tracking-widest uppercase flex items-center gap-2 block border-b border-muted-teal/10 pb-3">
                <Instagram className="w-4 h-4 text-brand-red" /> Instagram Trends Index
              </h3>
              <p className="text-[10px] text-muted-teal leading-relaxed leading-normal">
                Pulls macro-level trend data, style search shifts, and emerging color spectrums from Instagram. Matches raw global cues into real design assets.
              </p>

              <div className="space-y-4 pt-1.5">
                {INSTAGRAM_TRENDS.map((trend, idx) => (
                  <div key={idx} className="p-4 bg-background-ink/50 border border-muted-teal/10 rounded-xl space-y-3 block text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-red to-orange-400 flex items-center justify-center text-[8px] font-bold text-white uppercase font-mono">
                        F
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-white block leading-none">{trend.account}</span>
                        <span className="text-[8px] text-muted-teal font-medium leading-none">Instagram Aesthetic Ref</span>
                      </div>
                    </div>

                    {/* Real Image of Instagram design reference */}
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#001c22]/50 border border-muted-teal/10">
                      <img src={trend.image} alt={trend.tag} className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]" referrerPolicy="no-referrer" />
                    </div>

                    <p className="text-[10px] text-muted-teal leading-relaxed italic">
                      "{trend.caption}"
                    </p>

                    <div className="flex justify-between items-baseline pt-1 border-t border-muted-teal/5">
                      <span className="text-xs font-bold text-white font-mono">{trend.tag}</span>
                      <span className="text-[10px] font-bold text-green-400 font-mono">{trend.growth} growth</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[9px] text-muted-teal uppercase font-bold tracking-widest">Search: <span className="font-mono text-white text-[10px]">{trend.searchVolume}</span></span>
                      
                      {/* Dominant Palette Blocks */}
                      <div className="flex gap-1.5">
                        {trend.palette.map((color, cIdx) => (
                          <span key={cIdx} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: color }} title={`Color ${color}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pinterest board mood board ingestion */}
            <section className="bg-[#001c22]/50 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 space-y-5 block text-left shadow-lg">
              <h3 className="text-xs font-bold text-[#FFB3B6] tracking-widest uppercase flex items-center gap-2 block border-b border-muted-teal/10 pb-3">
                <Layers className="w-4 h-4 text-brand-red" /> Pinterest Boards Ingest
              </h3>
              <p className="text-[10px] text-muted-teal leading-relaxed">
                Ingests active Pinterest mood-boards directly. Cross-references coordinates automatically to align AI metric matching.
              </p>

              <div className="space-y-4 pt-1.5">
                {PINTEREST_BOARDS.map((board) => (
                  <div key={board.id} className="p-3 bg-background-ink/50 border border-muted-teal/10 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={board.image} alt={board.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
                      <div className="overflow-hidden">
                        <h4 className="text-[11px] font-bold text-white truncate">{board.name}</h4>
                        <p className="text-[9px] text-muted-teal font-mono mt-0.5">{board.pinCount} pins synced</p>
                      </div>
                    </div>

                    <button 
                      className={`text-[9px] px-3 py-1.5 rounded-full font-bold select-none cursor-pointer tracking-widest border transition-all shrink-0 ${
                        board.synced 
                          ? "bg-green-600/10 border-green-500/30 text-green-400 font-extrabold flex items-center gap-1"
                          : "border-muted-teal/30 hover:border-[#FFB3B6] text-muted-teal hover:text-white"
                      }`}
                    >
                      {board.synced ? (
                        <>
                          <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                          <span>SYNCED</span>
                        </>
                      ) : (
                        <span>SYNC NOW</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Localized YouTube styling modules */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#FFB3B6] tracking-widest uppercase flex items-center gap-2 px-1 text-left">
              <Youtube className="w-4 h-4 text-brand-red" /> YouTube Fashion Channels &amp; Video Embeds
            </h3>
            <p className="text-[10px] text-muted-teal leading-relaxed px-1 text-left">
              Embeds garment assemblies, draping rules, and designer reviews calibrated to your selected subcultures. No app-switching required.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1.5">
              {YOUTUBE_TUTORIALS.map((yt, idx) => (
                <div key={idx} className="bg-[#001c22] border border-muted-teal/10 rounded-2xl overflow-hidden shadow-lg block text-left flex flex-col justify-between">
                  <div className="relative aspect-video bg-black flex-shrink-0">
                    {playingVideoId === yt.id ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${yt.id}?autoplay=1&mute=1`}
                        title={yt.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div 
                        onClick={() => setPlayingVideoId(yt.id)}
                        className="absolute inset-0 cursor-pointer group"
                      >
                        <img src={yt.img} alt={yt.title} className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-80" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-3 right-3 bg-black/85 px-2 py-0.5 text-[9px] font-mono text-white rounded font-bold">
                          {yt.duration}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="w-12 h-12 rounded-full bg-brand-red/95 flex items-center justify-center text-white text-base hover:scale-110 transition-transform shadow-[0_0_15px_rgba(237,37,78,0.5)]">
                            ▶
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-on-surface line-clamp-2">{yt.title}</h4>
                    <div className="flex justify-between items-center text-[10px] text-muted-teal border-t border-muted-teal/5 pt-2.5 mt-2">
                      <span>Channel: <span className="text-white font-semibold">{yt.channel}</span></span>
                      <span>Views: <span className="text-[#FFB3B6] font-mono font-bold">{yt.views}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vogue India Editorial Trend Cards */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#FFB3B6] tracking-widest uppercase flex items-center gap-2 px-1 text-left">
              <BookOpen className="w-4 h-4 text-brand-red animate-pulse" /> Vogue India Curated Editorial Cards
            </h3>
            <p className="text-[10px] text-muted-teal leading-relaxed px-1 text-left">
              Weekly high-fashion macro trends extracted directly from one of world's most authoritative editorial panels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {VOGUE_TRENDS.map((card, idx) => (
                <div key={idx} className="bg-[#001c22] border border-muted-teal/10 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                  <img src={card.img} alt={card.title} className="w-full md:w-32 aspect-square md:aspect-[3/4] object-cover" referrerPolicy="no-referrer" />
                  
                  <div className="p-5 flex flex-col justify-between items-start block text-left">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] text-[#FFB3B6] font-bold uppercase tracking-widest leading-none">
                        <span>{card.source}</span>
                        <span className="font-mono text-muted-teal text-[8px]">{card.date}</span>
                      </div>
                      <h4 className="text-xs font-black text-white leading-tight uppercase font-sans">
                        {card.title}
                      </h4>
                      <p className="text-[10px] text-muted-teal leading-relaxed line-clamp-3">
                        {card.caption}
                      </p>
                    </div>

                    <a 
                      href="#vogue-target" 
                      className="text-[9px] font-bold tracking-widest uppercase text-brand-red hover:text-white pt-3 md:pt-0"
                    >
                      Read Full Report →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
