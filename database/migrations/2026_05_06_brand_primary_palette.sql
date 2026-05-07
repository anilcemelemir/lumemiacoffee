-- Make the site-wide palette default use the requested primary color.
-- Existing admin edits are preserved by only updating known old defaults.

UPDATE appearance_settings
   SET value = '#8B1225'
 WHERE `key` = 'brand-primary'
   AND value IN ('#6B1F2A', '#6b1f2a');

UPDATE appearance_settings
   SET value = '#8B1225'
 WHERE `key` = 'brand-primary-dark'
   AND value IN ('#4A1218', '#4a1218');
