-- Seed Capstone Skill Node
-- Inserts a canonical skill node for Capstone (Module 11)

INSERT INTO skill_nodes (id, module_id, title, mastery_threshold_placeholder)
VALUES ('e1f94091-62d9-4ac9-8f0a-86c2e3650238', 'c1f94091-62d9-4ac9-8f0a-86c2e3650238', 'Genius Showcase Master Trial', 80)
ON CONFLICT (id) DO NOTHING;
