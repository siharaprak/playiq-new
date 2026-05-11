-- 0008_module_2_seed.sql
-- Seeds Module 2: Digital Smarts & Human Responsibility into the modules table

INSERT INTO modules (id, title, order_num)
VALUES (
  'b2c94091-62d9-4ac9-8f0a-86c2e3650229',
  'Digital Smarts & Human Responsibility',
  2
)
ON CONFLICT (id) DO NOTHING;
