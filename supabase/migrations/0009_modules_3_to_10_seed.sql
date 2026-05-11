-- 0009_modules_3_to_10_seed.sql
-- Seeds Modules 3 through 10 into the modules table

INSERT INTO modules (id, title, order_num)
VALUES 
  ('c3d94091-62d9-4ac9-8f0a-86c2e3650230', 'Pre-Learn System', 3),
  ('d4e94091-62d9-4ac9-8f0a-86c2e3650231', 'Lesson Rescue Mode', 4),
  ('e5f94091-62d9-4ac9-8f0a-86c2e3650232', 'Compression Learning', 5),
  ('f6a94091-62d9-4ac9-8f0a-86c2e3650233', 'Self-Testing and Mistake Bank', 6),
  ('c7b94091-62d9-4ac9-8f0a-86c2e3650234', 'Notes and Study Pack Creation', 7),
  ('d8c94091-62d9-4ac9-8f0a-86c2e3650235', 'Writing and Answer Clarity', 8),
  ('e9d94091-62d9-4ac9-8f0a-86c2e3650236', 'Build Your AI Tutor', 9),
  ('f0e94091-62d9-4ac9-8f0a-86c2e3650237', 'Build Your AI Assistant', 10)
ON CONFLICT (id) DO NOTHING;
