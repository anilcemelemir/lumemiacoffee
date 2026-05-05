FROM php:8.3-fpm-alpine

# System deps for building PHP extensions (GD with WebP, JPEG, PNG, Freetype)
RUN apk add --no-cache \
        bash \
        git \
        unzip \
        icu-dev \
        oniguruma-dev \
        libzip-dev \
        libwebp-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        freetype-dev \
    && docker-php-ext-configure gd --with-webp --with-jpeg --with-freetype \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_mysql \
        mysqli \
        intl \
        opcache \
        zip \
        gd

# Composer (latest)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Sensible PHP defaults + upload limits for media (images / short videos up to 16 MB)
RUN { \
        echo 'display_errors=Off'; \
        echo 'log_errors=On'; \
        echo 'error_log=/proc/self/fd/2'; \
        echo 'expose_php=Off'; \
        echo 'date.timezone=UTC'; \
        echo 'upload_max_filesize=16M'; \
        echo 'post_max_size=20M'; \
        echo 'memory_limit=256M'; \
        echo 'max_execution_time=60'; \
    } > /usr/local/etc/php/conf.d/zz-app.ini

WORKDIR /var/www/html

# Default php-fpm CMD inherited from base image
