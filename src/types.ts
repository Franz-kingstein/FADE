export enum Screen {
  Welcome = "Welcome",
  Friends = "Friends",
  World = "World",
  Studio = "Studio",
  Setting = "Setting",
  Home = "Home",
  Analytics = "Analytics",
  Setup = "Setup"
}

export type TransitionType = "none" | "push" | "push_back" | "slide_up";

export interface MeasurementSet {
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  gender: string;
  somatotype: string;
  measurements: MeasurementSet;
  bodyShape: string;
  subcultures: string[];
  settings: {
    brutalistHonesty: boolean;
    trendAnticipation: boolean;
    colorTheoryStrictness: boolean;
    cpwTracking: boolean;
    textileSensitivity: boolean;
  };
  seasonProfile: string;
  contrastIntensity: number;
  textilePreference: "NATURAL" | "SYNTHETIC";
}

export interface Post {
  id: string;
  username: string;
  role: string;
  avatar: string;
  image: string;
  category: string;
  subCategory: string;
  caption: string;
  globalScore: number;
  likes: number;
  hasLiked: boolean;
  commentsCount: number;
}
