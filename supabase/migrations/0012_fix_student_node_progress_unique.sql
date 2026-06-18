-- 0012_fix_student_node_progress_unique.sql
-- 1. Drop existing unique constraint on (student_id, node_id)
ALTER TABLE student_node_progress DROP CONSTRAINT IF EXISTS student_node_progress_student_id_node_id_key;

-- 2. Add new unique constraint on (student_id, module_id, node_id)
ALTER TABLE student_node_progress ADD CONSTRAINT student_node_progress_student_id_module_id_node_id_key UNIQUE (student_id, module_id, node_id);
