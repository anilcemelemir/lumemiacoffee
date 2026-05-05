<?php

declare(strict_types=1);

namespace Lumemia\Support;

final class Slug
{
    private const TR_MAP = [
        'ç' => 'c', 'Ç' => 'c',
        'ğ' => 'g', 'Ğ' => 'g',
        'ı' => 'i', 'I' => 'i',
        'İ' => 'i', 'i' => 'i',
        'ö' => 'o', 'Ö' => 'o',
        'ş' => 's', 'Ş' => 's',
        'ü' => 'u', 'Ü' => 'u',
    ];

    public static function make(string $value): string
    {
        $value = strtr($value, self::TR_MAP);
        $value = mb_strtolower($value, 'UTF-8');
        $value = preg_replace('~[^a-z0-9]+~', '-', $value) ?? '';
        $value = trim($value, '-');
        return $value !== '' ? $value : 'urun';
    }
}
