import React, { useState } from "react";
import { Screen, UserProfile } from "../types";
import { Bell, Menu, X, ChevronRight, LogOut, Settings as SettingsIcon } from "lucide-react";

interface NavigationWrapperProps {
  currentScreen: Screen;
  onNavigate: (target: Screen, transition: "none" | "push" | "push_back" | "slide_up") => void;
  profile: UserProfile;
  children: React.ReactNode;
}

export default function NavigationWrapper({
  currentScreen,
  onNavigate,
  profile,
  children
}: NavigationWrapperProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const triggerNav = (target: Screen) => {
    onNavigate(target, "none");
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background-ink text-on-surface flex flex-col pb-28 lg:pb-0">
      
      {/* Top App Bar - Fixed & Blurred (High Luxury Vibe) */}
      <header className="bg-background-ink/80 backdrop-blur-md border-b border-muted-teal/10 flex justify-between items-center w-full px-4 sm:px-6 lg:px-12 h-16 fixed top-0 z-40">
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Burger Button for Sidebar (Visible on Mobile & Tablet) */}
          <button 
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="text-muted-teal hover:text-white transition-colors lg:hidden p-1.5 rounded-lg hover:bg-surface-raised/60 focus:outline-none"
            aria-label="Open Navigation Directory"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="font-serif text-2xl font-bold tracking-widest text-[#F7F5F5] select-none cursor-pointer" onClick={() => triggerNav(Screen.Home)}>
            FADE
          </h1>
          
          {/* Desktop Navigation Map (Visible on large screens only) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 ml-8 xl:ml-12">
            
            {/* home link */}
            <button
              onClick={() => triggerNav(Screen.Home)}
              className={`font-sans text-[11px] tracking-widest uppercase font-bold transition-all duration-300 relative py-1 cursor-pointer flex items-center gap-2 ${
                currentScreen === Screen.Home 
                  ? "text-[#FFB3B6]" 
                  : "text-muted-teal hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              HOME
              {currentScreen === Screen.Home && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full shadow-[0_0_8px_#ED254E]" />
              )}
            </button>

            {/* analytics link */}
            <button
              onClick={() => triggerNav(Screen.Analytics)}
              className={`font-sans text-[11px] tracking-widest uppercase font-bold transition-all duration-300 relative py-1 cursor-pointer flex items-center gap-2 ${
                currentScreen === Screen.Analytics 
                  ? "text-[#FFB3B6]" 
                  : "text-muted-teal hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              INSIGHTS
              {currentScreen === Screen.Analytics && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full shadow-[0_0_8px_#ED254E]" />
              )}
            </button>

            {/* public link */}
            <button
              onClick={() => triggerNav(Screen.World)}
              className={`font-sans text-[11px] tracking-widest uppercase font-bold transition-all duration-300 relative py-1 cursor-pointer flex items-center gap-2 ${
                currentScreen === Screen.World 
                  ? "text-[#FFB3B6]" 
                  : "text-muted-teal hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              WORLD
              {currentScreen === Screen.World && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full shadow-[0_0_8px_#ED254E]" />
              )}
            </button>

            {/* auto_awesome link */}
            <button
              onClick={() => triggerNav(Screen.Studio)}
              className={`font-sans text-[11px] tracking-widest uppercase font-bold transition-all duration-300 relative py-1 cursor-pointer flex items-center gap-2 ${
                currentScreen === Screen.Studio 
                  ? "text-[#FFB3B6]" 
                  : "text-muted-teal hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              STUDIO
              {currentScreen === Screen.Studio ? (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full shadow-[0_0_8px_#ED254E]" />
              ) : (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-red rounded-full animate-ping" />
              )}
            </button>

            {/* group link */}
            <button
              onClick={() => triggerNav(Screen.Friends)}
              className={`font-sans text-[11px] tracking-widest uppercase font-bold transition-all duration-300 relative py-1 cursor-pointer flex items-center gap-2 ${
                currentScreen === Screen.Friends 
                  ? "text-[#FFB3B6]" 
                  : "text-muted-teal hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">group</span>
              FRIENDS
              {currentScreen === Screen.Friends && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full shadow-[0_0_8px_#ED254E]" />
              )}
            </button>
          </nav>
        </div>

        {/* Right Settings controls */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Settings / profile button */}
          <button
            onClick={() => triggerNav(Screen.Setting)}
            className={`hidden lg:flex items-center space-x-2 text-muted-teal hover:text-[#FFB3B6] hover:border-[#FFB3B6]/65 transition-colors px-4 py-1.5 rounded-full border border-muted-teal/30 text-[10px] font-bold tracking-widest cursor-pointer ${
              currentScreen === Screen.Setting ? "border-[#FFB3B6] text-[#FFB3B6]" : ""
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span>SETTINGS</span>
          </button>

          {/* User Profile circle link */}
          <button 
            onClick={() => triggerNav(Screen.Setting)} 
            className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full border-2 border-muted-teal/40 object-cover"
            />
          </button>

          <button className="text-[#FFB3B6] hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-surface-raised/40">
            <Bell className="w-5 h-5 text-muted-teal hover:text-[#FFB3B6] transition-colors" />
          </button>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer (Mobile & Tablet) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#001216]/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel Container */}
          <div className="relative w-72 max-w-[80vw] bg-[#00171d] border-r border-muted-teal/20 h-full flex flex-col p-6 shadow-2xl justify-between transition-transform duration-300 transform translate-x-0">
            
            <div className="space-y-8">
              {/* Drawer Title Block */}
              <div className="flex items-center justify-between border-b border-muted-teal/10 pb-5">
                <h2 className="font-serif text-2xl font-bold tracking-widest text-[#F7F5F5]">FADE</h2>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-raised/85 text-muted-teal hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Avatar info */}
              <div className="flex items-center space-x-3 bg-[#00222a] p-3 rounded-xl border border-muted-teal/10">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-12 h-12 rounded-full border border-brand-red object-cover"
                />
                <div className="overflow-hidden">
                  <h4 className="font-sans font-bold text-sm text-white truncate">{profile.name}</h4>
                  <p className="font-sans text-[10px] text-muted-teal truncate">{profile.email}</p>
                </div>
              </div>

              {/* Navigation directory map */}
              <div className="space-y-1">
                {[
                  { screen: Screen.Home, label: "Home", icon: "home" },
                  { screen: Screen.Analytics, label: "Insights", icon: "analytics" },
                  { screen: Screen.World, label: "World Hubs", icon: "public" },
                  { screen: Screen.Studio, label: "Design Studio", icon: "auto_awesome" },
                  { screen: Screen.Friends, label: "Friends Network", icon: "group" },
                  { screen: Screen.Setting, label: "Settings Matrix", icon: "settings" }
                ].map((item) => {
                  const isActive = currentScreen === item.screen;
                  return (
                    <button
                      key={item.screen}
                      onClick={() => triggerNav(item.screen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors font-sans text-xs font-semibold cursor-pointer ${
                        isActive 
                          ? "bg-brand-red text-white" 
                          : "text-on-surface hover:bg-surface-raised hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout/Footer context inside drawer */}
            <div className="border-t border-muted-teal/10 pt-5 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-teal">
                <span>SUBCULTURE DECK</span>
                <span className="text-[#FFB3B6]">v1.2.0</span>
              </div>
              <button
                onClick={() => {
                  triggerNav(Screen.Welcome);
                  setDrawerOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-surface-raised hover:bg-brand-red border border-muted-teal/20 text-muted-teal hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>SIGN OUT SYNDICATE</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Pane wrapper */}
      <main className="flex-grow pt-16 min-h-[calc(100vh-64px)] overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Option Bar (Visible on Mobile & Tablet size) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-35 flex justify-around items-center px-2 sm:px-6 h-20 bg-surface-raised/95 border-t border-muted-teal/15 shadow-[0_-15px_45px_rgba(0,0,0,0.7)] rounded-t-2xl backdrop-blur-md">
        
        {/* Home */}
        <button
          onClick={() => triggerNav(Screen.Home)}
          className={`flex flex-col items-center justify-center transition-all flex-1 py-2 cursor-pointer group ${
            currentScreen === Screen.Home ? "text-[#FFB3B6]" : "text-muted-teal hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[23px] transition-transform group-hover:scale-105">home</span>
          <span className="text-[9px] uppercase font-sans tracking-tight mt-1 font-semibold">Home</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => triggerNav(Screen.Analytics)}
          className={`flex flex-col items-center justify-center transition-all flex-1 py-2 cursor-pointer group ${
            currentScreen === Screen.Analytics ? "text-[#FFB3B6]" : "text-muted-teal hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[23px] transition-transform group-hover:scale-105">analytics</span>
          <span className="text-[9px] uppercase font-sans tracking-tight mt-1 font-semibold">Insights</span>
        </button>

        {/* World */}
        <button
          onClick={() => triggerNav(Screen.World)}
          className={`flex flex-col items-center justify-center transition-all flex-1 py-2 cursor-pointer group ${
            currentScreen === Screen.World ? "text-[#FFB3B6]" : "text-muted-teal hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[23px] transition-transform group-hover:scale-105">public</span>
          <span className="text-[9px] uppercase font-sans tracking-tight mt-1 font-semibold">World</span>
        </button>

        {/* Studio (Uniform style matching other items) */}
        <button
          onClick={() => triggerNav(Screen.Studio)}
          className={`flex flex-col items-center justify-center transition-all flex-1 py-2 cursor-pointer group ${
            currentScreen === Screen.Studio ? "text-[#FFB3B6]" : "text-muted-teal hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[23px] transition-transform group-hover:scale-105">auto_awesome</span>
          <span className="text-[9px] uppercase font-sans tracking-tight mt-1 font-semibold">Studio</span>
        </button>

        {/* Friends */}
        <button
          onClick={() => triggerNav(Screen.Friends)}
          className={`flex flex-col items-center justify-center transition-all flex-1 py-2 cursor-pointer group ${
            currentScreen === Screen.Friends ? "text-[#FFB3B6]" : "text-muted-teal hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[23px] transition-transform group-hover:scale-105">group</span>
          <span className="text-[9px] uppercase font-sans tracking-tight mt-1 font-semibold">Friends</span>
        </button>

        {/* Settings/Profile */}
        <button
          onClick={() => triggerNav(Screen.Setting)}
          className={`flex flex-col items-center justify-center transition-all flex-1 py-2 cursor-pointer group ${
            currentScreen === Screen.Setting ? "text-[#FFB3B6]" : "text-muted-teal hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[23px] transition-transform group-hover:scale-105">settings</span>
          <span className="text-[9px] uppercase font-sans tracking-tight mt-1 font-semibold">Settings</span>
        </button>
      </nav>

    </div>
  );
}
