-- 20260609120000_add_module_feedback.sql
-- Creates the module_feedback table for storing student feedback per module

CREATE TABLE IF NOT EXISTS module_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_module_feedback UNIQUE (student_id, module_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE module_feedback ENABLE ROW LEVEL SECURITY;

-- 1. Students can insert their own module feedback
CREATE POLICY "Students can insert their own module feedback"
    ON module_feedback FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- 2. Students can update their own module feedback
CREATE POLICY "Students can update their own module feedback"
    ON module_feedback FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- 3. Students can view their own module feedback
CREATE POLICY "Students can view their own module feedback"
    ON module_feedback FOR SELECT
    USING (auth.uid() = student_id);

-- 4. Admins can view all module feedback
CREATE POLICY "Admins can view all module feedback"
    ON module_feedback FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
