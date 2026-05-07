-- Adds editable social link URL fields used by the newsletter section.
-- Idempotent: preserves existing admin edits on rerun.

INSERT IGNORE INTO site_content (`key`, value_tr, `group`, label) VALUES
  ('newsletter.social_ig_url', 'https://www.instagram.com/', 'newsletter', 'Instagram URL'),
  ('newsletter.social_fb_url', 'https://www.facebook.com/',  'newsletter', 'Facebook URL'),
  ('newsletter.social_tt_url', 'https://www.tiktok.com/',    'newsletter', 'TikTok URL');
