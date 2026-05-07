-- Adds editable footer social labels and URLs.
-- Idempotent: preserves existing admin edits on rerun.

INSERT IGNORE INTO site_content (`key`, value_tr, `group`, label) VALUES
  ('footer.social_ig',     'Instagram',                  'footer', 'Instagram Etiketi'),
  ('footer.social_ig_url', 'https://www.instagram.com/', 'footer', 'Instagram URL'),
  ('footer.social_fb',     'Facebook',                   'footer', 'Facebook Etiketi'),
  ('footer.social_fb_url', 'https://www.facebook.com/',  'footer', 'Facebook URL'),
  ('footer.social_tt',     'TikTok',                     'footer', 'TikTok Etiketi'),
  ('footer.social_tt_url', 'https://www.tiktok.com/',    'footer', 'TikTok URL');
