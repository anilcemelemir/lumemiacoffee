-- Repair footer note title typo/corruption.

UPDATE site_content
   SET value_tr = _utf8mb4 0x42c4b052204e4f5420424952414b494e
 WHERE `key` = 'footer.note_title';
