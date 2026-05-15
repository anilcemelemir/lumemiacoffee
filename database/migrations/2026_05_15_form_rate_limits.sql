CREATE TABLE IF NOT EXISTS form_rate_limits (
    id                 INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    action             VARCHAR(40)     NOT NULL,
    ip_hash            CHAR(64)        NOT NULL,
    attempts           SMALLINT        NOT NULL DEFAULT 0,
    window_started_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_form_rate_limits_action_ip (action, ip_hash),
    KEY idx_form_rate_limits_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
