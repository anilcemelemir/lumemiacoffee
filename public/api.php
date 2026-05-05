<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Lumemia\Database\Database;
use Lumemia\Http\Cors;
use Lumemia\Http\Request;
use Lumemia\Http\Response;
use Lumemia\Http\Router;

set_exception_handler(static function (Throwable $e): void {
    Response::error(
        message: 'Internal Server Error',
        status: 500,
        extra: ['detail' => $e->getMessage()],
    );
});

(new Cors())->apply();

/** @var array<string, mixed> $dbConfig */
$dbConfig = require dirname(__DIR__) . '/config/database.php';
Database::boot($dbConfig);

$router = new Router();

/** @var Closure(Router, array): void $register */
$register = require dirname(__DIR__) . '/config/routes.php';
$register($router, $dbConfig);

$router->dispatch(Request::capture());
