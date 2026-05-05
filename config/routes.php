<?php

declare(strict_types=1);

use Lumemia\API\V1\Admin\CategoriesController as AdminCategories;
use Lumemia\API\V1\Admin\ProductsController as AdminProducts;
use Lumemia\API\V1\Admin\SiteContentController as AdminContent;
use Lumemia\API\V1\Admin\AppearanceController as AdminAppearance;
use Lumemia\API\V1\Admin\UploadController as AdminUploads;
use Lumemia\API\V1\Controllers\AuthController;
use Lumemia\API\V1\Controllers\ContentController;
use Lumemia\API\V1\Controllers\MenuController;
use Lumemia\API\V1\Controllers\AppearanceController;
use Lumemia\API\V1\StatusController;
use Lumemia\Auth\AuthGuard;
use Lumemia\Auth\Jwt;
use Lumemia\Http\Request;
use Lumemia\Http\Router;

return static function (Router $router, array $dbConfig): void {
    $jwt   = new Jwt(getenv('JWT_SECRET') ?: 'dev-only-insecure-secret-please-change');
    $guard = new AuthGuard($jwt);

    // ---------- Public ----------
    $router->get('/api', static fn (): array => [
        'status'   => 'ok',
        'service'  => 'Lume Mia Coffee API',
        'versions' => ['v1' => '/api/v1'],
    ]);

    $router->get ('/api/v1/status',     new StatusController($dbConfig));
    $router->get ('/api/v1/menu',       new MenuController());
    $router->get ('/api/v1/content',    new ContentController());
    $router->get ('/api/v1/appearance', new AppearanceController());

    // ---------- Auth ----------
    $auth = new AuthController($jwt);
    $router->post('/api/v1/auth/login', fn (Request $r) => $auth->login($r));
    $router->get ('/api/v1/auth/me',    function (Request $r) use ($guard, $auth) {
        $claims = $guard->require($r);
        return $auth->me($r->withParams(array_merge($r->params, ['__claims' => $claims])));
    });

    // ---------- Admin (Bearer required) ----------
    $protect = static function (callable $handler) use ($guard): callable {
        return static function (Request $r) use ($guard, $handler) {
            $claims = $guard->require($r);
            return $handler($r->withParams(array_merge($r->params, ['__claims' => $claims])));
        };
    };

    // Categories
    $cat = new AdminCategories();
    $router->get   ('/api/v1/admin/categories',      $protect(fn (Request $r) => $cat->index($r)));
    $router->post  ('/api/v1/admin/categories',      $protect(fn (Request $r) => $cat->create($r)));
    $router->put   ('/api/v1/admin/categories/{id}', $protect(fn (Request $r) => $cat->update($r)));
    $router->delete('/api/v1/admin/categories/{id}', $protect(fn (Request $r) => $cat->delete($r)));

    // Products
    $prod = new AdminProducts();
    $router->get   ('/api/v1/admin/products',      $protect(fn (Request $r) => $prod->index($r)));
    $router->post  ('/api/v1/admin/products',      $protect(fn (Request $r) => $prod->create($r)));
    $router->put   ('/api/v1/admin/products/{id}', $protect(fn (Request $r) => $prod->update($r)));
    $router->delete('/api/v1/admin/products/{id}', $protect(fn (Request $r) => $prod->delete($r)));

    // Site content
    $content = new AdminContent();
    $router->get   ('/api/v1/admin/content',       $protect(fn (Request $r) => $content->index($r)));
    $router->put   ('/api/v1/admin/content',       $protect(fn (Request $r) => $content->bulkUpdate($r)));

    // Appearance
    $app = new AdminAppearance();
    $router->get('/api/v1/admin/appearance', $protect(fn (Request $r) => $app->index($r)));
    $router->put('/api/v1/admin/appearance', $protect(fn (Request $r) => $app->bulkUpdate($r)));
    $router->delete('/api/v1/admin/content/{key}', $protect(fn (Request $r) => $content->delete($r)));

    // Uploads (multipart/form-data)
    $up = new AdminUploads();
    $router->post('/api/v1/admin/uploads/image', $protect(fn (Request $r) => $up->image($r)));
    $router->post('/api/v1/admin/uploads/video', $protect(fn (Request $r) => $up->video($r)));
};
