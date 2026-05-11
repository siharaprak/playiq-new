-- 0011_capstone_seed.sql
-- Seeds the Capstone Master Trial into the modules table

INSERT INTO modules (id, title, order_num)
VALUES 
  ('c1f94091-62d9-4ac9-8f0a-86c2e3650238', 'Capstone: Master Trial', 11)
ON CONFLICT (id) DO NOTHING;
