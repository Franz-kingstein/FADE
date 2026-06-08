import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Screen, UserProfile, Post, TransitionType } from "./types";
import { initialProfile, initialPosts } from "./data";

// Import Custom Screens
import WelcomeScreen from "./components/WelcomeScreen";
import SetupScreen from "./components/SetupScreen";
import NavigationWrapper from "./components/NavigationWrapper";
import HomeScreen from "./components/HomeScreen";
import StudioScreen from "./components/StudioScreen";
import SettingScreen from "./components/SettingScreen";
import AnalyticsScreen from "./components/AnalyticsScreen";
import WorldScreen from "./components/WorldScreen";
import FriendsScreen from "./components/FriendsScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // Keep track of the transition type to apply appropriate animation layouts dynamially
  const [transition, setTransition] = useState<TransitionType>("none");

  const navigateTo = (target: Screen, transitionType: TransitionType) => {
    setTransition(transitionType);
    setCurrentScreen(target);
  };

  const handlePostLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const liked = !post.hasLiked;
          return {
            ...post,
            hasLiked: liked,
            likes: liked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  // Determine motion variants based on selected transition
  const getMotionVariants = () => {
    switch (transition) {
      case "push":
        return {
          initial: { x: "100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 }
        };
      case "push_back":
        return {
          initial: { x: "-100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "100%", opacity: 0 }
        };
      case "slide_up":
        return {
          initial: { y: "100%", opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: "-100%", opacity: 0 }
        };
      case "none":
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  const motionVariants = getMotionVariants();

  return (
    <div className="bg-background-ink min-h-screen text-on-surface">
      <AnimatePresence mode="wait">
        
        {/* Welcome Screen Layout */}
        {currentScreen === Screen.Welcome && (
          <motion.div
            key="welcome"
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            exit={motionVariants.exit}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <WelcomeScreen onNavigate={navigateTo} />
          </motion.div>
        )}

        {/* Setup Screen Layout */}
        {currentScreen === Screen.Setup && (
          <motion.div
            key="setup"
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            exit={motionVariants.exit}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <SetupScreen
              initialProfile={profile}
              onComplete={(updatedProfile, nextTarget, trans) => {
                setProfile(updatedProfile);
                navigateTo(nextTarget, trans);
              }}
            />
          </motion.div>
        )}

        {/* Unified Framing screens (Dashboard pages that contain Persistent Nav Shell) */}
        {currentScreen !== Screen.Welcome && currentScreen !== Screen.Setup && (
          <motion.div
            key={currentScreen}
            initial={motionVariants.initial}
            animate={motionVariants.animate}
            exit={motionVariants.exit}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full h-full"
          >
            <NavigationWrapper
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              profile={profile}
            >
              <AnimatePresence mode="wait">
                
                {/* 1. Home Dashboard Page */}
                {currentScreen === Screen.Home && (
                  <HomeScreen
                    posts={posts}
                    onNavigate={navigateTo}
                    onPostLike={handlePostLike}
                  />
                )}

                {/* 2. Studio Analysis Workplace */}
                {currentScreen === Screen.Studio && (
                  <StudioScreen />
                )}

                {/* 3. Settings Config File Panel */}
                {currentScreen === Screen.Setting && (
                  <SettingScreen
                    profile={profile}
                    onChangeProfile={setProfile}
                    onLogout={() => navigateTo(Screen.Welcome, "push_back")}
                  />
                )}

                {/* 4. Analytics Data Display */}
                {currentScreen === Screen.Analytics && (
                  <AnalyticsScreen />
                )}

                {/* 5. World Trend perspective */}
                {currentScreen === Screen.World && (
                  <WorldScreen />
                )}

                {/* 6. Friends networks */}
                {currentScreen === Screen.Friends && (
                  <FriendsScreen />
                )}

              </AnimatePresence>
            </NavigationWrapper>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
