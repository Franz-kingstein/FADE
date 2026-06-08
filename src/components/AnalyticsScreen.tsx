import React, { useState } from "react";
import { Sparkles, Search, Sliders, Calendar, BookOpen, Layers, ShieldCheck, Tag } from "lucide-react";
import { ANALYTICS_DATA } from "../data";

interface ClosetGarment {
  id: string;
  name: string;
  category: "Tops" | "Bottoms" | "Outerwear" | "Footwear" | "Accessories";
  tags: string[];
  image: string;
  wearCount: number;
  estCostPerWear: string;
}

const DIGITAL_CLOSET_GARMENTS: ClosetGarment[] = [
  {
    id: "g-1",
    name: "Brutalist Overcoat C01",
    category: "Outerwear",
    tags: ["Asymmetric", "Cashmere", "Deep Winter"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6",
    wearCount: 14,
    estCostPerWear: "$18.50"
  },
  {
    id: "g-2",
    name: "Classic High-Waist Wool Trouser",
    category: "Bottoms",
    tags: ["Wool", "Tailored", "Classic"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg",
    wearCount: 22,
    estCostPerWear: "$9.10"
  },
  {
    id: "g-3",
    name: "Dorset Technical Cargo Shell",
    category: "Tops",
    tags: ["Waterproof", "Nylon", "Techwear"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACAd1IZaOiN19uj0fUe8WYbtHfAdZoYkJaZcS7mcRxQROXSicx8lGmehXxExeVufBQ6VrFb6RCO7cmNS5zf5v1eKQ3sKrkKT36fmskPmOT99JnLUl0sNZjuD9bGCHz_Tmr-ibA9LJwV5QmzP0ILmAe5Nn2U9AZm2hYwAtGd3HaJurKcxOVzQrsaRQhuSHJWB9YYlCED0bQYvdJsW3pcJr69NhEOoj8MS6PzW4eKW1_gQjlIiTOIJPyoDv9cx5ObiX3tmUtXcUdu19H",
    wearCount: 8,
    estCostPerWear: "$32.00"
  },
  {
    id: "g-4",
    name: "Chunky Avant-Garde Boot",
    category: "Footwear",
    tags: ["Platform", "Leather", "Noir"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6",
    wearCount: 19,
    estCostPerWear: "$24.00"
  },
  {
    id: "g-5",
    name: "Laser-Etched Titanium Clasp Belts",
    category: "Accessories",
    tags: ["Metallic", "Structured", "Premium"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUi2gsS1ybE0vQdr9244mdiUZwwzFlX9bQ_BY3TY8cQC-uEpEC6cettrzOw1GIYa_qmpxS3OjpdWeELt88sPxrblTxk1GCjbbKcRqrBw4X-mSKutluHqAsMAfrPGNfgXKWHKZnTQLQJc0Fm4xl8YmElh3b-rBfu9lapCAxytm3dCwljg7rojoUOj-H7j7xooEJYzbW4AmLrE_wVFZd6ZaXpSDLUrbeoaXombPdtZShymiJ3p4xnU6Qy4khPnWN_gN5_cT9BnnMFFo4",
    wearCount: 45,
    estCostPerWear: "$4.20"
  }
];

const HISTORIC_OUTFITS = [
  { date: "June 08, 2026", occasion: "Corporate Pitch", aiScore: 9.2, friendAvg: 8.8, subculture: "Classic Menswear", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg" },
  { date: "June 04, 2026", occasion: "High-Fashion Gala", aiScore: 9.4, friendAvg: 9.1, subculture: "Avant-Garde", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6" },
  { date: "May 29, 2026", occasion: "Casual Brunch", aiScore: 8.1, friendAvg: 7.9, subculture: "Minimalist", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6" },
  { date: "May 20, 2026", occasion: "Content Film Set", aiScore: 8.9, friendAvg: 8.4, subculture: "Techwear", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACAd1IZaOiN19uj0fUe8WYbtHfAdZoYkJaZcS7mcRxQROXSicx8lGmehXxExeVufBQ6VrFb6RCO7cmNS5zf5v1eKQ3sKrkKT36fmskPmOT99JnLUl0sNZjuD9bGCHz_Tmr-ibA9LJwV5QmzP0ILmAe5Nn2U9AZm2hYwAtGd3HaJurKcxOVzQrsaRQhuSHJWB9YYlCED0bQYvdJsW3pcJr69NhEOoj8MS6PzW4eKW1_gQjlIiTOIJPyoDv9cx5ObiX3tmUtXcUdu19H" }
];

const CALENDAR_DAYS = [
  { day: 1, worn: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg", outfit: "Office Minimalist" },
  { day: 2, worn: false },
  { day: 3, worn: false },
  { day: 4, worn: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6", outfit: "Gala Draping Ensemble" },
  { day: 5, worn: false },
  { day: 6, worn: false },
  { day: 7, worn: false },
  { day: 8, worn: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACAd1IZaOiN19uj0fUe8WYbtHfAdZoYkJaZcS7mcRxQROXSicx8lGmehXxExeVufBQ6VrFb6RCO7cmNS5zf5v1eKQ3sKrkKT36fmskPmOT99JnLUl0sNZjuD9bGCHz_Tmr-ibA9LJwV5QmzP0ILmAe5Nn2U9AZm2hYwAtGd3HaJurKcxOVzQrsaRQhuSHJWB9YYlCED0bQYvdJsW3pcJr69NhEOoj8MS6PzW4eKW1_gQjlIiTOIJPyoDv9cx5ObiX3tmUtXcUdu19H", outfit: "Corporate Pitch Suit" },
  { day: 9, worn: false },
  { day: 10, worn: false },
  { day: 11, worn: false },
  { day: 12, worn: false },
  { day: 13, worn: false },
  { day: 14, worn: false },
  { day: 15, worn: false },
  { day: 16, worn: false },
  { day: 17, worn: false },
  { day: 18, worn: false },
  { day: 19, worn: false },
  { day: 20, worn: false },
  { day: 21, worn: false },
  { day: 22, worn: false },
  { day: 23, worn: false },
  { day: 24, worn: false },
  { day: 25, worn: false },
  { day: 26, worn: false },
  { day: 27, worn: false },
  { day: 28, worn: false },
  { day: 29, worn: false },
  { day: 30, worn: false }
];

export default function AnalyticsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCalendarLook, setSelectedCalendarLook] = useState<string | null>(null);

  // Filter garments based on search or category select
  const filteredCloset = DIGITAL_CLOSET_GARMENTS.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 space-y-12 bg-background-ink pb-24 animate-fadeIn">
      
      {/* Page Title Header */}
      <header className="space-y-1 pb-4 sm:pb-6 border-b border-muted-teal/10">
        <span className="text-[10px] font-bold tracking-widest text-[#FFB3B6] uppercase block">
          STYLE DATA &amp; RETROSPECTIVE GRAPH
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F7F5F5] font-bold tracking-tight">
          Personal Closet &amp; <span className="italic text-[#FFB3B6] font-normal">Analytics Engine</span>
        </h2>
      </header>

      {/* 
        ======================================================================
        DIGITAL CLOSET & VISUAL INVENTORY
        ======================================================================
      */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-red" /> DIGITAL CLOSET TWIN
            </h3>
            <p className="text-[11px] text-muted-teal mt-0.5">Every outfit submitted auto-catalogs into this searchable index.</p>
          </div>

          <div className="flex gap-2 flex-grow sm:max-w-xs relative bg-[#001014] rounded-xl border border-muted-teal/20 px-3 py-1.5 items-center">
            <Search className="w-3.5 h-3.5 text-muted-teal" />
            <input
              type="text"
              placeholder="Search garments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-on-surface outline-none w-full"
            />
          </div>
        </div>

        {/* Visual compartments list tags button row */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 min-w-full hide-scrollbar border-b border-muted-teal/5">
          {["all", "Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-wider select-none uppercase transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-red text-white border border-brand-red shadow-[0_4px_10px_rgba(237,37,78,0.2)]"
                  : "border border-muted-teal/20 text-muted-teal hover:border-[#FFB3B6] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Visual Inventory grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCloset.map((garment) => (
            <div
              key={garment.id}
              className="bg-[#001c22] border border-muted-teal/10 rounded-2xl overflow-hidden group hover:border-[#FFB3B6]/25 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-[#001014]">
                <img src={garment.image} alt={garment.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                <span className="absolute top-3 left-3 bg-background-ink/80 border border-muted-teal/20 text-muted-teal font-sans text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                  {garment.category}
                </span>
                
                {/* Auto generated tags row */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  {garment.tags.map((t, idx) => (
                    <span key={idx} className="bg-background-ink/90 text-white text-[8px] font-semibold py-0.5 px-2 rounded border border-[#FFB3B6]/15 flex items-center gap-1">
                      <Tag className="w-2 h-2 text-brand-red" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4.5 space-y-3 block text-left">
                <h4 className="text-xs font-bold text-on-surface truncate">{garment.name}</h4>
                <div className="flex justify-between text-[10px] font-mono border-t border-muted-teal/5 pt-3 text-muted-teal">
                  <span>Wears: <span className="text-white font-bold">{garment.wearCount} times</span></span>
                  <span>CPW: <span className="text-brand-red font-bold">{garment.estCostPerWear}</span></span>
                </div>
              </div>
            </div>
          ))}

          {filteredCloset.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-teal text-xs italic">
              No garments found matching query inside digital Closet.
            </div>
          )}
        </div>
      </section>

      {/* 
        ======================================================================
        ARCHIVE OF LOOKS (CALENDAR PREVENTING SOCIAL LOOK REPETITION)
        ======================================================================
      */}
      <section className="bg-[#001c22]/50 p-6 rounded-2xl border border-muted-teal/15 shadow-xl space-y-6">
        <div className="space-y-1 block text-left">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-red" /> ARCHIVE OF LOOKS
          </h3>
          <p className="text-[11px] text-muted-teal">
            Verify look wear occurrences across dates so you never repeat combinations within overlapping professional circle orbits.
          </p>
        </div>

        {/* Selected Date indicator popup */}
        {selectedCalendarLook && (
          <div className="p-4.5 bg-background-ink/60 border border-brand-red rounded-xl text-left flex items-start gap-4 animate-fadeIn">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6" alt="Looks worn" className="w-12 h-16 object-cover rounded border border-brand-red" referrerPolicy="no-referrer" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest">Outfit Calendar Checked</p>
              <p className="text-sm font-serif italic text-brand-red font-bold mt-1">"{selectedCalendarLook}"</p>
              <p className="text-[10px] text-muted-teal mt-0.5">Worn for GALA presentation &amp; Vogue Editorial circle meeting.</p>
            </div>
            <button onClick={() => setSelectedCalendarLook(null)} className="ml-auto text-xs text-muted-teal hover:text-white">Close</button>
          </div>
        )}

        {/* Calendar days grid (June 2026) */}
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-1 text-center text-muted-teal uppercase tracking-widest text-[9px] font-bold border-b border-muted-teal/10 pb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5">
            {/* June 1 starts on Monday, so 1 empty slot for Sunday */}
            <div className="aspect-square bg-transparent rounded-lg" />
            
            {CALENDAR_DAYS.map((dayObj) => (
              <div
                key={dayObj.day}
                onClick={() => {
                  if (dayObj.worn && dayObj.outfit) {
                    setSelectedCalendarLook(dayObj.outfit);
                  }
                }}
                className={`aspect-square relative rounded-xl border flex flex-col items-center justify-center transition-all ${
                  dayObj.worn
                    ? "bg-[#001014] border-brand-red cursor-pointer hover:scale-103 shadow-[0_0_8px_rgba(237,37,78,0.15)]"
                    : "bg-[#001014]/30 border-muted-teal/10 hover:border-muted-teal/30"
                }`}
              >
                {dayObj.worn && dayObj.img ? (
                  <div className="absolute inset-0 rounded-xl overflow-hidden group">
                    <img src={dayObj.img} alt="Worn" className="w-full h-full object-cover opacity-45" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-brand-red/10 group-hover:bg-brand-red/0 transition-colors" />
                  </div>
                ) : null}
                
                <span className={`text-[10px] z-10 ${dayObj.worn ? "font-bold text-white" : "text-muted-teal"}`}>
                  {dayObj.day}
                </span>

                {dayObj.worn && (
                  <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-brand-red rounded-full" />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-[9px] font-sans text-muted-teal/70 uppercase tracking-widest pt-2">
            📅 June 2026 Calendar Month View
          </p>
        </div>
      </section>

      {/* 
        ======================================================================
        FASHION STYLE PROFILE CARD & DIMENSIONS RATINGS INDEX
        ======================================================================
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Personal Aesthetic style card represent circle averages */}
        <section className="bg-[#001c22] p-6 rounded-2xl border border-muted-teal/15 shadow-xl space-y-6 block text-left">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6]">
              AESTHETIC STYLE RADAR
            </h3>
            <p className="text-[11px] text-muted-teal">Your score categories among your circle over seasonal epochs.</p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="p-4 bg-background-ink/40 border border-muted-teal/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-teal tracking-widest uppercase font-mono block">SUBCULTURE HIGH-PEAK</span>
                <span className="text-base font-serif font-black text-white mt-1 block">Avant-Garde Architectural</span>
              </div>
              <span className="text-2xl font-serif font-black text-brand-red">9.4/10</span>
            </div>

            <div className="p-4 bg-background-ink/40 border border-muted-teal/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-teal tracking-widest uppercase font-mono block">STEALTH TAILORING RATING</span>
                <span className="text-medium font-serif font-bold text-white mt-1 block">Classic Menswear &amp; Wool</span>
              </div>
              <span className="text-xl font-serif font-bold text-[#FFB3B6]">8.9/10</span>
            </div>

            <div className="p-4 bg-background-ink/40 border border-muted-teal/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-teal tracking-widest uppercase font-mono block">STREET STYLE CONFLICT</span>
                <span className="text-medium font-serif font-bold text-white mt-1 block">Y2K Streetwear &amp; Nylon cargo</span>
              </div>
              <span className="text-xl font-serif font-bold text-[#FFB3B6]">8.2/10</span>
            </div>
          </div>
        </section>

        {/* Dynamic score architecture meters */}
        <section className="bg-[#001c22]/50 p-6 rounded-2xl border border-muted-teal/10 shadow-lg space-y-5 block text-left">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6] border-b border-muted-teal/10 pb-3 block">
            DIMENSION RATINGS ARCHITECTURE
          </h3>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold tracking-wider font-sans uppercase">
                <span className="text-muted-teal text-[11px]">GARMENT FIT AND OUTLINE</span>
                <span className="text-brand-red font-mono">9.2 / 10</span>
              </div>
              <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: "92%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold tracking-wider font-sans uppercase">
                <span className="text-muted-teal text-[11px]">COLOR CHROMA OVERLAYS</span>
                <span className="text-brand-red font-mono">7.8 / 10</span>
              </div>
              <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: "78%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold tracking-wider font-sans uppercase">
                <span className="text-muted-teal text-[11px]">VIBE CONFORMANCE MATRIX</span>
                <span className="text-brand-red font-mono">8.5 / 10</span>
              </div>
              <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: "85%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold tracking-wider font-sans uppercase">
                <span className="text-muted-teal text-[11px]">EVENT MATRICES APPROPRIATENESS</span>
                <span className="text-brand-red font-mono">8.1 / 10</span>
              </div>
              <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: "81%" }} />
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 
        ======================================================================
        CHRONOLOGICAL LOGGED OUTIFT SUBMISSIONS HISTORY
        ======================================================================
      */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6] block px-1 text-left">
          CHRONOLOGICAL SUBMISSION JOURNAL HISTORY
        </h3>
        <div className="bg-[#001c22] border border-muted-teal/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-muted-teal/20 text-muted-teal uppercase tracking-widest text-[9px] font-bold bg-[#001c22]/80">
                  <th className="py-4 px-5">DATE</th>
                  <th className="py-4 px-5">OCCASION TARGET</th>
                  <th className="py-4 px-5">SUBCULTURE</th>
                  <th className="py-4 px-5 text-center">AI SCORE</th>
                  <th className="py-4 px-5 text-center">CIRCLE AVG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-teal/5">
                {HISTORIC_OUTFITS.map((outfit, index) => (
                  <tr key={index} className="hover:bg-background-ink/40 transition-colors">
                    <td className="py-4 px-5 font-mono text-white text-[11px]">{outfit.date}</td>
                    <td className="py-4 px-5 font-bold text-on-surface">{outfit.occasion}</td>
                    <td className="py-4 px-5 text-muted-teal">{outfit.subculture}</td>
                    <td className="py-4 px-5 text-center font-bold font-serif text-brand-red">{outfit.aiScore}</td>
                    <td className="py-4 px-5 text-center font-bold font-serif text-[#FFB3B6]">{outfit.friendAvg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
