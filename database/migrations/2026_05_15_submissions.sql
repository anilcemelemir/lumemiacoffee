CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    email       VARCHAR(190)    NOT NULL,
    source      VARCHAR(60)     NOT NULL DEFAULT 'website',
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,
    ip_address  VARCHAR(45)     NULL,
    user_agent  VARCHAR(500)    NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_newsletter_subscribers_email (email),
    KEY idx_newsletter_subscribers_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name        VARCHAR(160)    NOT NULL,
    email       VARCHAR(190)    NOT NULL,
    message     TEXT            NOT NULL,
    status      VARCHAR(20)     NOT NULL DEFAULT 'new',
    consent     TINYINT(1)      NOT NULL DEFAULT 1,
    ip_address  VARCHAR(45)     NULL,
    user_agent  VARCHAR(500)    NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_contact_messages_status_created (status, created_at),
    KEY idx_contact_messages_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
