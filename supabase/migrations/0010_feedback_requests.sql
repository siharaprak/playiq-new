-- 0010_feedback_requests.sql
-- Creates a table for student feedback requests

CREATE TABLE IF NOT EXISTS feedback_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE feedback_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own feedback requests"
    ON feedback_requests FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own feedback requests"
    ON feedback_requests FOR INSERT
    WITH CHECK (auth.uid() = student_id);
