-- 0001_initial_schema.sql

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARENT CHILD LINKS (Join Table)
CREATE TABLE parent_child_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- COURSES
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULES
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKILL NODES
CREATE TABLE skill_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  mastery_threshold_placeholder INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTEMPTS
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
  pdi_score_placeholder NUMERIC,
  passed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MASTERY CHECKPOINTS
CREATE TYPE checkpoint_status AS ENUM ('locked', 'in_progress', 'mastered');

CREATE TABLE mastery_checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
  status checkpoint_status DEFAULT 'locked',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, node_id)
);

-- PROOF ARTIFACTS
CREATE TYPE artifact_status AS ENUM ('submitted', 'verified');

CREATE TABLE proof_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
  media_path VARCHAR(500) NOT NULL,
  verification_status artifact_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REPORTS (Parent Proof Packets)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  generated_summary_placeholder JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHIPMENTS (Hardware Status)
CREATE TYPE shipment_status AS ENUM ('preparing', 'shipped', 'delivered', 'activated');

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status shipment_status DEFAULT 'preparing',
  tracking_number_placeholder VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUPPORT ISSUES
CREATE TYPE issue_status AS ENUM ('open', 'resolved');

CREATE TABLE support_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  issue_text TEXT NOT NULL,
  status issue_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
