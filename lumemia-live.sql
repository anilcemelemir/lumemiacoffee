-- MariaDB dump 10.19-11.4.10-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: lumemia
-- ------------------------------------------------------
-- Server version	11.4.10-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `appearance_settings`
--

DROP TABLE IF EXISTS `appearance_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `appearance_settings` (
  `key` varchar(80) NOT NULL,
  `value` varchar(255) NOT NULL,
  `kind` varchar(20) NOT NULL DEFAULT 'color',
  `group` varchar(40) NOT NULL DEFAULT 'theme',
  `label` varchar(160) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appearance_settings`
--

LOCK TABLES `appearance_settings` WRITE;
/*!40000 ALTER TABLE `appearance_settings` DISABLE KEYS */;
INSERT INTO `appearance_settings` VALUES
('apple-touch-icon-url','','url','icons','Apple Touch Icon (iOS ana ekran)',310,'2026-05-18 08:26:35'),
('border-soft','#E0D4BE','color','theme','Yumu??ak kenarl??k',120,'2026-05-05 15:27:11'),
('brand-accent','#C9A961','color','theme','Vurgu (alt??n)',30,'2026-05-05 15:27:11'),
('brand-accent-soft','#E2C68A','color','theme','Vurgu a????k',40,'2026-05-05 15:27:11'),
('brand-name','Lume Mia Cafe','text','brand','Marka ad??',220,'2026-05-15 15:36:09'),
('brand-primary','#8B1225','color','theme','Birincil (bordo)',10,'2026-05-05 18:47:34'),
('brand-primary-dark','#4A1218','color','theme','Birincil koyu',20,'2026-05-05 18:48:44'),
('favicon-url','/uploads/favicon_20260518_082929_39362842.webp','url','icons','Favicon (tarayıcı sekme ikonu)',300,'2026-05-18 08:29:32'),
('font-body','Inter, sans-serif','font','typography','G??vde fontu',310,'2026-05-05 15:27:11'),
('font-display','Cormorant Garamond, serif','font','typography','Ba??l??k fontu',300,'2026-05-05 15:27:11'),
('logo-mark-url','/uploads/logo-mark_20260505_184619_8c01615d.webp','url','brand','Logo i??areti URL',210,'2026-05-05 18:46:20'),
('logo-url','/uploads/logo_20260505_184450_fa7122d1.webp','url','brand','Logo URL',200,'2026-05-05 18:44:52'),
('menu_cta.background','dotted','option','layout','Men?? CTA arka plan?? (dotted | cream)',400,'2026-05-05 15:27:11'),
('menu.compact_footer','true','option','layout','Men?? sayfas??nda kompakt footer',420,'2026-05-05 15:27:11'),
('nav.solid_on_subpages','true','option','layout','Alt sayfalarda tepe ??ubu??u opak ba??las??n',410,'2026-05-05 15:27:11'),
('surface-cream','#f5f2e1','color','theme','Krem zemin',50,'2026-05-05 18:51:21'),
('surface-ink','#2A1A1C','color','theme','M??rekkep (koyu)',70,'2026-05-05 15:27:11'),
('surface-mist','#EDE4D3','color','theme','Pus (yumu??ak)',80,'2026-05-05 15:27:11'),
('surface-paper','#FAF6EE','color','theme','Ka????t zemin',60,'2026-05-05 15:27:11'),
('text-muted','#7A6B5D','color','theme','Soluk metin',110,'2026-05-05 15:27:11'),
('text-on-dark','#F4EFE6','color','theme','Koyu ??zerinde metin',100,'2026-05-05 15:27:11'),
('text-primary','#2A1A1C','color','theme','Birincil metin',90,'2026-05-05 15:27:11');
/*!40000 ALTER TABLE `appearance_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES
(20,'Kahvaltı & Brunch','kahvalti-brunch',0,'2026-05-18 08:53:36'),
(21,'TOSTLAR & SANDVİÇLER','tostlar-sandvicler',10,'2026-05-18 08:53:36'),
(22,'KRUVASANLAR','kruvasanlar',20,'2026-05-18 08:53:36'),
(23,'BOWL & SALATALAR','bowl-salatalar',30,'2026-05-18 08:53:36'),
(24,'TATLILAR','tatlilar',40,'2026-05-18 08:53:36'),
(25,'İMZA İÇECEKLER (LUME SIGNATURES)','imza-icecekler-lume-signatures',50,'2026-05-18 08:53:36'),
(26,'SICAK KAHVELER (HOT BREWS)','sicak-kahveler-hot-brews',60,'2026-05-18 08:53:36'),
(27,'Mocha Serisi','mocha-serisi',70,'2026-05-18 08:53:36'),
(28,'Demleme & Geleneksel','demleme-geleneksel',80,'2026-05-18 08:53:36'),
(29,'Iced Coffees','iced-coffees',90,'2026-05-18 08:53:36'),
(30,'Matcha Serisi','matcha-serisi',100,'2026-05-18 08:53:36'),
(31,'Serin Lezzetler','serin-lezzetler',110,'2026-05-18 08:53:36'),
(32,'Frappe, Frozen & Milkshake','frappe-frozen-milkshake',120,'2026-05-18 08:53:36');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `email` varchar(190) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'new',
  `consent` tinyint(1) NOT NULL DEFAULT 1,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_contact_messages_status_created` (`status`,`created_at`),
  KEY `idx_contact_messages_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_rate_limits`
--

DROP TABLE IF EXISTS `form_rate_limits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_rate_limits` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(40) NOT NULL,
  `ip_hash` char(64) NOT NULL,
  `attempts` smallint(6) NOT NULL DEFAULT 0,
  `window_started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_form_rate_limits_action_ip` (`action`,`ip_hash`),
  KEY `idx_form_rate_limits_updated` (`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_rate_limits`
--

LOCK TABLES `form_rate_limits` WRITE;
/*!40000 ALTER TABLE `form_rate_limits` DISABLE KEYS */;
/*!40000 ALTER TABLE `form_rate_limits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_subscribers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(190) NOT NULL,
  `source` varchar(60) NOT NULL DEFAULT 'website',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_newsletter_subscribers_email` (`email`),
  KEY `idx_newsletter_subscribers_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
INSERT INTO `newsletter_subscribers` VALUES
(2,'velihan@gmail.com','newsletter',1,'172.23.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-15 15:01:32','2026-05-15 15:01:47');
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `name` varchar(160) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `currency` char(3) NOT NULL DEFAULT 'TRY',
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_available` (`is_available`),
  KEY `idx_products_featured` (`is_featured`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(95,20,'Yeni Nesil Kahvaltı Tabağı','yeni-nesil-kahvalti-tabagi-kahvalti-brunch','Göz yumurta, kızarmış hellim, roastbeef, Ezine peyniri, mozzarella top peynir, domates, salatalık, roka, avokado, kapya biber, yeşil zeytin, siyah zeytin, bal & kaymak, taze ekmek ve 1 bardak çay.',480.00,'TRY','/uploads/finedine/095-yeni-nesil-kahvalti-tabagi-kahvalti-brunch.png',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:56:34'),
(96,20,'Çift Kişilik Kahvaltı','cift-kisilik-kahvalti-kahvalti-brunch','2 haşlanmış yumurta, menemen, avokado, roka, Cecil peyniri, Ezine peyniri, kaşar peyniri, domates, salatalık, yeşil zeytin, siyah zeytin,  Sıcak pankek, 2 çeşit reçel, bal, kaymak, sürülebilir çikolata ve sınırsız çay eşliğinde',1000.00,'TRY','/uploads/finedine/096-cift-kisilik-kahvalti-kahvalti-brunch.jpeg',NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:56:35'),
(97,20,'Brokoli ve Kaşarlı Omlet','brokoli-ve-kasarli-omlet-kahvalti-brunch','3 yumurtalı, kaşar peynirli, brokoli ve domatesli omlet; roka, domates ve salatalık eşliğinde.',250.00,'TRY','/uploads/finedine/097-brokoli-ve-kasarli-omlet-kahvalti-brunch.jpeg',NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:56:36'),
(98,20,'Avokado Tartini Bowl','avokado-tartini-bowl-kahvalti-brunch','Ekşi Maya ekmek üzerinde labne & avokado sos ile göz yumurta, ballı yoğurt (muz, çilek, fıstık ezmesi, granola ve chia tohumu ile).',480.00,'TRY','/uploads/finedine/098-avokado-tartini-bowl-kahvalti-brunch.jpeg',NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:56:37'),
(99,20,'Mozarella Caprese Tartini','mozarella-caprese-tartini-kahvalti-brunch','Ekşi maya ekmek üzerinde pesto sos, dilimlenmiş mozzarella ve domates, balzamik sos ile; roka, domates ve salatalık eşliğinde.',400.00,'TRY','/uploads/finedine/099-mozarella-caprese-tartini-kahvalti-brunch.png',NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:56:38'),
(100,20,'Yulaf Bowl','yulaf-bowl-kahvalti-brunch','Badem sütü ile hazırlanan yulaf; bal, fıstık ezmesi, badem, muz ve chia tohumu ile.',320.00,'TRY','/uploads/finedine/100-yulaf-bowl-kahvalti-brunch.png',NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:56:39'),
(101,20,'Granola Bowl','granola-bowl-kahvalti-brunch','Ballı yoğurt; muz, çilek, fıstık ezmesi, chia tohumu, granola ve kabak çekirdeği ile.',380.00,'TRY','/uploads/finedine/101-granola-bowl-kahvalti-brunch.png',NULL,1,0,60,'2026-05-18 08:53:36','2026-05-18 08:56:40'),
(102,21,'Hindi Füme Tost','hindi-fume-tost-tostlar-sandvicler',NULL,250.00,'TRY','/uploads/finedine/102-hindi-fume-tost-tostlar-sandvicler.png',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:56:42'),
(103,21,'Avokadolu Tost','avokadolu-tost-tostlar-sandvicler',NULL,280.00,'TRY','/uploads/finedine/103-avokadolu-tost-tostlar-sandvicler.png',NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:56:43'),
(104,21,'Pesto Soslu Tost','pesto-soslu-tost-tostlar-sandvicler',NULL,220.00,'TRY','/uploads/finedine/104-pesto-soslu-tost-tostlar-sandvicler.png',NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:56:44'),
(105,21,'Roast Beef Sandviç','roast-beef-sandvic-tostlar-sandvicler',NULL,380.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(106,21,'Mozarella Sandviç','mozarella-sandvic-tostlar-sandvicler',NULL,320.00,'TRY',NULL,NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(107,21,'Avokadolu Kaşarlı Sandviç','avokadolu-kasarli-sandvic-tostlar-sandvicler',NULL,320.00,'TRY',NULL,NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(108,21,'Simit Sandviç','simit-sandvic-tostlar-sandvicler',NULL,220.00,'TRY',NULL,NULL,1,0,60,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(109,22,'Avokadolu Yumurtalı Kruvasan','avokadolu-yumurtali-kruvasan-kruvasanlar',NULL,380.00,'TRY','/uploads/finedine/109-avokadolu-yumurtali-kruvasan-kruvasanlar.png',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:56:46'),
(110,22,'Roast Beefli Kruvasan','roast-beefli-kruvasan-kruvasanlar',NULL,360.00,'TRY','/uploads/finedine/110-roast-beefli-kruvasan-kruvasanlar.png',NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:56:47'),
(111,22,'Pastacı Kremalı Kruvasan','pastaci-kremali-kruvasan-kruvasanlar',NULL,320.00,'TRY','/uploads/finedine/111-pastaci-kremali-kruvasan-kruvasanlar.png',NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:56:49'),
(112,22,'Nutellalı Kruvasan','nutellali-kruvasan-kruvasanlar',NULL,320.00,'TRY','/uploads/finedine/112-nutellali-kruvasan-kruvasanlar.png',NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:56:50'),
(113,23,'Bonfile Bowl','bonfile-bowl-bowl-salatalar',NULL,650.00,'TRY','/uploads/finedine/113-bonfile-bowl-bowl-salatalar.png',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:56:52'),
(114,23,'Somon Bowl','somon-bowl-bowl-salatalar',NULL,575.00,'TRY','/uploads/finedine/114-somon-bowl-bowl-salatalar.png',NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:56:53'),
(115,23,'Tavuklu Bowl','tavuklu-bowl-bowl-salatalar',NULL,425.00,'TRY','/uploads/finedine/115-tavuklu-bowl-bowl-salatalar.png',NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:56:55'),
(116,23,'Köfte Bowl','kofte-bowl-bowl-salatalar',NULL,450.00,'TRY','/uploads/finedine/116-kofte-bowl-bowl-salatalar.png',NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:56:56'),
(117,23,'Tulum Peynirli Salata','tulum-peynirli-salata-bowl-salatalar',NULL,325.00,'TRY','/uploads/finedine/117-tulum-peynirli-salata-bowl-salatalar.png',NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:56:58'),
(118,23,'Ton Balıklı Salata','ton-balikli-salata-bowl-salatalar',NULL,400.00,'TRY',NULL,NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(119,23,'Tavuklu Salata','tavuklu-salata-bowl-salatalar',NULL,375.00,'TRY','/uploads/finedine/119-tavuklu-salata-bowl-salatalar.png',NULL,1,0,60,'2026-05-18 08:53:36','2026-05-18 08:56:59'),
(120,23,'Bonfileli Salata','bonfileli-salata-bowl-salatalar',NULL,500.00,'TRY','/uploads/finedine/120-bonfileli-salata-bowl-salatalar.png',NULL,1,0,70,'2026-05-18 08:53:36','2026-05-18 08:57:00'),
(121,24,'Çilekli Magnolya','cilekli-magnolya-tatlilar',NULL,300.00,'TRY','/uploads/finedine/121-cilekli-magnolya-tatlilar.png',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:57:02'),
(122,24,'Cam Kavanozda Profiterol','cam-kavanozda-profiterol-tatlilar',NULL,300.00,'TRY','/uploads/finedine/122-cam-kavanozda-profiterol-tatlilar.png',NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:57:03'),
(123,24,'San Sebastian Cheesecake','san-sebastian-cheesecake-tatlilar',NULL,300.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(124,24,'Beyaz Çikolatalı Brownie','beyaz-cikolatali-brownie-tatlilar',NULL,300.00,'TRY','/uploads/finedine/124-beyaz-cikolatali-brownie-tatlilar.png',NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:57:04'),
(125,24,'Tiramisu','tiramisu-tatlilar',NULL,300.00,'TRY','/uploads/finedine/125-tiramisu-tatlilar.png',NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:57:06'),
(126,24,'Lotuslu Cheesecake','lotuslu-cheesecake-tatlilar',NULL,300.00,'TRY','/uploads/finedine/126-lotuslu-cheesecake-tatlilar.png',NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:57:07'),
(127,24,'Limonlu Cheesecake','limonlu-cheesecake-tatlilar',NULL,300.00,'TRY','/uploads/finedine/127-limonlu-cheesecake-tatlilar.png',NULL,1,0,60,'2026-05-18 08:53:36','2026-05-18 08:57:08'),
(128,24,'Frambuazlı Cheesecake','frambuazli-cheesecake-tatlilar',NULL,300.00,'TRY','/uploads/finedine/128-frambuazli-cheesecake-tatlilar.png',NULL,1,0,70,'2026-05-18 08:53:36','2026-05-18 08:57:09'),
(129,24,'Havuçlu Kek','havuclu-kek-tatlilar',NULL,250.00,'TRY','/uploads/finedine/129-havuclu-kek-tatlilar.jpeg',NULL,1,0,80,'2026-05-18 08:53:36','2026-05-18 08:57:11'),
(130,24,'Mozaik Pasta','mozaik-pasta-tatlilar',NULL,200.00,'TRY','/uploads/finedine/130-mozaik-pasta-tatlilar.png',NULL,1,0,90,'2026-05-18 08:53:36','2026-05-18 08:57:12'),
(131,24,'Çikolatalı Ekler','cikolatali-ekler-tatlilar',NULL,200.00,'TRY','/uploads/finedine/131-cikolatali-ekler-tatlilar.png',NULL,1,0,100,'2026-05-18 08:53:36','2026-05-18 08:57:13'),
(132,24,'Orman Meyveli Row Boil','orman-meyveli-row-boil-tatlilar',NULL,180.00,'TRY',NULL,NULL,1,0,110,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(133,24,'Cookies','cookies-tatlilar',NULL,180.00,'TRY',NULL,NULL,1,0,120,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(134,24,'Snickers','snickers-tatlilar',NULL,50.00,'TRY',NULL,NULL,1,0,130,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(135,25,'Golden Hug','golden-hug-imza-icecekler-lume-signatures',NULL,230.00,'TRY','/uploads/finedine/135-golden-hug-imza-icecekler-lume-signatures.jpeg',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:57:14'),
(136,25,'Pecan Latte','pecan-latte-imza-icecekler-lume-signatures',NULL,230.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(137,25,'Salted Pecan Latte','salted-pecan-latte-imza-icecekler-lume-signatures',NULL,230.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(138,25,'Cookies Caramel Latte','cookies-caramel-latte-imza-icecekler-lume-signatures',NULL,230.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(139,25,'Orange Mocha','orange-mocha-imza-icecekler-lume-signatures',NULL,250.00,'TRY',NULL,NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(140,25,'Latte','latte-imza-icecekler-lume-signatures',NULL,230.00,'TRY',NULL,NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(141,25,'Caramel Latte','caramel-latte-imza-icecekler-lume-signatures',NULL,210.00,'TRY',NULL,NULL,1,0,60,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(142,25,'Vanilla Latte','vanilla-latte-imza-icecekler-lume-signatures',NULL,210.00,'TRY',NULL,NULL,1,0,70,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(143,25,'Hazelnut Latte','hazelnut-latte-imza-icecekler-lume-signatures',NULL,210.00,'TRY',NULL,NULL,1,0,80,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(144,26,'Latte','latte-sicak-kahveler-hot-brews',NULL,180.00,'TRY','/uploads/finedine/144-latte-sicak-kahveler-hot-brews.jpeg',NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:57:15'),
(145,26,'Cappuccino','cappuccino-sicak-kahveler-hot-brews',NULL,170.00,'TRY','/uploads/finedine/145-cappuccino-sicak-kahveler-hot-brews.jpeg',NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:57:16'),
(146,26,'Americano','americano-sicak-kahveler-hot-brews',NULL,160.00,'TRY','/uploads/finedine/146-americano-sicak-kahveler-hot-brews.jpeg',NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:57:17'),
(147,26,'Cortado','cortado-sicak-kahveler-hot-brews',NULL,160.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(148,26,'Flat White','flat-white-sicak-kahveler-hot-brews',NULL,160.00,'TRY',NULL,NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(149,26,'Espresso Macchiato','espresso-macchiato-sicak-kahveler-hot-brews',NULL,200.00,'TRY',NULL,NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(150,26,'Ristretto','ristretto-sicak-kahveler-hot-brews',NULL,120.00,'TRY',NULL,NULL,1,0,60,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(151,26,'Espresso','espresso-sicak-kahveler-hot-brews',NULL,110.00,'TRY',NULL,NULL,1,0,70,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(152,27,'Mocha','mocha-mocha-serisi',NULL,230.00,'TRY',NULL,NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(153,27,'Zebra Mocha','zebra-mocha-mocha-serisi',NULL,230.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(154,27,'White Mocha','white-mocha-mocha-serisi',NULL,210.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(155,27,'Chilli Mocha','chilli-mocha-mocha-serisi',NULL,210.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(156,28,'V60','v60-demleme-geleneksel',NULL,200.00,'TRY',NULL,NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(157,28,'Filter Coffee','filter-coffee-demleme-geleneksel',NULL,150.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(158,28,'Türk Kahvesi','turk-kahvesi-demleme-geleneksel',NULL,110.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(159,28,'Türk Kahvesi (Double)','turk-kahvesi-double-demleme-geleneksel',NULL,170.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(160,28,'Türk Çayı','turk-cayi-demleme-geleneksel',NULL,50.00,'TRY',NULL,NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(161,28,'Türk Çayı (Double)','turk-cayi-double-demleme-geleneksel',NULL,75.00,'TRY',NULL,NULL,1,0,50,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(162,29,'Cold Brew','cold-brew-iced-coffees',NULL,200.00,'TRY',NULL,NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(163,29,'Iced Latte','iced-latte-iced-coffees',NULL,180.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(164,29,'Iced Americano','iced-americano-iced-coffees',NULL,170.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(165,29,'Iced Filter Coffee','iced-filter-coffee-iced-coffees',NULL,160.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(166,29,'Iced Filter Coffee','iced-filter-coffee-iced-coffees-2',NULL,240.00,'TRY',NULL,NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(167,30,'Iced Matcha Latte Specials','iced-matcha-latte-specials-matcha-serisi',NULL,280.00,'TRY',NULL,NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(168,30,'Iced Matcha Latte','iced-matcha-latte-matcha-serisi',NULL,260.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(169,30,'Matcha Latte','matcha-latte-matcha-serisi',NULL,250.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(170,31,'Iced Mocha','iced-mocha-serin-lezzetler',NULL,250.00,'TRY',NULL,NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(171,31,'Iced Latte','iced-latte-serin-lezzetler',NULL,240.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(172,31,'Iced Mocha','iced-mocha-serin-lezzetler-2',NULL,240.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(173,31,'Fresh Lime','fresh-lime-serin-lezzetler',NULL,230.00,'TRY',NULL,NULL,1,0,30,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(174,31,'Buzlu Çaylar','buzlu-caylar-serin-lezzetler',NULL,230.00,'TRY',NULL,NULL,1,0,40,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(175,32,'Frozen','frozen-frappe-frozen-milkshake',NULL,250.00,'TRY',NULL,NULL,1,0,0,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(176,32,'Frappe','frappe-frappe-frozen-milkshake',NULL,240.00,'TRY',NULL,NULL,1,0,10,'2026-05-18 08:53:36','2026-05-18 08:53:36'),
(177,32,'Milkshake','milkshake-frappe-frozen-milkshake',NULL,230.00,'TRY',NULL,NULL,1,0,20,'2026-05-18 08:53:36','2026-05-18 08:53:36');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seo_settings`
--

DROP TABLE IF EXISTS `seo_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seo_settings` (
  `key` varchar(120) NOT NULL,
  `value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo_settings`
--

LOCK TABLES `seo_settings` WRITE;
/*!40000 ALTER TABLE `seo_settings` DISABLE KEYS */;
INSERT INTO `seo_settings` VALUES
('meta_description','Lume Mia; sıcak ve soğuk kahveleri, kahvaltı seçenekleri, sandviçleri, bowl tabakları ve samimi atmosferiyle sizlere keyifli bir mekan deneyimi sunar.','2026-05-18 08:22:03'),
('meta_keywords','lume mia cafe, lume mia, cafe, kahve, soğuk kahve, sıcak kahve, kahvaltı, sandviç, bowl, kafe, taze lezzetler, coffee shop','2026-05-18 08:22:03'),
('meta_title','Lume Mia | Kahve, Kahvaltı ve Taze Lezzetler','2026-05-18 08:22:03'),
('og_image','','2026-05-18 08:19:04'),
('robots_txt','User-agent: *\nAllow: /\nSitemap: /sitemap.xml','2026-05-18 08:19:04'),
('tracking_body','','2026-05-18 08:19:04'),
('tracking_head','','2026-05-18 08:19:04');
/*!40000 ALTER TABLE `seo_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_settings`
--

DROP TABLE IF EXISTS `shop_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_settings` (
  `key` varchar(120) NOT NULL,
  `value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_settings`
--

LOCK TABLES `shop_settings` WRITE;
/*!40000 ALTER TABLE `shop_settings` DISABLE KEYS */;
INSERT INTO `shop_settings` VALUES
('shop.address','Bomonti Mah. Cumhuriyet Cad. No:14, ??i??li / ??stanbul','2026-05-05 15:27:11'),
('shop.email','merhaba@lumemia.coffee','2026-05-05 15:27:11'),
('shop.hours.weekday','07:00 ??? 21:00','2026-05-05 15:27:11'),
('shop.hours.weekend','08:00 ??? 22:00','2026-05-05 15:27:11'),
('shop.name','Lume Mia Coffee','2026-05-05 15:27:11'),
('shop.phone','+90 (212) 555 01 19','2026-05-05 15:27:11'),
('shop.tagline','Botanik demlemeler, yava????a servis edilir.','2026-05-05 15:27:11'),
('social.instagram','https://instagram.com/lumemia.coffee','2026-05-05 15:27:11'),
('social.maps','https://maps.app.goo.gl/lumemia','2026-05-05 15:27:11'),
('social.tiktok','https://tiktok.com/@lumemia.coffee','2026-05-05 15:27:11');
/*!40000 ALTER TABLE `shop_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_content`
--

DROP TABLE IF EXISTS `site_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_content` (
  `key` varchar(160) NOT NULL,
  `value_tr` text DEFAULT NULL,
  `group` varchar(80) NOT NULL DEFAULT 'general',
  `label` varchar(200) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_content`
--

LOCK TABLES `site_content` WRITE;
/*!40000 ALTER TABLE `site_content` DISABLE KEYS */;
INSERT INTO `site_content` VALUES
('barista.cta','Ekibimizle tan??????n','barista','Buton Metni','2026-05-05 15:27:22'),
('barista.tags','','barista','Etiketler','2026-05-15 13:25:36'),
('barista.title','BARİSTA ZANAATI','barista','Ba??l??k','2026-05-15 12:43:58'),
('botanical.body','Taze lezzetler. Sıcak kahveler. Keyifli anlar.','botanical','A????klama','2026-05-15 12:24:31'),
('botanical.cta','Hikayemizi okuyun','botanical','Buton Metni','2026-05-07 11:17:52'),
('botanical.title','LUME MIA\nDENEYİMİ','botanical','Ba??l??k','2026-05-15 12:24:59'),
('brand.logo_text','','brand','Header Logo Yazısı','2026-05-15 12:13:26'),
('brand.name','Lume Mia','brand','Marka Ad??','2026-05-18 09:05:54'),
('brand.tagline','Güzel anlarınızın ortak noktası','brand','Slogan','2026-05-15 11:51:27'),
('brand.watermark','Lume Mia','brand','Logo Filigran??','2026-05-05 15:27:22'),
('footer.accessibility','Erişilebilirlik','footer','Eri??ilebilirlik Linki','2026-05-15 12:38:26'),
('footer.call_title','İLETİŞİM İÇİN','footer','Arama Ba??l??????','2026-05-15 12:38:51'),
('footer.copyright','© 2026 Lume Mia. Tüm hakları saklıdır.','footer','Telif Metni','2026-05-15 12:38:54'),
('footer.email','merhaba@lumemia.cafe','footer','E-posta','2026-05-15 15:37:49'),
('footer.field_email','E-posta adresiniz','footer','E-posta Placeholder','2026-05-05 15:27:22'),
('footer.field_message','Mesajınız','footer','Mesaj Placeholder','2026-05-15 12:40:14'),
('footer.field_name','Adınız','footer','??sim Placeholder','2026-05-15 12:40:14'),
('footer.field_submit','Mesaj gönder','footer','G??nder Butonu','2026-05-15 12:40:14'),
('footer.link_menu','Menü','footer','Men?? Ba??lant??s??','2026-05-15 12:40:14'),
('footer.link_story','Hikayemiz','footer','Hik??ye Ba??lant??s??','2026-05-15 12:40:14'),
('footer.link_visit','Ziyaret','footer','Ziyaret Ba??lant??s??','2026-05-05 15:27:22'),
('footer.links_title','Hızlı Erişim','footer','Ba??lant??lar Ba??l??????','2026-05-15 12:40:14'),
('footer.note_sent','Mesajınız gönderildi!','footer','G??nderildi Ba??l??????','2026-05-15 12:40:14'),
('footer.note_sent_sub','24 saat içinde size dönüş yapacağız.','footer','G??nderildi Alt Yaz??','2026-05-15 12:41:11'),
('footer.note_title','BiR NOT BIRAKIN','footer','Not Ba??l??????','2026-05-15 12:38:26'),
('footer.phone','0532 406 42 62','footer','Telefon','2026-05-18 09:04:25'),
('footer.privacy','Gizlilik','footer','Gizlilik Linki','2026-05-05 15:27:22'),
('footer.social_fb','','footer','Facebook Etiketi','2026-05-07 11:10:30'),
('footer.social_fb_url','','footer','Facebook URL','2026-05-07 11:10:30'),
('footer.social_ig_url','https://www.instagram.com/lumemiacoffee/','footer','Instagram URL','2026-05-07 11:03:50'),
('footer.social_tt','','footer','TikTok Etiketi','2026-05-07 11:10:30'),
('footer.social_tt_url','','footer','TikTok URL','2026-05-07 11:10:30'),
('hero.cta','Menüyü Keşfet','hero','Buton Metni','2026-05-07 11:15:10'),
('hero.main_title','TAZE \nKAHVELER','hero','Ana Ba??l??k','2026-05-15 12:11:42'),
('hero.tags','','hero','Etiketler','2026-05-05 15:27:22'),
('intro.body','Lume Mia, özenle hazırlanan sıcak ve soğuk kahveleri, taze kahvaltı seçenekleri, doyurucu sandviçleri ve sağlıklı bowl tabaklarıyla günün her anına keyif katar. Sakin atmosferi ve lezzetli menüsüyle kahve molalarınız için sizi bekliyoruz.','intro','Intro açıklama metni','2026-05-15 13:01:51'),
('intro.kicker','Lume Mia','intro','Intro üst etiketi','2026-05-18 09:06:07'),
('intro.metric_1','TAZE KAHVELER','intro','Intro kısa vurgu 1','2026-05-15 13:02:22'),
('intro.metric_2','GÜNLÜK LEZZETLER','intro','Intro kısa vurgu 2','2026-05-15 13:02:22'),
('intro.metric_3','SICAK ATMOSFER','intro','Intro kısa vurgu 3','2026-05-15 13:02:22'),
('intro.title','KAHVENİN VE\nLEZZETİN\nBULUŞMA NOKTASI','intro','Intro ana başlık','2026-05-15 13:01:22'),
('media.barista.at_work','/uploads/site-barista_20260518_090049_a4fd8935.webp','media-barista','Sol ??st Bindirme ?? ???? Ba????nda','2026-05-18 09:00:50'),
('media.barista.hands','/images/barista_hands.jpg','media-barista','Sa?? B??y??k Kart ?? Eller','2026-05-05 15:27:23'),
('media.barista.portrait','/uploads/site-barista_20260515_115803_fa76ad16.webp','media-barista','Sol Portre Kart??','2026-05-15 11:58:05'),
('media.hero.collage','/uploads/site-hero_20260518_083131_8fec5a9a.webp','media-hero','Sa?? B??y??k Kart ?? Mek??n','2026-05-18 08:31:32'),
('media.hero.latte','/uploads/site-hero_20260518_083203_f0be605d.webp','media-hero','Sol Kart ?? Latte Detay??','2026-05-18 08:32:05'),
('media.hero.pour_overlay','/uploads/site-hero_20260515_115407_3771b54d.webp','media-hero','Sol ??st Bindirme ?? Ak??tma An??','2026-05-15 11:54:09'),
('media.plant.background','/uploads/site-plant_20260515_115701_12ce2c53.webp','media-plant','Ana Kart ?? Haz??rl??k','2026-05-15 11:57:03'),
('media.plant.jug','/uploads/site-plant_20260515_143923_4496615d.webp','media-plant','Bindirme Kart?? ?? S??rahi','2026-05-15 14:39:24'),
('media.roasted.beans_1','/images/beans_01.jpg','media-roasted','??ekirdek 1','2026-05-05 15:27:22'),
('media.roasted.beans_2','/images/beans_02.jpg','media-roasted','??ekirdek 2','2026-05-05 15:27:22'),
('media.roasted.beans_3','/images/beans_03.jpg','media-roasted','??ekirdek 3','2026-05-05 15:27:22'),
('media.roasted.beans_4','/images/beans_04.jpg','media-roasted','??ekirdek 4','2026-05-05 15:27:22'),
('media.roasted.cup','/uploads/site-roasted_20260518_083414_2c36e450.webp','media-roasted','??st Kart ?? Fincan','2026-05-18 08:34:17'),
('media.roasted.machine','/images/roasting_machine.jpg','media-roasted','Sa?? Kart ?? Kavurma Makinesi','2026-05-05 15:27:23'),
('media.selection.closeup','/uploads/site-selection_20260518_083659_dd4926c6.webp','media-selection','Orta Kart ?? Yak??n ??ekim','2026-05-18 08:37:22'),
('media.selection.origin','/uploads/site-selection_20260518_083707_88c6e111.webp','media-selection','Sa?? Kart ?? K??ken','2026-05-18 08:37:22'),
('media.selection.variety','/uploads/site-selection_20260518_083721_4b54617e.webp','media-selection','Sol Kart ?? ??e??itler','2026-05-18 08:37:22'),
('media.slowdown.interior','/uploads/site-slowdown_20260515_120012_2272eac1.webp','media-slowdown','Sa?? Kart ?? Mek??n ????i','2026-05-15 12:00:13'),
('media.slowdown.plants','/uploads/site-slowdown_20260515_115842_7e531bdf.webp','media-slowdown','Sol Kart ?? Bitki Duvar??','2026-05-15 11:58:43'),
('media.taste.hand','/uploads/site-taste_20260518_085923_1ee39b82.webp','media-taste','Sol Kart ?? El ve Fincan','2026-05-18 08:59:25'),
('media.taste.latte','/uploads/site-taste_20260518_083331_c750bc83.webp','media-taste','Orta Kart ?? Latte Art','2026-05-18 08:33:32'),
('media.taste.pour','/uploads/site-taste_20260515_115605_02045b7f.webp','media-taste','Sa?? Kart ?? Ak??tma An??','2026-05-15 11:56:09'),
('media.visit.interior','/images/visit_interior.jpg','media-visit','Mek??n Foto??raf??','2026-05-05 15:27:23'),
('menu.extras_note','Hafif tatl??lar her g??n taze ??? bug??n??n se??imi i??in baristam??za dan??????n.','menu','Ekstralar Notu','2026-05-05 15:27:22'),
('menu.extras_title','EKSTRALAR','menu','Ekstralar Ba??l??????','2026-05-05 15:27:22'),
('menu.subtitle','Günün her anına eşlik eden taze kahveler, kahvaltılıklar, sandviçler ve bowl lezzetleri. Tüm fiyatlara KDV dahildir.','menu','Alt Ba??l??k','2026-05-15 13:23:29'),
('menu.tag_hot','sıcak','menu','S??cak Etiket','2026-05-15 12:45:37'),
('menu.tag_iced','soğuk','menu','So??uk Etiket','2026-05-15 12:45:37'),
('menu.title','MENÜ','menu','Ba??l??k','2026-05-15 12:44:28'),
('nav.contact','İLETİŞİM','nav','??leti??im','2026-05-15 12:15:15'),
('nav.menu','MENÜ','nav','Men??','2026-05-15 12:15:15'),
('nav.story','HİKAYEMİZ','nav','Hik??ye','2026-05-15 12:15:15'),
('nav.visit','ZİYARET','nav','Ziyaret','2026-05-15 12:15:15'),
('newsletter.body','Yeni lezzetlerimizden, özel duyurularımızdan ve Lume Mia’daki keyifli anlardan ilk siz haberdar olun.','newsletter','A????klama','2026-05-15 14:50:55'),
('newsletter.cta','Abone ol','newsletter','Buton Metni','2026-05-05 15:27:22'),
('newsletter.cta_done','Abone olundu!','newsletter','Tamamland?? Butonu','2026-05-05 15:27:22'),
('newsletter.placeholder','E-posta adresiniz','newsletter','Placeholder','2026-05-05 15:27:11'),
('newsletter.social_fb','','newsletter','Facebook Etiketi','2026-05-07 11:10:07'),
('newsletter.social_ig','Instagram','newsletter','Instagram Etiketi','2026-05-05 15:27:22'),
('newsletter.social_tt','','newsletter','TikTok Etiketi','2026-05-07 11:10:07'),
('newsletter.success','Katıldığınız için teşekkürler! Hoş geldiniz notumuz için gelen kutunuzu kontrol edin.','newsletter','Ba??ar?? Mesaj??','2026-05-07 11:08:31'),
('newsletter.title','LUME MIA\nAİLESİNE\nKATILIN','newsletter','Ba??l??k','2026-05-15 14:50:55'),
('plant.body','Lume Mia ailesi olarak sizlere günün her anına eşlik edecek serinletici ve taze içecekler sunuyoruz. Mevsime uygun seçeneklerimizle, kısa bir mola vermek ya da keyifli vakit geçirmek isteyen herkesi ferah bir deneyime davet ediyoruz.','plant','A????klama','2026-05-15 14:30:34'),
('plant.cta','Vegan se??enekleri g??r','plant','Buton Metni','2026-05-05 15:27:22'),
('plant.tags','','plant','Etiketler','2026-05-05 15:27:22'),
('plant.title','FERAH\nLEZZETLER\nSİZİ BEKLİYOR','plant','Ba??l??k','2026-05-15 14:30:34'),
('roasted.body','Lume Mia’da sizlere özenle hazırlanan içecekler, taze lezzetler ve keyifli bir deneyim sunuyoruz. Her detayda kaliteye, tazeliğe ve samimi bir servis anlayışına önem veriyoruz.','roasted','A????klama','2026-05-15 15:17:51'),
('roasted.cta','Bug??n??n kavurmas??n?? sor','roasted','Buton Metni','2026-05-05 15:27:22'),
('roasted.title','ÖZENLE\nHAZIRLANAN\nLEZZETLER','roasted','Ana Ba??l??k','2026-05-15 12:42:26'),
('selection.body','Taze lezzetler, özenle hazırlanan içecekler ve samimi atmosferimizle sizleri Lume Mia’ya bekliyoruz.','selection','A????klama','2026-05-15 13:04:43'),
('selection.cta','Tüm menüyü gör','selection','Buton Metni','2026-05-15 13:05:41'),
('selection.ring','· KAHVALTI · BOWL · SANDVİÇ · SICAK & SOĞUK İÇECEKLER ·','selection','Halka Yaz??s??','2026-05-15 13:06:19'),
('slowdown.body','Lume Mia ailesi olarak sizlere günün yorgunluğunu geride bırakabileceğiniz, keyifle vakit geçirebileceğiniz sıcak ve huzurlu bir ortam sunuyoruz.','slowdown','A????klama','2026-05-15 12:31:00'),
('slowdown.cta','','slowdown','Buton Metni','2026-05-15 19:33:04'),
('slowdown.title','ŞEHRİN\nİÇİNDE\nSAKİN BİR DURAK','slowdown','Ba??l??k','2026-05-15 12:27:21'),
('story.body_html','<h2><br></h2><p><strong>Lume Mia, 2026 yılında kahveyi, taze lezzetleri ve keyifli molaları bir araya getirmek amacıyla kuruldu.</strong><br>\nBizim için iyi bir kafe deneyimi sadece güzel bir kahveden ibaret değil; güne iyi başlayan bir kahvaltı, arkadaşlarla paylaşılan sıcak bir sohbet, ferahlatıcı bir soğuk içecek ya da doyurucu bir sandviçle tamamlanan özel bir an demek.</p><p>Mekanımız; sakin atmosferi, sıcak dekorasyonu ve samimi servis anlayışıyla misafirlerine kendini rahat hissedeceği bir alan sunmak için tasarlandı. Lume Mia\'da her detay, günün yoğunluğuna kısa ama keyifli bir mola vermeniz için düşünülür.</p><h2>Ne Yapıyoruz?</h2><p>Sıcak ve soğuk kahveler, kahvaltı seçenekleri, taze sandviçler, bowl tabakları ve günün farklı saatlerine eşlik eden lezzetli ürünler hazırlıyoruz. Menüdeki her üründe tazeliğe, dengeli lezzete ve özenli sunuma önem veriyoruz.</p><h2>Neden Buradayız?</h2><p>Şehrin temposu içinde insanların nefes alabileceği, kaliteli kahve içebileceği ve lezzetli ürünlerle keyifli vakit geçirebileceği bir buluşma noktası olmak için buradayız.<br>\nLume Mia\'da her fincan, her tabak ve her detay sizi biraz daha yavaşlamaya ve anın tadını çıkarmaya davet eder.</p>','story','Ana Metin (Zengin)','2026-05-15 12:18:31'),
('story.cta_label','Menüyü incele','story','Buton Metni','2026-05-15 11:52:28'),
('story.eyebrow','HİKAYEMİZ','story','??st Etiket','2026-05-15 11:52:28'),
('story.image','/uploads/story_20260515_195013_8634092a.webp','story','Kahraman G??rseli','2026-05-15 19:50:15'),
('story.intro','Lume Mia, 2026 yılında keyifli molaları, taze lezzetleri ve samimi bir mekan deneyimini bir araya getirmek için kuruldu.','story','Spot Yaz??','2026-05-15 12:33:40'),
('story.title','KAHVE İLE\nBAŞLAYAN\nSICAK BİR\nHİKAYE','story','Ana Ba??l??k','2026-05-15 12:33:14'),
('taste.body','Taze kahvaltılıklar, doyurucu sandviçler ve hafif bowl tabaklarıyla günün her anına lezzetli bir mola.','taste','A????klama','2026-05-15 12:21:51'),
('taste.cta','Masa ay??rt','taste','Buton Metni','2026-05-05 15:27:22'),
('taste.title','GÜNÜN\nLEZZETLİ\nMOLASI','taste','Ba??l??k','2026-05-15 12:23:09'),
('visit.address','Huzurevleri, 77123. Sk. no:7, 01360 Çukurova/Adana','visit','Adres','2026-05-07 11:04:37'),
('visit.cta_directions','Yol tarifi al','visit','Y??n Tarifi Butonu','2026-05-05 15:27:22'),
('visit.cta_reserve','Masa ay??rt','visit','Rezervasyon Butonu','2026-05-05 15:27:22'),
('visit.email','merhaba@lumemia.coffee','visit','E-posta','2026-05-05 15:27:11'),
('visit.hours_label','Çalışma Saatleri','visit','Saatler Etiketi','2026-05-07 11:07:20'),
('visit.phone','0532 406 42 62','visit','Telefon','2026-05-18 09:04:03'),
('visit.title','BİZİ ZİYARET EDİN','visit','Ba??l??k','2026-05-07 11:07:09'),
('visit.weekday_hours','07:30 - 23:30','visit','Hafta ????i Saatleri','2026-05-07 11:06:47'),
('visit.weekday_label','Pzt - Cum','visit','Hafta ????i Etiketi','2026-05-07 11:06:47'),
('visit.weekend_hours','07:30 - 23:30','visit','Hafta Sonu Saatleri','2026-05-07 11:06:47'),
('visit.weekend_label','Cmt - Paz','visit','Hafta Sonu Etiketi','2026-05-07 11:06:47');
/*!40000 ALTER TABLE `site_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(120) DEFAULT NULL,
  `role` varchar(40) NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'admin','$2y$12$BjI1BgsMfes/Eck3YtVvNOaJurjITigAn0FcoGM74QGkFa7ajow5e','Yönetici','admin','2026-05-05 15:27:28','2026-05-18 08:16:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'lumemia'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-18 10:31:39
