-- Database schema for FADE (Friends Appreciating Dress Elegantly)

-- 1. Create custom enums if they do not exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'aesthetic_style_enum') THEN
        CREATE TYPE aesthetic_style_enum AS ENUM (
            'Techwear', 'DarkAcademia', 'Y2K', 'ClassicMenswear', 'Minimalist', 'AvantGarde', 'Streetwear'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'body_shape_enum') THEN
        CREATE TYPE body_shape_enum AS ENUM (
            'Hourglass', 'Pear', 'Apple', 'Rectangle', 'InvertedTriangle', 'Spoon', 'Diamond', 'Trapezoid', 'Oval'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skin_undertone_enum') THEN
        CREATE TYPE skin_undertone_enum AS ENUM (
            'Warm', 'Cool', 'Neutral'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seasonal_color_profile_enum') THEN
        CREATE TYPE seasonal_color_profile_enum AS ENUM (
            'LightSpring', 'TrueSpring', 'BrightSpring',
            'LightSummer', 'TrueSummer', 'SoftSummer',
            'SoftAutumn', 'TrueAutumn', 'DeepAutumn',
            'DeepWinter', 'TrueWinter', 'BrightWinter'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'somatotype_enum') THEN
        CREATE TYPE somatotype_enum AS ENUM (
            'Ectomorph', 'Mesomorph', 'Endomorph'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'occasion_tag_enum') THEN
        CREATE TYPE occasion_tag_enum AS ENUM (
            'CorporatePitch', 'CasualBrunch', 'HighFashionGala', 'ContentFilmSet', 'DateNight', 'FormalEvent', 'CasualWeekend', 'Other'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_tag_enum') THEN
        CREATE TYPE feedback_tag_enum AS ENUM (
            'Elevate', 'Appreciate'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wardrobe_category_enum') THEN
        CREATE TYPE wardrobe_category_enum AS ENUM (
            'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'
        );
    END IF;
END $$;

-- 2. Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_photo_url VARCHAR(255),
  aesthetic_style aesthetic_style_enum,
  body_shape body_shape_enum,
  skin_undertone skin_undertone_enum,
  seasonal_color_profile seasonal_color_profile_enum,
  somatotype somatotype_enum,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(circle_id, user_id)
);

CREATE TABLE IF NOT EXISTS invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  generated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS outfit_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  occasion_tag occasion_tag_enum NOT NULL,
  ai_score_overall REAL NOT NULL,
  ai_score_color_harmony REAL NOT NULL,
  ai_score_silhouette_fit REAL NOT NULL,
  ai_score_occasion_match REAL NOT NULL,
  ai_score_fabric_appropriateness REAL NOT NULL,
  ai_feedback_summary TEXT NOT NULL,
  ai_suggested_improvements TEXT NOT NULL,
  palette_flag BOOLEAN DEFAULT FALSE,
  palette_flag_reason TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friend_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES outfit_submissions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 10),
  rating_fit INT NOT NULL CHECK (rating_fit BETWEEN 1 AND 10),
  rating_color INT NOT NULL CHECK (rating_color BETWEEN 1 AND 10),
  rating_vibe INT NOT NULL CHECK (rating_vibe BETWEEN 1 AND 10),
  rating_occasion INT NOT NULL CHECK (rating_occasion BETWEEN 1 AND 10),
  feedback_tag feedback_tag_enum NOT NULL,
  text_comment TEXT,
  voice_note_url VARCHAR(255),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(submission_id, reviewer_id)
);

CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  category wardrobe_category_enum NOT NULL,
  color_tag VARCHAR(50) NOT NULL,
  fabric_type VARCHAR(100) NOT NULL,
  occasion_suitability VARCHAR(100)[] NOT NULL,
  times_worn INT DEFAULT 0,
  purchase_price REAL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
