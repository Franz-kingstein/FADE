import { UserProfile, Post } from "./types";

export const initialProfile: UserProfile = {
  name: "Julian Thorne",
  email: "julian.thorne@fade.exclusive",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1NTeNKBvKgw7u8eyF7XuTOVGa0q0rQQiN2L5MVlVGJBumnqo1U2Auh_smj-uYpPt_fdhb2z0BAxMnty6HY5a3Vy7CN8RQNXY541ESJNoKLo7EmTNxkyOU1_miRldGnl3y3IQjJJ1qhcXM2sQ4PctL-xww7bLZuAjeZ0q8ltb7Vf9BaOHhSYUKNkVbew-PJ2xhq6Lrb8q-KFVPGOygcgJqTm2IW_27TlM-fi0-YxsBgXoJyI4xnAa97LXFMW9QJvhSDwGH67gcf5VM",
  gender: "MEN",
  somatotype: "MESOMORPH",
  measurements: {
    shoulder: 112,
    chest: 98,
    waist: 84,
    hip: 96
  },
  bodyShape: "Inverted Triangle",
  subcultures: ["Techwear", "Classic Menswear", "Avant-Garde", "Minimalist"],
  settings: {
    brutalistHonesty: true,
    trendAnticipation: false,
    colorTheoryStrictness: true,
    cpwTracking: true,
    textileSensitivity: false
  },
  seasonProfile: "Deep Winter (High Contrast)",
  contrastIntensity: 74,
  textilePreference: "NATURAL"
};

export const SUBCULTURES = [
  "Techwear",
  "Dark Academia",
  "Y2K",
  "Classic Menswear",
  "Avant-Garde",
  "Minimalist",
  "Streetwear",
  "Baroque Future",
  "Cyber Brutalism"
];

export const initialPosts: Post[] = [
  {
    id: "post-1",
    username: "Elena V.",
    role: "Vogue Editorialist",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWT849ATgRumTqcQr6Omh7ZAAaqyEgWve2yKwdCC5720Y_Cxp99tJjuPTSQZ-renyewDsc8RALLqnIIZwUalq3vaEsDTvUueCPpKzaCoJQ6wzSVZjfGReIBNI-RfYnsE1qieip8jiIOds4sdOPuXEyK2yr9D4ptmZ3kuKHQPoPdvinTm6aLuQ7oqgg9CxCqDuCq7Qb8UOU6UD_uAvGUcb42FGD0C_HX5i0-fUhXoaSgBG46Y_c0RvYeSouEYwn8-Q_M7-1XZdbhs-j",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-jiiIR9zzekkaILLpDYifvGQB7xjmzmSLmb1vZAYtmaMrGvQnhTUVoSPoZhkPV8JaMqAVze5ZuUdY2acx7yF1xKBPss7T8MjinwRjKiXb24uFn1tEL-RbaVyotf0lwYJ46Mk9bJEexp4gAgN5EGiZYoSBDjfUANQafdwnm1FK2vzxe32hCM0KbuL8IvuY0GzLaxPOBg1JQl9XTDW_MyOpCPgyOern0x0Iww8HfC7R8A67MLYoUU1fPXIwNqmCu2cPNQaz5YXwNb6",
    category: "Avant-Garde",
    subCategory: "Fall '24",
    caption: "Experimenting with proportions. The silhouette is inspired by brutalist architecture. Feedback on the draping?",
    globalScore: 9.1,
    likes: 247,
    hasLiked: false,
    commentsCount: 38
  },
  {
    id: "post-2",
    username: "Julian S.",
    role: "Executive Stealth Look",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aj_LCmzJGr4QTezh3IABobr798-Kcc9YrtUAuyroxgkUx-8zK6sSUSxKZSa-CnVyIDoxvXoqb0PAUeaKRvcf7cEj-E7su3iVzLhxxVP_rs9GFx56seP82jDmm75-pr_IIHiZW1KrYZBKdMNDsaFoiys79dDd3SgNldPR_BESBlM4CG14MyD9yg2r2JSdNRQKLiopAE3LWk6fKk_1L19AdoSZ_sFW5FHt16tvs1fB3Fv2uFxGdSJVqbnSVsn19pemshscNCMQHyKt",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOhvV6oKfyKHX0b4T39tZCrw-8XshtbbmJzRt3oHUiJhluumXBvdYs7cVczG_MVAJzBRW2op-DSF2UOm9-bDPAGDz_Yc5AIzRWT5tMnMy2UrcVYd16Gf7cpCItyaD1qAWG1PeQR_TuTHIRLhXz7ZdxqsQ7P9zR8supANeh696JvdcBYepcVK0CzHXJdDxb_piq8g41GptBGjxFdG8ZpasXsmfdtGDOuTxGnJENTbW9MpinxaudVLihWwGvrNimbXxlxl5y3LgDRCFg",
    category: "Minimalist",
    subCategory: "Office Luxury",
    caption: "Classic cashmere coat matched with high-waist wool trousers. Clean corporate power style.",
    globalScore: 7.8,
    likes: 189,
    hasLiked: true,
    commentsCount: 14
  }
];

export const GLOBAL_HUBS = [
  { name: "Paris", coordinates: "48.8566° N, 2.3522° E", vibe: "Haute Couture, Drape Mastery, Structured Serifs", activeTastemakers: 124 },
  { name: "Tokyo", coordinates: "35.6764° N, 139.6500° E", vibe: "Techwear Cybernetics, Avant-Garde Layers, Deconstructivism", activeTastemakers: 98 },
  { name: "Milan", coordinates: "45.4642° N, 9.1900° E", vibe: "Bespoke Power Suits, Luxurious Wool, Clean Symmetry", activeTastemakers: 84 },
  { name: "New York", coordinates: "40.7128° N, -74.0060° E", vibe: "Stealth Luxury, Dark Monochrome, Sharp Slit Tailoring", activeTastemakers: 110 }
];

export const CURRENT_CHALLENGES = [
  { title: "Cyber Brutalism", description: "Incorporate stark angles, pure black synthetics, and technical clips.", submissions: 320, rewardPass: "FD-CY-99" },
  { title: "Earthy Minimalist Transition", description: "Vibe check with high-waisted linen, raw organic tones, cool light shadows.", submissions: 245, rewardPass: "FD-EM-88" },
  { title: "Neo-Baroque Draping", description: "Exaggerated heavy lapels, cascading folds, rich satin or deep velvet textures.", submissions: 154, rewardPass: "FD-NB-77" }
];

export const ANALYTICS_DATA = {
  scoreHistory: [
    { label: "Deep Winter", score: 8.8 },
    { label: "Soft Autumn", score: 8.2 },
    { label: "Light Summer", score: 7.9 },
    { label: "Bright Spring", score: 8.4 },
    { label: "Avant-Garde", score: 9.3 },
    { label: "Stealth Minimalist", score: 8.7 }
  ],
  dimensionsBreakdown: {
    fit: 9.2,
    color: 7.8,
    vibe: 8.5,
    occasion: 8.1
  },
  undertoneDominance: {
    cool: 74,
    warm: 26
  }
};
