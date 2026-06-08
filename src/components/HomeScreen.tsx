import React, { useState } from "react";
import { Screen, Post } from "../types";
import { Grid, List, Heart, MessageSquare, Share2, Plus, Camera, Sparkles } from "lucide-react";

interface HomeScreenProps {
  posts: Post[];
  onNavigate: (target: Screen, transition: "slide_up" | "none") => void;
  onPostLike: (id: string) => void;
}

export default function HomeScreen({ posts, onNavigate, onPostLike }: HomeScreenProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Dynamic analytics numbers representing user standing
  const [fitVal] = useState(9.2);
  const [colorVal] = useState(7.8);
  const [vibeVal] = useState(8.5);
  const [occasionVal] = useState(8.1);
  const [overallScore] = useState(8.4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-10 bg-background-ink">
      
      {/* 
        Responsive Layout Strategy:
        - Mobile & Tablet: Dashboard stats (Scoreboard + Circle) at the top of the feed for zero-scroll inspection of user standing.
        - Desktop (lg:): Grid layout where Feed takes the left (lg:col-span-7) and Stats takes the sticky right column (lg:col-span-5).
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Right Section (Dashboard / Profile Standing) - Placed FIRST on Mobile/Tablet */}
        <div className="w-full lg:col-span-5 order-1 lg:order-2 space-y-6 lg:space-y-8 lg:sticky lg:top-24">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            
            {/* Community Standing Scoreboard */}
            <section className="bg-[#001c22] p-5 sm:p-6 rounded-2xl border border-muted-teal/15 shadow-xl space-y-5 lg:space-y-6 hover:border-muted-teal/30 transition-all duration-300">
              <div className="flex justify-between items-center pb-3 border-b border-muted-teal/10">
                <div>
                  <h3 className="text-[10px] font-bold text-muted-teal tracking-widest uppercase font-sans">
                    YOUR AVERAGE STANDING
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl sm:text-5xl font-serif font-bold text-[#F7F5F5] leading-none">
                      {overallScore}
                    </span>
                    <span className="text-lg font-serif text-muted-teal">/ 10</span>
                  </div>
                </div>
                <span className="text-[9px] tracking-widest font-sans font-extrabold uppercase px-2.5 py-1.5 bg-brand-red/10 border border-brand-red/35 rounded text-[#FFB3B6] animate-pulse">
                  LIVE UPDATES
                </span>
              </div>

              <p className="text-xs sm:text-sm font-serif italic text-muted-teal/90 leading-relaxed">
                "Consistently refined. Your silhouette is evolving styles over seasons."
              </p>

              {/* Analysis parameters progress bars */}
              <div className="space-y-3.5 pt-1">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-on-surface/80">
                  ANALYSIS BREAKDOWN
                </h4>
                
                {/* Fit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-semibold tracking-wider font-sans">
                    <span className="text-muted-teal text-[11px]">FIT SILHOUETTE</span>
                    <span className="text-on-surface font-mono">{fitVal}</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: `${fitVal * 10}%` }} />
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-semibold tracking-wider font-sans">
                    <span className="text-muted-teal text-[11px]">COLOR HARMONY</span>
                    <span className="text-on-surface font-mono">{colorVal}</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: `${colorVal * 10}%` }} />
                  </div>
                </div>

                {/* Vibe */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-semibold tracking-wider font-sans">
                    <span className="text-muted-teal text-[11px]">VIBE ALIGNMENT</span>
                    <span className="text-on-surface font-mono">{vibeVal}</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: `${vibeVal * 10}%` }} />
                  </div>
                </div>

                {/* Occasion */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-semibold tracking-wider font-sans">
                    <span className="text-muted-teal text-[11px]">OCCASION MATCH</span>
                    <span className="text-on-surface font-mono">{occasionVal}</span>
                  </div>
                  <div className="w-full h-1 bg-background-ink rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red shadow-[0_0_8px_#ED254E]" style={{ width: `${occasionVal * 10}%` }} />
                  </div>
                </div>
              </div>
            </section>
            
            {/* The Circle (Active Friends) */}
            <section className="bg-[#001c22]/50 p-5 sm:p-6 rounded-2xl border border-muted-teal/10 space-y-4 flex flex-col justify-between hover:border-muted-teal/30 transition-all duration-300">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFB3B6]">
                  The Circle
                </h3>
                <p className="text-[11px] text-muted-teal font-sans">Your collective fashion syndicate validation</p>
              </div>
              
              <div className="flex items-center space-x-4 overflow-x-auto py-2.5 hide-scrollbar">
                
                {/* User card add circle */}
                <div className="flex flex-col items-center flex-shrink-0 space-y-2 cursor-pointer group">
                  <div className="w-12 h-12 rounded-full border border-dashed border-muted-teal/40 flex items-center justify-center group-hover:border-brand-red group-hover:bg-brand-red/5 transition-all">
                    <Plus className="w-5 h-5 text-muted-teal group-hover:text-brand-red transition-colors" />
                  </div>
                  <span className="text-[9px] font-sans font-bold tracking-wide text-muted-teal">Add</span>
                </div>

                {/* Friend 1 (Elena V) */}
                <div className="flex flex-col items-center flex-shrink-0 space-y-2 relative">
                  <div className="relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWT849ATgRumTqcQr6Omh7ZAAaqyEgWve2yKwdCC5720Y_Cxp99tJjuPTSQZ-renyewDsc8RALLqnIIZwUalq3vaEsDTvUueCPpKzaCoJQ6wzSVZjfGReIBNI-RfYnsE1qieip8jiIOds4sdOPuXEyK2yr9D4ptmZ3kuKHQPoPdvinTm6aLuQ7oqgg9CxCqDuCq7Qb8UOU6UD_uAvGUcb42FGD0C_HX5i0-fUhXoaSgBG46Y_c0RvYeSouEYwn8-Q_M7-1XZdbhs-j"
                      className="w-12 h-12 rounded-full object-cover border-2 border-brand-red shadow-[0_0_10px_rgba(237,37,78,0.3)] animate-pulse"
                      alt="Elena V avatar"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#001c22]" />
                  </div>
                  <span className="text-[9px] font-sans font-semibold tracking-wide text-white">Active</span>
                </div>

                {/* Friend 2 (Julian S) */}
                <div className="flex flex-col items-center flex-shrink-0 space-y-2 relative">
                  <div>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUi2gsS1ybE0vQdr9244mdiUZwwzFlX9bQ_BY3TY8cQC-uEpEC6cettrzOw1GIYa_qmpxS3OjpdWeELt88sPxrblTxk1GCjbbKcRqrBw4X-mSKutluHqAsMAfrPGNfgXKWHKZnTQLQJc0Fm4xl8YmElh3b-rBfu9lapCAxytm3dCwljg7rojoUOj-H7j7xooEJYzbW4AmLrE_wVFZd6ZaXpSDLUrbeoaXombPdtZShymiJ3p4xnU6Qy4khPnWN_gN5_cT9BnnMFFo4"
                      className="w-12 h-12 rounded-full object-cover border border-muted-teal/40 hover:border-[#FFB3B6] transition-colors"
                      alt="Julian Black avatar"
                    />
                  </div>
                  <span className="text-[9px] font-sans tracking-wide text-muted-teal">2h ago</span>
                </div>

                {/* Friend 3 (Elena R) */}
                <div className="flex flex-col items-center flex-shrink-0 space-y-2 relative">
                  <div className="relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2aj_LCmzJGr4QTezh3IABobr798-Kcc9YrtUAuyroxgkUx-8zK6sSUSxKZSa-CnVyIDoxvXoqb0PAUeaKRvcf7cEj-E7su3iVzLhxxVP_rs9GFx56seP82jDmm75-pr_IIHiZW1KrYZBKdMNDsaFoiys79dDd3SgNldPR_BESBlM4CG14MyD9yg2r2JSdNRQKLiopAE3LWk6fKk_1L19AdoSZ_sFW5FHt16tvs1fB3Fv2uFxGdSJVqbnSVsn19pemshscNCMQHyKt"
                      className="w-12 h-12 rounded-full object-cover border-2 border-brand-red shadow-[0_0_10px_rgba(237,37,78,0.2)]"
                      alt="Elena Rossi avatar"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#001c22]" />
                  </div>
                  <span className="text-[9px] font-sans font-semibold tracking-wide text-white">Active</span>
                </div>

                {/* Friend 4 (Alex V) */}
                <div className="flex flex-col items-center flex-shrink-0 space-y-2 relative">
                  <div>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuACAd1IZaOiN19uj0fUe8WYbtHfAdZoYkJaZcS7mcRxQROXSicx8lGmehXxExeVufBQ6VrFb6RCO7cmNS5zf5v1eKQ3sKrkKT36fmskPmOT99JnLUl0sNZjuD9bGCHz_Tmr-ibA9LJwV5QmzP0ILmAe5Nn2U9AZm2hYwAtGd3HaJurKcxOVzQrsaRQhuSHJWB9YYlCED0bQYvdJsW3pcJr69NhEOoj8MS6PzW4eKW1_gQjlIiTOIJPyoDv9cx5ObiX3tmUtXcUdu19H"
                      className="w-12 h-12 rounded-full object-cover border border-muted-teal/40 hover:border-[#FFB3B6] transition-colors"
                      alt="Alexander Vance avatar"
                    />
                  </div>
                  <span className="text-[9px] font-sans tracking-wide text-muted-teal">5h ago</span>
                </div>

              </div>
            </section>

          </div>
        </div>
        
        {/* Left Section (Feed & Studio Triggers) - Placed SECOND on Mobile/Tablet */}
        <div className="w-full lg:col-span-7 order-2 lg:order-1 space-y-8 sm:space-y-10">
          
          {/* Studio Trigger (Dashed Border Card) */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#FFB3B6] block px-1">
              FADE DIGITAL SEWING
            </h3>
            <div
              onClick={() => onNavigate(Screen.Studio, "slide_up")}
              className="dashed-border cursor-pointer group border-2 border-dashed border-[#FFB3B6]/25 hover:border-brand-red rounded-2xl p-6 sm:p-10 bg-[#001c22]/30 hover:bg-[#001c22]/70 transition-all duration-300 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 min-h-[200px]"
            >
              {/* Luxury ambient decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/5 via-transparent to-transparent pointer-events-none group-hover:scale-105 duration-700 transition-all" />
              
              <div className="w-14 h-14 rounded-full border border-[#FFB3B6]/30 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red group-hover:scale-105 transition-all duration-300">
                <Camera className="w-6 h-6 text-white" />
              </div>
              
              <div className="space-y-1 z-10 max-w-sm">
                <p className="text-base sm:text-lg font-serif font-semibold text-on-surface group-hover:text-primary-glow">
                  Verify New Silhouette
                </p>
                <p className="text-[10px] sm:text-xs text-muted-teal tracking-wider uppercase font-semibold">
                  Upload portrait or activate Camera to evaluate style
                </p>
              </div>
            </div>
          </section>

          {/* The Feed Content Cards */}
          <section className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-muted-teal/10">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F5F5]">
                The Feed
              </h2>
              <div className="flex bg-surface-raised/60 p-1 rounded-lg border border-muted-teal/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-brand-red text-white" : "text-muted-teal hover:text-white"
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all cursor-pointer ${
                    viewMode === "list" ? "bg-brand-red text-white" : "text-muted-teal hover:text-white"
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Posts feed: dynamic layout responsive mode */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" : "space-y-8 sm:space-y-12"}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#001c22] rounded-2xl border border-muted-teal/10 overflow-hidden shadow-2xl group hover:border-[#FFB3B6]/20 transition-all duration-300 flex flex-col"
                >
                  {/* Photo frame */}
                  <div className="relative aspect-square sm:aspect-[4/5] bg-[#001014] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-102 duration-500 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Score Ribbon Overlay */}
                    <div className="absolute top-4 right-4 bg-[#001c22]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#FFB3B6]/15 flex flex-col items-center shadow-lg">
                      <span className="text-[8px] font-bold text-muted-teal tracking-widest uppercase">
                        GLOBAL RATING
                      </span>
                      <span className="text-xl sm:text-2xl font-serif font-black text-brand-red mt-0.5 leading-none">
                        {post.globalScore}
                      </span>
                    </div>

                    {/* Subculture and Type Labels Overlay */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-background-ink/85 text-[9px] font-semibold tracking-wider border border-muted-teal/30 backdrop-blur-md whitespace-nowrap">
                        {post.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-background-ink/85 text-[9px] font-semibold tracking-wider border border-[#FFB3B6]/20 text-[#FFB3B6] backdrop-blur-md whitespace-nowrap">
                        {post.subCategory}
                      </span>
                    </div>
                  </div>

                  {/* Profile & Interaction Bar */}
                  <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.avatar}
                            alt={post.username}
                            className="w-10 h-10 rounded-full border border-brand-red object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-sm font-sans font-bold text-on-surface leading-tight">
                              {post.username}
                            </p>
                            <p className="text-[10px] text-muted-teal uppercase font-bold tracking-wider mt-0.5">
                              {post.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-on-surface/85 leading-relaxed font-serif italic text-left">
                        "{post.caption}"
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-muted-teal/10 mt-auto">
                      <button
                        onClick={() => onPostLike(post.id)}
                        className={`flex-1 py-3 px-3 rounded-full border flex items-center justify-center gap-2 transition-all cursor-pointer text-xs font-bold leading-none ${
                          post.hasLiked
                            ? "bg-brand-red/10 border-brand-red text-brand-red shadow-[0_0_12px_rgba(237,37,78,0.15)]"
                            : "border-muted-teal/25 text-muted-teal hover:border-[#FFB3B6] hover:text-white"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 transition-transform ${post.hasLiked ? "fill-brand-red scale-110" : "group-hover:scale-105"}`} />
                        <span className="uppercase tracking-wider">Rate</span>
                      </button>

                      <button className="flex-1 py-3 px-3 border border-muted-teal/25 text-muted-teal hover:border-[#FFB3B6] hover:text-white rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer text-xs font-bold leading-none">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wider">Critique</span>
                      </button>

                      <button className="py-3 px-3 border border-muted-teal/25 text-muted-teal hover:border-[#FFB3B6] hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center" aria-label="Share">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
